import * as Kinds from "ast-types/gen/kinds";
import { IdentifierKind, LiteralKind } from "ast-types/gen/kinds";
import { namedTypes } from "ast-types";
import { isInList } from "./otherUtils";

export const jsxTextKind = ["JSXText"] as const;
export const jsxExpressionContainerKind = ["JSXExpressionContainer"] as const;
export const jsxSpreadChildKind = ["JSXSpreadChild"] as const;
export const jsxElementKind = ["JSXElement"] as const;
export const jsxFragmentKind = ["JSXFragment"] as const;
export const literalKinds = [
  "JSXText",
  "Literal",
  "StringLiteral",
  "NumericLiteral",
  "BigIntLiteral",
  "NullLiteral",
  "BooleanLiteral",
  "RegExpLiteral",
] as const;

export const stringLiteralKinds = ["StringLiteral"];

export const objectExpressionKind = ["ObjectExpression"] as const;

export const spreadElementKinds = ["SpreadElement"] as const;

export const jsxEmptyExpressionKinds = ["JSXEmptyExpression"] as const;

export const expressionKinds = [
  "Identifier",
  "FunctionExpression",
  "ThisExpression",
  "ArrayExpression",
  "ObjectExpression",
  "Literal",
  "SequenceExpression",
  "UnaryExpression",
  "BinaryExpression",
  "AssignmentExpression",
  "MemberExpression",
  "UpdateExpression",
  "LogicalExpression",
  "ConditionalExpression",
  "NewExpression",
  "CallExpression",
  "ArrowFunctionExpression",
  "YieldExpression",
  "GeneratorExpression",
  "ComprehensionExpression",
  "ClassExpression",
  "Super",
  "TaggedTemplateExpression",
  "TemplateLiteral",
  "MetaProperty",
  "AwaitExpression",
  "ImportExpression",
  "ChainExpression",
  "OptionalCallExpression",
  "OptionalMemberExpression",
  "JSXIdentifier",
  "JSXExpressionContainer",
  "JSXElement",
  "JSXFragment",
  "JSXMemberExpression",
  "JSXText",
  "PrivateName",
  "TypeCastExpression",
  "DoExpression",
  "BindExpression",
  "ParenthesizedExpression",
  "DirectiveLiteral",
  "StringLiteral",
  "NumericLiteral",
  "BigIntLiteral",
  "NullLiteral",
  "BooleanLiteral",
  "RegExpLiteral",
  "Import",
  "TSAsExpression",
  "TSNonNullExpression",
  "TSTypeParameter",
  "TSTypeAssertion",
] as const;

export const identifierKinds = [
  "Identifier",
  "JSXIdentifier",
  "TSTypeParameter",
] as const;

export const jsxIdentifierKinds = ["JSXIdentifier"] as const;
export const jsxNamespacedNameKinds = ["JSXNamespacedName"] as const;

export const jsxAttributeKinds = ["JSXAttribute"] as const;

export const jsxSpreadAttributeKinds = ["JSXSpreadAttribute"] as const;

export type ArgumentParam = Kinds.ExpressionKind | Kinds.SpreadElementKind;
export type NakedLiteral =
  | string
  | boolean
  | null
  | number
  | RegExp
  | undefined
  | bigint
  | Symbol;

export type ObjectPropertyKeyKind =
  | Kinds.LiteralKind
  | Kinds.IdentifierKind
  | Kinds.ExpressionKind;

export function isLiteralKind(
  maybeLiteralKind: unknown
): maybeLiteralKind is LiteralKind {
  return isInList(maybeLiteralKind, literalKinds);
}

export function isStringLiteralKind(
  value: unknown
): value is Kinds.StringLiteralKind {
  return isInList(value, stringLiteralKinds);
}

export function isNakedLiteral(value: unknown): value is NakedLiteral {
  if (value === null) return true;
  if (value instanceof RegExp) return true;
  switch (typeof value) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "symbol":
    case "undefined":
      return true;
    default:
      return false;
  }
}

export function isAstNodeKind(value: unknown): value is namedTypes.Node {
  return isObject(value) && "type" in value && typeof value.type === "string";
}

export function isArgumentParam(val: unknown): val is ArgumentParam {
  return isSpreadElementKind(val) || isExpressionKind(val);
}

export function isExpressionKind(val: unknown): val is Kinds.ExpressionKind {
  return isInList(val, expressionKinds);
}

export function isJsxEmptyExpressionKind(
  value: unknown
): value is Kinds.JSXEmptyExpressionKind {
  return isInList(value, jsxEmptyExpressionKinds);
}

export function isJsxExpressionContainerKind(
  value: unknown
): value is Kinds.JSXExpressionContainerKind {
  return isInList(value, jsxExpressionContainerKind);
}

export function isJsxExpressionContainerExpressionKind(
  value: unknown
): value is Kinds.ExpressionKind | Kinds.JSXEmptyExpressionKind {
  return isJsxEmptyExpressionKind(value) || isExpressionKind(value);
}

export function isSpreadElementKind(
  val: unknown
): val is Kinds.SpreadElementKind {
  return isInList(val, spreadElementKinds);
}

export function isIdentifierKind(val: unknown): val is IdentifierKind {
  return isInList(val, identifierKinds);
}

export function isObjectExpressionKind(
  value: unknown
): value is Kinds.ObjectExpressionKind {
  return isInList(value, objectExpressionKind);
}

export function isObjectPropertyKeyKind(
  value: unknown
): value is ObjectPropertyKeyKind {
  return isInList(value, [
    ...identifierKinds,
    ...literalKinds,
    ...expressionKinds,
  ]);
}

export function isObject(val: unknown): val is {} {
  if (val === undefined) return false;
  if (val === null) return false;
  return typeof val === "object";
}
