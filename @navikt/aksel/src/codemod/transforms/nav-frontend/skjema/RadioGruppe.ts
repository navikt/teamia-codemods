import { JSCodeshift, ASTPath } from "jscodeshift";
import { namedTypes } from "ast-types";
import { parseAttribute } from "../../../utils/jsxAttributes";
import { notEmpty } from "../../../utils/otherUtils";
import { createComments } from "../../../utils/jsxElements";
import { setJsxNames } from "../../../utils/jsxName";
import { wrapValue } from "../../../utils/expression";

export default function RadioGruppeTransformer(
  j: JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>
) {
  const commentLines: string[] = [];

  jsx.node.openingElement.attributes = jsx.node.openingElement.attributes.map(
    (attr) => {
      const parsed = parseAttribute(attr);

      switch (parsed.name) {
        case "feil":
          return j.jsxAttribute(
            j.jsxIdentifier("error"),
            wrapValue(parsed.value)
          );
        case "feilmeldingId":
          return j.jsxAttribute(
            j.jsxIdentifier("errorId"),
            wrapValue(parsed.value)
          );
        case "tag": {
          commentLines.push("TODO: 'tag' er ikke støttet i RadioGroup");
          return undefined;
        }
        case "utenFeilPropagering": {
          commentLines.push(
            "TODO: 'utenFeilPropagering' er ikke støttet i RadioGroup"
          );
          return undefined;
        }
        default:
          return attr;
      }
    }
  );

  setJsxNames(jsx.node, ["RadioGroup"]);

  if (notEmpty(commentLines)) {
    jsx.insertBefore(...createComments(commentLines));
  }
}
