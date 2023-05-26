import core, { ASTPath } from "jscodeshift";
import { namedTypes } from "ast-types";
import { parseAttribute } from "../../../utils/jsxAttributes";
import { notEmpty, notUndefined } from "../../../utils/otherUtils";
import { createComments } from "../../../utils/jsxElements";

export default function CheckboxTransformer(
  j: core.JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>
) {
  const commentLines: string[] = [];

  jsx.node.openingElement.attributes = jsx.node.openingElement.attributes
    .map((attr) => {
      let parsed = parseAttribute(attr);
      if (attr.type === "JSXSpreadAttribute") return attr;
      switch (parsed.name) {
        case "checkBoxRef":
          return j.jsxAttribute(j.jsxIdentifier("ref"), attr.value);
        case "label": {
          jsx.node.children = [...jsx.node.children, attr.value];
          return undefined;
        }
        case "feil": {
          commentLines.push(
            "TODO: i react-ds er error på checkbox en bool, selve feilmedlingene ligger i CheckboxGruppe"
          );
          return j.jsxAttribute(j.jsxIdentifier("error"));
        }
        case "onChange": {
          commentLines.push(
            "TODO: det er lagt opp for at man bruker onChange på CheckboxGruppe komponenten i stedet for å bruke hver enkelt checkbox sin onChange"
          );
          return attr;
        }
      }
    })
    .filter(notUndefined);

  if (notEmpty(commentLines)) {
    jsx.node.children = [...jsx.node.children, ...createComments(commentLines)];
  }
}
