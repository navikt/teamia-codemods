import { setJsxBaseName } from "../../../utils/jsxName";
import {
  getAttributeName,
  getRawAttributeValue,
} from "../../../utils/jsxAttributes";
import { findImport, getImportNames } from "../../../utils/imports";
import { createChild, createComments } from "../../../utils/jsxChildren";

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

  const navFrontendPath = findImport(root, "nav-frontend-lenkepanel");
  const dsReactPath = findImport(root, "@navikt/ds-react");

  // Early return if file does not import component
  if (navFrontendPath.size() === 0) {
    return;
  }

  const importNames = getImportNames(navFrontendPath);
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
        [j.importSpecifier(j.jsxIdentifier("LinkPanel"))],
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
            specifier.local.name === "LinkPanel"
          );
        })
      ) {
        declaration.node.specifiers = [
          ...importDeclarations,
          j.importSpecifier(j.jsxIdentifier("LinkPanel")),
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
      setJsxBaseName(jsx.node, "LinkPanel");

      /**
       * Legger til children
       */

      jsx.node.children = [
        createChild(["LinkPanel", "Title"], jsx.node.children, []),
        ...createComments([
          "TODO: sjekk at LinkPanel.Title og LinkPanel.Description er satt riktig",
          "transform kan ikke programatisk skille hva som skal være hva",
          "hvis du brukte tittelprops eller linkCreator så er du nødt til å fikse opp dette selv da programatisk migrering der er utenfor scope.",
        ]),
      ];

      /**
       * Endrer attributes / props
       */

      let attributes = jsx.node.openingElement.attributes;

      // Border har gått fra default false til default true
      // For å bevare oppførsel settes border false hvis prop ikke er tilstede.
      if (attributes.some((attr) => getAttributeName(attr) === "border")) {
        attributes = attributes.map((attr) => {
          if (getAttributeName(attr) === "border") {
            const val = getRawAttributeValue(attr);
            //<Lenkepanel border> || <Lenkepanel border={true}>
            if (val === null || val === true) {
              return j.jsxAttribute(j.jsxIdentifier("border"));
            }
            return j.jsxAttribute(
              j.jsxIdentifier("border"),
              j.jsxExpressionContainer(j.booleanLiteral(false))
            );
          }
          return attr;
        });
      } else {
        attributes = [
          ...attributes,
          j.jsxAttribute(
            j.jsxIdentifier("border"),
            j.jsxExpressionContainer(j.booleanLiteral(false))
          ),
        ];
      }

      attributes = attributes
        .map((attr) => {
          if (["linkCreator", "tittelProps"].includes(getAttributeName(attr))) {
            return undefined;
          }
          return attr;
        })
        .filter((e) => e !== undefined);

      jsx.node.openingElement.attributes = attributes;
    });
  });

  return root.toSource();
}
