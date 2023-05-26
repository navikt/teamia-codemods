import * as Kinds from "ast-types/gen/kinds";
import * as core from "jscodeshift";
import {
  isExpressionKind,
  isJsxExpressionContainerKind,
  isLiteralKind,
  isNakedLiteral,
  isSpreadElementKind,
  isStringLiteralKind,
} from "./typeKinds";
import { parseLiteral } from "./jsxAttributes";

export function wrapValue(
  value: unknown
): Kinds.JSXExpressionContainerKind | Kinds.StringLiteralKind {
  if (value === null) return null;
  if (value === undefined)
    return core.jsxExpressionContainer(core.jsxEmptyExpression());
  if (isNakedLiteral(value)) {
    return wrapValue(parseLiteral(value));
  }
  if (isJsxExpressionContainerKind(value)) {
    return wrapValue(value.expression);
  }
  if (isSpreadElementKind(value)) {
    return wrapValue(value.argument);
  }
  if (isStringLiteralKind(value)) {
    return value;
  }
  if (isLiteralKind(value)) {
    return core.jsxExpressionContainer(value);
  }
  if (isExpressionKind(value)) {
    return core.jsxExpressionContainer(value);
  }
}
