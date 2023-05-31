import { JSCodeshift, ASTPath } from "jscodeshift";
import { namedTypes, builders } from "ast-types";

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
  isIdentifierKind,
  isJsxExpressionContainerKind,
  isNakedLiteral,
} from "../../../utils/typeKinds";
import {
  createChild,
  createComments,
  getTemplateLiteral,
} from "../../../utils/jsxElements";
import { isObjectExpressionKind } from "../../../utils/object";

export default function feiloppsummeringTransformer(
  j: JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>
) {
  let errorItems: Kinds.ExpressionKind = j.arrayExpression([]);
  let customRender: ArgumentParam;
  let commentLines: string[] = [];

  if (!jsx.node.closingElement) {
    jsx.node.openingElement.selfClosing = false;
    jsx.node.selfClosing = false;
    jsx.node.closingElement = j.jsxClosingElement(jsx.node.openingElement.name);
  }

  jsx.node.openingElement.attributes = jsx.node.openingElement.attributes
    .map((attr) => {
      const parsed = parseAttribute(attr);

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
          }
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
          if (isIdentifierKind(parsed.value)) {
            return j.jsxAttribute(
              j.jsxIdentifier("ref"),
              j.jsxExpressionContainer(j.jsxIdentifier(parsed.value.name))
            );
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
    })
    .filter(notUndefined);

  jsx.node.children = [
    j.jsxExpressionContainer(
      j.callExpression(j.memberExpression(errorItems, j.jsxIdentifier("map")), [
        notUndefined(customRender) ? customRender : defaultErrorRender(),
      ])
    ),
    ...jsx.node.children,
  ];

  setJsxNames(jsx.node, ["ErrorSummary"]);

  if (commentLines.length > 0) {
    jsx.insertBefore(...createComments(commentLines));
  }
}

export function defaultErrorRender() {
  return builders.arrowFunctionExpression(
    [builders.jsxIdentifier("error")],
    builders.parenthesizedExpression(createErrorSummary())
  );
}

function createErrorSummary() {
  return createChild(
    ["ErrorSummary", "Item"],
    [
      builders.jsxExpressionContainer(
        builders.jsxIdentifier("error.feilmelding")
      ),
    ],
    [
      builders.jsxAttribute(
        builders.jsxIdentifier("href"),
        builders.jsxExpressionContainer(
          getTemplateLiteral("#", "", "error.skjemaelementId")
        )
      ),
    ]
  );
}
