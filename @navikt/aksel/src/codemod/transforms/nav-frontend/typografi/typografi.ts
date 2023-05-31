import * as Kinds from "ast-types/gen/kinds";
import { getJsxLeafName, setJsxName } from "../../../utils/jsxName";
import {
  getPropValue,
  removeProp,
  setProp,
} from "../../../utils/jsxAttributes";
import {
  addImports,
  findImports,
  getImportData,
  ImportDataElementBundle,
  removeImports,
} from "../../../utils/imports";
import { isStringLiteralKind } from "../../../utils/typeKinds";
import { isJsxText } from "../../../utils/jsxElements";
import { ASTPath } from "jscodeshift";

type TypographySize = "xlarge" | "large" | "medium" | "small" | "xsmall";

const headerRegEx = /[Hh]([1-6])/;

function capitalize(string: string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}

function isBodyShort(value: unknown) {
  if (isJsxText(value) || isStringLiteralKind(value))
    return value.value.trim().length < 20 && value.value.trim().length > 0;
  return false;
}

function handleHeader(
  jsxElement: ASTPath<Kinds.JSXElementKind>,
  size: TypographySize
) {
  setJsxName(jsxElement.node, "Heading");
  setProp(jsxElement, "size", size);

  const tagProp = getPropValue(jsxElement, "tag");
  if (typeof tagProp === "string") {
    const headerMatch = tagProp.match(headerRegEx);
    if (headerMatch !== null) {
      setProp(jsxElement, "level", headerMatch[1]);
    } else {
      setProp(jsxElement, "as", tagProp);
    }
  }
  removeProp(jsxElement, "tag");
}

function handleTypography(
  jsxElement: ASTPath<Kinds.JSXElementKind>,
  name: string
) {
  setJsxName(jsxElement.node, name);

  const tagProp = getPropValue(jsxElement, "tag");
  if (typeof tagProp === "string") {
    setProp(jsxElement, "as", tagProp);
  }
  removeProp(jsxElement, "tag");
}

function transformJsxElement(
  name: string,
  jsx: ASTPath<Kinds.JSXElementKind>,
  usedImports: Set<string>,
  commentLines: string[]
) {
  switch (name) {
    case "*": {
      const elementName = getJsxLeafName(jsx.node);
      transformJsxElement(elementName, jsx, usedImports, commentLines);
      return;
    }
    case "default": {
      const type = getPropValue(jsx, "type");
      if (typeof type === "string") {
        transformJsxElement(capitalize(type), jsx, usedImports, commentLines);
        return;
      }
      commentLines.push(
        "TODO: 'TypografiBase' kunne ikke konverteres da scriptet ikke kunne utlede hva 'type' var"
      );
      return;
    }
    case "Sidetittel": {
      handleHeader(jsx, "xlarge");
      usedImports.add("Heading");
      return;
    }
    case "Innholdstittel": {
      handleHeader(jsx, "large");
      usedImports.add("Heading");
      return;
    }
    case "Systemtittel": {
      handleHeader(jsx, "medium");
      usedImports.add("Heading");
      return;
    }
    case "Undertittel": {
      handleHeader(jsx, "small");
      usedImports.add("Heading");
      return;
    }
    case "Ingress": {
      handleTypography(jsx, "Ingress");
      usedImports.add("Ingress");
      return;
    }
    case "Element": {
      handleTypography(jsx, "Label");
      usedImports.add("Label");
      return;
    }
    case "Undertekst": {
      handleTypography(jsx, "Detail");
      usedImports.add("Detail");
      return;
    }
    case "Feilmelding": {
      handleTypography(jsx, "ErrorMessage");
      usedImports.add("ErrorMessage");
      return;
    }
    case "UndertekstBold": {
      handleTypography(jsx, "Detail");
      usedImports.add("Detail");
      commentLines.push(
        "TODO: 'UndertekstBold' har ingen en-til-en match i ds-react, må antagelig justere styling"
      );
      return;
    }
    case "Normaltekst": {
      if (jsx.node.children.some(isBodyShort)) {
        handleTypography(jsx, "BodyShort");
        usedImports.add("BodyShort");
        return;
      } else {
        handleTypography(jsx, "BodyLong");
        usedImports.add("BodyLong");
        return;
      }
    }
  }
}

export default function transformer(file, api) {
  if (
    file.path !== undefined &&
    (file.path.endsWith(".less") ||
      file.path.endsWith(".sass") ||
      file.path.endsWith(".css"))
  ) {
    //console.log("Transform is not applicable to file type, skipping.");
    return;
  }

  /**
   * Deklarer state
   */
  const j = api.jscodeshift;
  const root = j(file.source);

  const navFrontendPath = findImports(root, "nav-frontend-typografi");

  // Early return if file does not import component
  if (navFrontendPath.size() === 0) {
    return;
  }

  const importNames = getImportData(navFrontendPath);
  const jsxElements: ImportDataElementBundle[] = importNames.map((imp) => ({
    importData: imp,
    jsxElements: root.findJSXElements(imp.localName),
  }));

  const usedImports = new Set<string>();

  removeImports(
    root,
    importNames.map((importName) => importName.importedName),
    "nav-frontend-typografi"
  );

  jsxElements?.forEach((imp) => {
    imp.jsxElements?.forEach((jsx) => {
      const commentLines: string[] = [];
      transformJsxElement(
        imp.importData.importedName,
        jsx,
        usedImports,
        commentLines
      );
    });
  });

  addImports(root, Array.from(usedImports), "@navikt/ds-react");

  return root.toSource();
}
