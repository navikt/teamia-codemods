import core from "jscodeshift";
import { setJsxBaseName } from "../../../utils/jsxName";
import { parseAttribute } from "../../../utils/jsxAttributes";
import { findImport, getImportNames } from "../../../utils/imports";
import { notUndefined } from "../../../utils/otherUtils";
import { createComments } from "../../../utils/jsxElements";
const getAkselSize = (value: unknown): "medium" | "small" => {
  if (typeof value !== "number" && typeof value !== "string") return "medium";

  if (typeof value === "number") {
    return value < 24 ? "small" : "medium";
  }

  const num = parseInt(value);
  const re = /\D/g;

  if (isNaN(num)) {
    return "medium";
  }
  if (value.endsWith("rem") && num < 1.5) {
    return "small";
  }
  if (value.endsWith("em") && num < 1.5) {
    return "small";
  }
  if (value.endsWith("px") && num < 24) {
    return "small";
  }
  if (!re.test(value) && num < 24) {
    return "small";
  }
  return "medium";
};

function getVariant(value: unknown) {
  const typeVariantMap = new Map([
    ["info", "info"],
    ["suksess", "success"],
    ["advarsel", "warning"],
    ["feil", "error"],
  ]);
  return typeof value === "string" && typeVariantMap.has(value)
    ? typeVariantMap.get(value)
    : "info";
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

  // Deklarer state
  const j = api.jscodeshift;
  const root = j(file.source);

  const navFrontendPath = findImport(root, "nav-frontend-alertstriper");
  const dsReactPath = findImport(root, "@navikt/ds-react");

  // Early return if file does not import alertstriper
  if (navFrontendPath.size() === 0) {
    return;
  }

  const importNames = getImportNames(navFrontendPath);
  const jsxElements = importNames.map((imp) => ({
    importData: imp,
    jsxElements: root.findJSXElements(imp.localName),
  }));

  // Muter state:
  // hvis ds-react ikke finnes, lag den, ellers append Alert
  if (dsReactPath.size() === 0) {
    navFrontendPath.replaceWith(
      j.importDeclaration(
        [j.importSpecifier(j.jsxIdentifier("Alert"))],
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
            specifier.local.name === "Alert"
          );
        })
      ) {
        declaration.node.specifiers = [
          ...importDeclarations,
          j.importSpecifier(j.jsxIdentifier("Alert")),
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
      setJsxBaseName(jsx.node, "Alert");

      /**
       * Endrer navn og verdi på attributer
       */
      const alertVariantsMap = new Map<string, core.JSXAttribute>([
        [
          "AlertStripeFeil",
          j.jsxAttribute(j.jsxIdentifier("variant"), j.stringLiteral("error")),
        ],
        [
          "AlertStripeSuksess",
          j.jsxAttribute(
            j.jsxIdentifier("variant"),
            j.stringLiteral("success")
          ),
        ],
        [
          "AlertStripeAdvarsel",
          j.jsxAttribute(
            j.jsxIdentifier("variant"),
            j.stringLiteral("warning")
          ),
        ],
        [
          "AlertStripeInfo",
          j.jsxAttribute(j.jsxIdentifier("variant"), j.stringLiteral("info")),
        ],
      ]);

      let attributes = jsx.node.openingElement.attributes;

      if (imp.importData.type === "ImportSpecifier") {
        switch (imp.importData.localName) {
          case "AlertStripeFeil": {
            attributes = [
              alertVariantsMap.get("AlertStripeFeil"),
              ...attributes,
            ];
            break;
          }
          case "AlertStripeSuksess": {
            attributes = [
              alertVariantsMap.get("AlertStripeSuksess"),
              ...attributes,
            ];
            break;
          }
          case "AlertStripeAdvarsel": {
            attributes = [
              alertVariantsMap.get("AlertStripeAdvarsel"),
              ...attributes,
            ];
            break;
          }
          case "AlertStripeInfo": {
            attributes = [
              alertVariantsMap.get("AlertStripeInfo"),
              ...attributes,
            ];
            break;
          }
          default:
            break;
        }
      }

      const commentLines: string[] = [];

      attributes = attributes
        .map((attr) => {
          const parsed = parseAttribute(attr);

          if (parsed.type !== "JSXSpreadAttribute") {
            switch (parsed.name) {
              case "type":
                return j.jsxAttribute(
                  j.jsxIdentifier("variant"),
                  j.stringLiteral(getVariant(parsed.rawValue))
                );
              case "size":
                return j.jsxAttribute(
                  j.jsxIdentifier("size"),
                  j.stringLiteral(getAkselSize(parsed.rawValue))
                );
              case "form":
                return parsed.rawValue === "inline"
                  ? j.jsxAttribute(j.jsxIdentifier("inline"))
                  : undefined;
              default:
                return attr;
            }
          }

          switch (parsed.name) {
            case "type": {
              commentLines.push(
                "TODO: 'type' er blitt gjort om til 'variant', men siden det er brukt en variabel for å definere 'type' så kan ikke migreringscriptet automatisk konvertere."
              );
              return attr;
            }
            case "size": {
              commentLines.push(
                "TODO: 'size' er blitt gjort om til 'size=\"small\"|\"medium\"', men siden det er brukt en variabel for å definere 'size' så kan ikke migreringscriptet automatisk konvertere."
              );
              return attr;
            }
            case "form": {
              commentLines.push(
                "TODO: 'form' er blitt gjort om til 'inline=boolean', men siden det er brukt en variabel for å definere 'form' så kan ikke migreringscriptet automatisk konvertere."
              );
              return attr;
            }
            default:
              return attr;
          }
        })
        .filter(notUndefined);

      jsx.node.openingElement.attributes = attributes;

      if (commentLines.length > 0) {
        jsx.insertBefore(...createComments(commentLines));
      }
    });
  });

  return root.toSource();
}
