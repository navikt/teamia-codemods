import { setJsxName } from "../../../utils/jsxName";
import {
  getPropValue,
  hasProp,
  replaceProp,
  setProp,
} from "../../../utils/jsxAttributes";
import {
  addImports,
  findImports,
  getImportData,
  removeImports,
} from "../../../utils/imports";
import { isNakedLiteral } from "../../../utils/typeKinds";
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

  const navFrontendPath = findImports(root, "nav-frontend-alertstriper");
  //const dsReactPath = findImports(root, "@navikt/ds-react");

  // Early return if file does not import alertstriper
  if (navFrontendPath.size() === 0) {
    return;
  }

  const importData = getImportData(navFrontendPath);
  const jsxElements = importData.map((imp) => ({
    importData: imp,
    jsxElements: root.findJSXElements(imp.localName),
  }));

  // Muter state:
  // hvis ds-react ikke finnes, lag den, ellers append Alert
  addImports(root, ["Alert"], "@navikt/ds-react");
  removeImports(
    root,
    [
      "*",
      "default",
      "AlertStripeInfo",
      "AlertStripeSuksess",
      "AlertStripeAdvarsel",
      "AlertStripeFeil",
    ],
    "nav-frontend-alertstriper"
  );

  jsxElements.forEach((imp) => {
    imp.jsxElements.forEach((jsx) => {
      /**
       * Endrer navn på komponentene
       */
      setJsxName(jsx.node, "Alert");

      const commentLines: string[] = [];

      switch (imp.importData.importedName) {
        case "AlertStripeFeil": {
          replaceProp(jsx, "type", "variant", "error");
          break;
        }
        case "AlertStripeSuksess": {
          replaceProp(jsx, "type", "variant", "success");
          break;
        }
        case "AlertStripeAdvarsel": {
          replaceProp(jsx, "type", "variant", "warning");
          break;
        }
        case "AlertStripeInfo": {
          replaceProp(jsx, "type", "variant", "info");
          break;
        }
        default: {
          const type = getPropValue(jsx, "type");
          if (isNakedLiteral(type)) {
            replaceProp(
              jsx,
              "type",
              "variant",
              getVariant(getPropValue(jsx, "type"))
            );
          } else {
            commentLines.push(
              "TODO: 'type' er blitt gjort om til 'variant', men siden det er brukt en variabel for å definere 'type' så kan ikke migreringscriptet automatisk konvertere."
            );
            setProp(jsx, "variant", "info");
          }
          break;
        }
      }

      if (hasProp(jsx, "size")) {
        const sizeValue = getPropValue(jsx, "size");
        if (isNakedLiteral(sizeValue)) {
          setProp(jsx, "size", getAkselSize(sizeValue));
        } else {
          commentLines.push(
            "TODO: 'size' er blitt gjort om til 'size=\"small\"|\"medium\"', men siden det er brukt en variabel for å definere 'size' så kan ikke migreringscriptet automatisk konvertere."
          );
        }
      }

      if (hasProp(jsx, "form")) {
        const form = getPropValue(jsx, "form");
        if (!isNakedLiteral(form)) {
          commentLines.push(
            "TODO: 'form' er blitt gjort om til 'inline=boolean', men siden det er brukt en variabel for å definere 'form' så kan ikke migreringscriptet automatisk konvertere."
          );
        }
        if (form === "inline") {
          replaceProp(jsx, "form", "inline", null);
        }
      }

      if (commentLines.length > 0) {
        jsx.insertBefore(...createComments(commentLines));
      }
    });
  });

  return root.toSource();
}
