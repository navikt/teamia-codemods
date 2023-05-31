import { setJsxName } from "../../../utils/jsxName";
import {
  attributeIsNamed,
  getRawAttributeValue,
} from "../../../utils/jsxAttributes";
import { findImports, getImportData } from "../../../utils/imports";
import { ImmutableMap, notUndefined } from "../../../utils/otherUtils";

function mapTypeToSize(value: unknown) {
  const typeToSizeMapping: ImmutableMap<string, string> = new Map<
    string,
    string
  >([
    ["XXXL", "3xlarge"],
    ["XXL", "2xlarge"],
    ["XL", "xlarge"],
    ["L", "large"],
    ["M", "medium"],
    ["S", "small"],
    ["XS", "xsmall"],
    ["XXS", "xsmall"],
  ]);

  if (typeof value === "string" && typeToSizeMapping.has(value)) {
    return typeToSizeMapping.get(value);
  }
  return "medium";
}
export default function transformer(file, api) {
  if (
    file.path !== undefined &&
    (file.path.endsWith(".less") ||
      file.path.endsWith(".sass") ||
      file.path.endsWith(".css"))
  ) {
    console.log("Transform is not applicable to file type, skipping.");
    return;
  }

  /**
   * Deklarer state
   */
  const j = api.jscodeshift;
  const root = j(file.source);

  const navFrontendPath = findImports(root, "nav-frontend-spinner");
  const dsReactPath = findImports(root, "@navikt/ds-react");

  // Early return if file does not import component
  if (navFrontendPath.size() === 0) {
    return;
  }

  const importNames = getImportData(navFrontendPath);
  const jsxElements = importNames.map((imp) => ({
    importData: imp,
    jsxElements: root.findJSXElements(imp.localName),
  }));

  /**
   * Endrer state
   */
  if (dsReactPath.size() === 0) {
    navFrontendPath.replaceWith(
      j.importDeclaration(
        [j.importSpecifier(j.jsxIdentifier("Loader"))],
        j.stringLiteral("@navikt/ds-react")
      )
    );
  } else {
    dsReactPath.forEach((declaration) => {
      const importDeclarations = declaration.node.specifiers;
      if (
        !importDeclarations.some((specifier) => {
          return (
            specifier.type === "ImportSpecifier" &&
            specifier.local.name === "Loader"
          );
        })
      ) {
        declaration.node.specifiers = [
          ...importDeclarations,
          j.importSpecifier(j.jsxIdentifier("Loader")),
        ];
        navFrontendPath.remove();
      }
    });
  }

  jsxElements?.forEach((imp) => {
    imp.jsxElements?.forEach((jsx) => {
      /**
       * Endrer navn på komponent
       */
      setJsxName(jsx.node, "Loader");

      /**
       * Endrer attributes / props
       */

      jsx.node.openingElement.attributes = jsx.node.openingElement.attributes
        .map((attr) => {
          if (attributeIsNamed(attr, "type")) {
            return j.jsxAttribute(
              j.jsxIdentifier("size"),
              j.stringLiteral(mapTypeToSize(getRawAttributeValue(attr)))
            );
          }
          return attr;
        })
        .filter(notUndefined);
    });
  });

  return root.toSource();
}
