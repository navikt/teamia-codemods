import { JSCodeshift, ASTPath } from "jscodeshift";
import { namedTypes } from "ast-types";
import { parseAttribute } from "../../../utils/jsxAttributes";
import { setJsxNames } from "../../../utils/jsxName";
import { matchName } from "./skjema";
import { ImportedElements } from "../../../utils/imports";

export default function TextareaTransformer(
  j: JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>,
  imp: ImportedElements
) {
  if (matchName(imp.importData, "TextareaControlled")) {
    setJsxNames(jsx.node, ["Textarea"]);
  }

  jsx.node.openingElement.attributes = jsx.node.openingElement.attributes.map(
    (attr) => {
      const parsed = parseAttribute(attr);
      if (attr.type === "JSXSpreadAttribute") return attr;
      switch (parsed.name) {
        case "feil":
          return j.jsxAttribute(j.jsxIdentifier("error"), attr.value);
        case "textareaRef":
          return j.jsxAttribute(j.jsxIdentifier("ref"), attr.value);
        default:
          return attr;
      }
    }
  );
}
