import core, { ASTPath } from "jscodeshift";
import { namedTypes } from "ast-types";
import { parseAttribute } from "../../../utils/jsxAttributes";
import { notEmpty } from "../../../utils/otherUtils";
import { createComments } from "../../../utils/jsxElements";
import { wrapValue } from "../../../utils/expression";
import { breddeToWidth } from "./skjema";

export default function SelectTransformer(
  j: core.JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>
) {
  const commentLines: string[] = [];

  jsx.node.openingElement.attributes = jsx.node.openingElement.attributes.map(
    (attr) => {
      const parsed = parseAttribute(attr);
      if (attr.type !== "JSXSpreadAttribute") {
        switch (parsed.name) {
          case "bredde":
            return breddeToWidth(parsed.rawValue);
          case "feil":
            return j.jsxAttribute(j.jsxIdentifier("error"), attr.value);
          case "selectRef":
            return j.jsxAttribute(j.jsxIdentifier("ref"), attr.value);
          case "selected": {
            commentLines.push("TODO: ds-react støtter ikke 'selected' prop");
            return undefined;
          }
          default:
            return attr;
        }
      }

      switch (parsed.name) {
        case "bredde": {
          commentLines.push(
            "TODO: ds-react støtter ikke 'bredde' property, siden denne var definert som en variabel så kan den ikke automatisk migreres"
          );
          return attr;
        }
        case "feil":
          return j.jsxAttribute(
            j.jsxIdentifier("error"),
            wrapValue(attr.argument)
          );
        case "selectRef":
          return j.jsxAttribute(
            j.jsxIdentifier("ref"),
            wrapValue(attr.argument)
          );
        case "selected": {
          commentLines.push("TODO: ds-react støtter ikke 'selected' prop");
          return undefined;
        }
        default:
          return attr;
      }
    }
  );

  if (notEmpty(commentLines)) {
    jsx.insertBefore(...createComments(commentLines));
  }
}
