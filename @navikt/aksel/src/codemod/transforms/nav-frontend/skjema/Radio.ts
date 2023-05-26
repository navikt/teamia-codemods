import core, { ASTPath } from "jscodeshift";
import { namedTypes } from "ast-types";
import {
  hasAttribute,
  parseAttribute,
  wrapAttributeValue,
} from "../../../utils/jsxAttributes";
import { notEmpty, notUndefined } from "../../../utils/otherUtils";
import { createComments, isJsxElement } from "../../../utils/jsxElements";
import { getJsxNames } from "../../../utils/jsxName";
import * as Kinds from "ast-types/gen/kinds";
import { wrapValue } from "../../../utils/expression";

export default function RadioTransformer(
  j: core.JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>
) {
  const commentLines: string[] = [];
  let attributes = jsx.node.openingElement.attributes;

  attributes = attributes
    .map((attr) => {
      const parsed = parseAttribute(attr);

      switch (parsed.name) {
        case "name": {
          commentLines.push(
            "TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene"
          );

          const parentNode = jsx.parent?.node;
          if (
            isJsxElement(parentNode) &&
            ["RadioGruppe", "RadioGroup"].includes(getJsxNames(parentNode))
          ) {
            if (
              !parentNode.openingElement.attributes.some(
                (prop) => parseAttribute(prop).name === "name"
              )
            ) {
              parentNode.openingElement.attributes = [
                ...parentNode.openingElement.attributes,
                j.jsxAttribute(
                  j.jsxIdentifier("name"),
                  wrapAttributeValue(parsed.value)
                ),
              ];
            }
            return undefined;
          }
          return attr;
        }
        case "label": {
          const val: Kinds.ExpressionKind =
            attr.type === "JSXSpreadAttribute" ? attr.argument : attr.value;
          jsx.node.children = [wrapValue(val), ...jsx.node.children];
          return undefined;
        }
        case "feil": {
          commentLines.push(
            "TODO: i ds-react blir feil/error håndtert i RadioGroup komponenten"
          );
          return undefined;
        }
        case "radioRef": {
          if (attr.type !== "JSXSpreadAttribute") {
            return j.jsxAttribute(j.jsxIdentifier("ref"), attr.value);
          }
          commentLines.push(
            "TODO: 'radioRef' er blitt 'ref', men siden den var deklarert som en variabel så kan den ikke automatisk migreres"
          );
          return attr;
        }
        case "onChange": {
          commentLines.push(
            "TODO: ds-react har lagt opp til at 'onChange' event handler blir satt i RadioGroup komponenten"
          );
          return attr;
        }
        default:
          return attr;
      }
    })
    .filter(notUndefined);

  if (!hasAttribute(attributes, "value")) {
    commentLines.push(
      "TODO: ds-react krever en 'value' prop for Radio komponenter"
    );
    attributes = [
      j.jsxAttribute(j.jsxIdentifier("value"), j.stringLiteral("")),
      ...attributes,
    ];
  }

  if (notEmpty(commentLines)) {
    jsx.insertBefore(...createComments(commentLines));
  }

  jsx.node.openingElement.attributes = attributes;
}
