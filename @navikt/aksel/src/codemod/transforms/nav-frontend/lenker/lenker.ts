import { setJsxName } from "../../../utils/jsxName";
import { findImports, getImportData } from "../../../utils/imports";

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

  // Deklarer state
  const j = api.jscodeshift;
  const root = j(file.source);

  const navFrontendPath = findImports(root, "nav-frontend-lenker");
  const dsReactPath = findImports(root, "@navikt/ds-react");

  // Early return if file does not import alertstriper
  if (navFrontendPath.size() === 0) {
    return;
  }

  const importNames = getImportData(navFrontendPath);
  const jsxElements = importNames.map((imp) => ({
    importData: imp,
    jsxElements: root.findJSXElements(imp.localName),
  }));

  // Muter state:
  // hvis ds-react ikke finnes, lag den, ellers append Alert
  if (dsReactPath.size() === 0) {
    navFrontendPath.replaceWith(
      j.importDeclaration(
        [j.importSpecifier(j.jsxIdentifier("Link"))],
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
            specifier.local.name === "Link"
          );
        })
      ) {
        declaration.node.specifiers = [
          ...importDeclarations,
          j.importSpecifier(j.jsxIdentifier("Link")),
        ];
        navFrontendPath.remove();
      }
    });
  }

  jsxElements?.forEach((imp) => {
    imp.jsxElements?.forEach((jsx) => {
      /**
       * Endrer navn på komponentene
       */
      setJsxName(jsx.node, "Link");
    });
  });

  return root.toSource();
}
