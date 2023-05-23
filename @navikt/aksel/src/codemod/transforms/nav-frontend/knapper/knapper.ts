import core from "jscodeshift";
import { setJsxBaseName } from "../../../utils/jsxName";
import {
  getAttributeName,
  getRawAttributeValue,
  parseAttribute,
} from "../../../utils/jsxAttributes";
import { findImport, getImportNames } from "../../../utils/imports";
import { notUndefined } from "../../../utils/otherUtils";
import { createComments } from "../../../utils/jsxChildren";

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

  const navFrontendPath = findImport(root, "nav-frontend-knapper");
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
        [j.importSpecifier(j.jsxIdentifier("Button"))],
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
            specifier.local.name === "Button"
          );
        })
      ) {
        declaration.node.specifiers = [
          ...importDeclarations,
          j.importSpecifier(j.jsxIdentifier("Button")),
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
      setJsxBaseName(jsx.node, "Button");

      /**
       * Endrer navn og verdi på attributer
       */
      //variant="primary"
      const alertVariantsMap = new Map<string, core.JSXAttribute>([
        [
          "Hovedknapp",
          j.jsxAttribute(
            j.jsxIdentifier("variant"),
            j.stringLiteral("primary")
          ),
        ],
        [
          "Knapp",
          j.jsxAttribute(
            j.jsxIdentifier("variant"),
            j.stringLiteral("secondary")
          ),
        ],
        [
          "Flatknapp",
          j.jsxAttribute(
            j.jsxIdentifier("variant"),
            j.stringLiteral("tertiary")
          ),
        ],
        [
          "Fareknapp",
          j.jsxAttribute(j.jsxIdentifier("variant"), j.stringLiteral("danger")),
        ],
      ]);

      function getVariant(value: unknown) {
        const typeVariantMap = new Map([
          ["hoved", "primary"],
          ["standard", "secondary"],
          ["flat", "tertiary"],
          ["fare", "danger"],
        ]);
        return typeof value === "string" && typeVariantMap.has(value)
          ? typeVariantMap.get(value)
          : "secondary";
      }

      let attributes = jsx?.node?.openingElement?.attributes;

      if (attributes === undefined) {
        attributes = [];
      }
      if (attributes.some((attr) => getAttributeName(attr) === "type")) {
        attributes = attributes.map((attr) => {
          if (getAttributeName(attr) === "type") {
            return j.jsxAttribute(
              j.jsxIdentifier("variant"),
              j.stringLiteral(getVariant(getRawAttributeValue(attr)))
            );
          }

          return attr;
        });
      } else {
        switch (imp.importData.localName) {
          case "Hovedknapp": {
            attributes = [alertVariantsMap.get("Hovedknapp"), ...attributes];
            break;
          }
          case "Knapp": {
            attributes = [alertVariantsMap.get("Knapp"), ...attributes];
            break;
          }
          case "Flatknapp": {
            attributes = [alertVariantsMap.get("Flatknapp"), ...attributes];
            break;
          }
          case "Fareknapp": {
            attributes = [alertVariantsMap.get("Fareknapp"), ...attributes];
            break;
          }
          default: {
            attributes = [alertVariantsMap.get("Knapp"), ...attributes];
            break;
          }
        }
      }

      const commentLine: string[] = [];

      attributes = attributes
        .map((attr) => {
          const parsed = parseAttribute(attr);

          if (parsed === undefined || parsed.type === undefined)
            return undefined;

          if (parsed.type !== "JSXSpreadAttribute") {
            switch (parsed.name) {
              case "spinner":
                return j.jsxAttribute(j.jsxIdentifier("loading"));
              case "mini": {
                if (
                  attributes.some(
                    (attr) => getAttributeName(attr) === "kompakt"
                  )
                ) {
                  return j.jsxAttribute(
                    j.jsxIdentifier("size"),
                    j.stringLiteral("xsmall")
                  );
                }
                return j.jsxAttribute(
                  j.jsxIdentifier("size"),
                  j.stringLiteral("small")
                );
              }
              case "kompakt": {
                if (
                  attributes.some((attr) => getAttributeName(attr) === "mini")
                ) {
                  return undefined;
                }
                return j.jsxAttribute(
                  j.jsxIdentifier("size"),
                  j.stringLiteral("small")
                );
              }
              default:
                return attr;
            }
          }

          switch (parsed.name) {
            case "spinner": {
              commentLine.push(
                "TODO: 'spinner' er blitt gjort om til 'loading', men siden det er brukt en variabel for å definere 'spinner' så kan ikke migreringscriptet automatisk konvertere."
              );
              return attr;
            }
            case "mini": {
              commentLine.push(
                "TODO: 'mini' er blitt gjort til en del av 'size', men siden det er brukt en variabel for å definere 'mini' så kan ikke migreringscriptet automatisk konvertere."
              );
              return attr;
            }
            case "kompakt": {
              commentLine.push(
                "TODO: 'kompakt' er blitt gjort til en del av 'size', men siden det er brukt en variabel for å definere 'kompakt' så kan ikke migreringscriptet automatisk konvertere."
              );
              return attr;
            }
            default:
              return attr;
          }
        })
        .filter(notUndefined);

      if (commentLine.length > 0) {
        jsx.insertBefore(...createComments(commentLine));
      }

      jsx.node.openingElement.attributes = attributes;
    });
  });

  return root.toSource();
}
