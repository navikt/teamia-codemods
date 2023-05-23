import * as Kinds from "ast-types/gen/kinds";
import { LiteralKind, NodeKind } from "ast-types/gen/kinds";
import { namedTypes } from "ast-types";
import { isInList } from "./otherUtils";

export const jsxTextKind = ["JSXText"] as const;
export const jsxExpressionContainerKind = ["JSXExpressionContainer"] as const;
export const jsxSpreadChildKind = ["JSXSpreadChild"] as const;
export const jsxElementKind = ["JSXElement"] as const;
export const jsxFragmentKind = ["JSXFragment"] as const;
export const literalKind = [
  "JSXText",
  "Literal",
  "StringLiteral",
  "NumericLiteral",
  "BigIntLiteral",
  "NullLiteral",
  "BooleanLiteral",
  "RegExpLiteral",
] as const;

export const objectExpressionKind = ["ObjectExpression"] as const;

export const spreadElementKinds = ["SpreadElement"] as const;

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

export type ArgumentParam = Kinds.ExpressionKind | Kinds.SpreadElementKind;
export type NakedLiteral =
  | string
  | boolean
  | null
  | number
  | RegExp
  | undefined
  | bigint;
export type ObjectWithType = { type: string };

export function isLiteralKind(
  maybeLiteralKind: NodeKind
): maybeLiteralKind is LiteralKind {
  if (maybeLiteralKind === undefined || maybeLiteralKind?.type === undefined)
    return false;
  return (literalKind as readonly string[]).includes(maybeLiteralKind.type);
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
  return (
    value !== undefined &&
    typeof value === "object" &&
    typeof value["type"] === "string"
  );
}

export function isArgumentParam(val: unknown): val is ArgumentParam {
  return isSpreadElementKind(val) || isExpressionKind(val);
}

export function isExpressionKind(val: unknown): val is Kinds.ExpressionKind {
  return isInList(val, expressionKinds);
}

export function isJsxExpressionContainerKind(
  value: unknown
): value is Kinds.JSXExpressionContainerKind {
  return (
    isObjectWithType(value) &&
    (jsxExpressionContainerKind as readonly string[]).includes(value.type)
  );
}
export function isSpreadElementKind(
  val: unknown
): val is Kinds.SpreadElementKind {
  return isInList(val, spreadElementKinds);
}

export function isObjectExpressionKind(
  value: unknown
): value is Kinds.ObjectExpressionKind {
  return (
    isObjectWithType(value) &&
    (objectExpressionKind as readonly string[]).includes(value.type)
  );
}

export function isObjectWithType(value: unknown): value is ObjectWithType {
  return isObject(value) && "type" in value && typeof value.type === "string";
}

export function isObject(val: unknown): val is {} {
  if (val === undefined) return false;
  if (val === null) return false;
  return typeof val === "object";
}
