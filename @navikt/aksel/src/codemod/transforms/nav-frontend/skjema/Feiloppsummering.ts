import core, { ASTPath } from "jscodeshift";
import { namedTypes } from "ast-types";
import {
  createChild,
  createComments,
  getTemplateLiteral,
} from "../../../utils/jsxChildren";
import * as Kinds from "ast-types/gen/kinds";
import {
  isValidAttributeValue,
  parseAttribute,
  parseLiteral,
} from "../../../utils/jsxAttributes";
import { notUndefined } from "../../../utils/otherUtils";
import { setJsxNames } from "../../../utils/jsxName";
import {
  ArgumentParam,
  isArgumentParam,
  isExpressionKind,
  isJsxExpressionContainerKind,
  isNakedLiteral,
  isObjectExpressionKind,
} from "../../../utils/typeKinds";

export default function feiloppsummeringTransformer(
  j: core.JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>
) {
  let errorItems: Kinds.ExpressionKind = j.arrayExpression([]);
  let customRender: ArgumentParam;
  const commentLines: string[] = [];

  jsx.node.openingElement.attributes = jsx.node.openingElement.attributes
    .map((attr) => {
      const parsed = parseAttribute(attr);

      if (parsed.type === "JSXSpreadAttribute") {
        switch (parsed.name) {
          case "customFeilRender": {
            if (isArgumentParam(parsed.value)) {
              customRender = parsed.value;
            }
            return undefined;
          }
          case "feil": {
            if (isExpressionKind(parsed.value)) {
              errorItems = parsed.value;
              return undefined;
            }
            commentLines.push(
              `TODO: ErrorSummary trenger en 'error', men den klarte ikke å utlede hva 'feil' er: ${parsed.value}`
            );
            return undefined;
          }
          case "tittel": {
            if (isValidAttributeValue(parsed.value)) {
              return j.jsxAttribute(j.jsxIdentifier("heading"), parsed.value);
            }
            if (isNakedLiteral(parsed.value)) {
              return j.jsxAttribute(
                j.jsxIdentifier("heading"),
                parseLiteral(parsed.value)
              );
            }
            commentLines.push(
              `TODO: ErrorSummary trenger en 'heading', men den klarte ikke å utlede hva 'tittel' er: ${parsed.value}`
            );
            return undefined;
          }
          case "innerRef": {
            if (isJsxExpressionContainerKind(parsed.value)) {
              return j.jsxAttribute(j.jsxIdentifier("ref"), parsed.value);
            }
            if (isObjectExpressionKind(parsed.value)) {
              return j.jsxAttribute(
                j.jsxIdentifier("ref"),
                j.jsxExpressionContainer(parsed.value)
              );
            }
            commentLines.push(
              `TODO: Komponenten har en 'innerRef', men den klarte ikke å utlede hva den var: ${parsed.value}`
            );
            return undefined;
          }
          default: {
            return attr;
          }
        }
      }
    })
    .filter(notUndefined);

  setJsxNames(jsx.node, ["ErrorSummary"]);

  jsx.node.children = [
    j.jsxExpressionContainer(
      j.callExpression(
        j.jsxMemberExpression(
          // @ts-ignore
          errorItems,
          j.jsxIdentifier("map")
        ),
        [notUndefined(customRender) ? customRender : defaultErrorRender()]
      )
    ),
  ];

  if (commentLines.length > 0) {
    jsx.insertBefore(...createComments(commentLines));
  }
}

export function defaultErrorRender() {
  return core.arrowFunctionExpression(
    [core.jsxIdentifier("oppsummeringFeil")],
    core.parenthesizedExpression(createErrorSummary())
  );
}

function createErrorSummary() {
  return createChild(
    ["ErrorSummary", "Item"],
    [core.jsxExpressionContainer(core.jsxIdentifier("feilmelding"))],
    [
      core.jsxAttribute(
        core.jsxIdentifier("href"),
        core.jsxExpressionContainer(
          getTemplateLiteral("#", "", "skjemaelementId")
        )
      ),
    ]
  );
}
