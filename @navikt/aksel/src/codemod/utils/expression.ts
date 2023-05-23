import * as core from "jscodeshift";
import { namedTypes } from "ast-types";
import { isExpressionKind, isSpreadElementKind } from "./typeKinds";

export function wrapValueInExpressionContainer(value: unknown) {
  return core.jsxExpressionContainer(wrapValue(value));
}

export function wrapValue(
  value: unknown
): namedTypes.JSXExpressionContainer["expression"] {
  if (value === undefined) return core.jsxEmptyExpression();
  if (value === null) return core.nullLiteral();
  if (typeof value === "string") return core.stringLiteral(value);
  if (typeof value === "number") return core.numericLiteral(value);
  if (typeof value === "boolean") return core.booleanLiteral(value);
  if (typeof value === "bigint") return core.bigIntLiteral(value.toString());
  if (typeof value === "symbol") return core.stringLiteral(value.toString());
  if (typeof value === "object") {
    if ("type" in value && value.type === "JSXExpressionContainer") {
      return (value as namedTypes.JSXExpressionContainer).expression;
    }
    if (isSpreadElementKind(value)) {
      return value.argument;
    }
    if (isExpressionKind(value)) {
      return value;
    }
  }
  core.jsxIdentifier("HELLO!");
  //return core.template.expression([`${value}`]);
}
