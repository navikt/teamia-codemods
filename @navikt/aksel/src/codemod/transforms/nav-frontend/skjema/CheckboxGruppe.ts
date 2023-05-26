import core, { ASTPath } from "jscodeshift";
import { namedTypes } from "ast-types";
import { parseAttribute } from "../../../utils/jsxAttributes";
import { notEmpty, notUndefined } from "../../../utils/otherUtils";
import { createComments } from "../../../utils/jsxElements";
import { setJsxNames } from "../../../utils/jsxName";

export default function CheckboxGruppeTransformer(
  j: core.JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>
) {
  const commentLines: string[] = [];

  if (
    jsx.node.openingElement.attributes.every((attr) => {
      const parsed = parseAttribute(attr);
      return parsed.name !== "onChange";
    })
  ) {
    commentLines.push(
      "ds-react legger opp til at man bruker onChange på CheckboxGroup komponenten i stedet for individuelle Checkbox komponenter"
    );
  }

  jsx.node.openingElement.attributes = jsx.node.openingElement.attributes
    .map((attr) => {
      if (attr.type === "JSXSpreadAttribute") return attr;

      const parsed = parseAttribute(attr);

      switch (parsed.name) {
        case "feil":
          return j.jsxAttribute(j.jsxIdentifier("error"), attr.value);
        case "feilmeldingId":
          return j.jsxAttribute(j.jsxIdentifier("errorId"), attr.value);
        case "tag": {
          commentLines.push(
            "TODO: ds-react støtter ikke custom tag for CheckboxGroup"
          );
          return undefined;
        }
        case "utenFeilPropagering": {
          commentLines.push(
            "TODO: ds-react støtter ikke utenFeilPropagering for CheckboxGroup"
          );
          return undefined;
        }
        default:
          return attr;
      }
    })
    .filter(notUndefined);

  if (notEmpty(commentLines)) {
    jsx.node.children = [...createComments(commentLines), ...jsx.node.children];
  }

  setJsxNames(jsx.node, ["CheckboxGroup"]);
}
