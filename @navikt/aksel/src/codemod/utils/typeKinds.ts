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

export const objectPropertyKind = ["ObjectProperty", "Property"] as const;

export const objectMethodKind = ["ObjectMethod"] as const;

export const arrayExpressionKinds = ["ArrayExpression"] as const;

export const restElementKinds = ["RestElement"] as const;

export const spreadElementKinds = ["SpreadElement"] as const;

export const spreadPropertyKinds = ["SpreadProperty"] as const;

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

export const functionExpressionKinds = [
  "FunctionExpression",
  "ArrowFunctionExpression",
] as const;

export const patternKinds = [
  "Identifier",
  "RestElement",
  "SpreadElementPattern",
  "PropertyPattern",
  "ObjectPattern",
  "ArrayPattern",
  "AssignmentPattern",
  "SpreadPropertyPattern",
  "JSXIdentifier",
  "PrivateName",
  "TSAsExpression",
  "TSNonNullExpression",
  "TSTypeParameter",
  "TSTypeAssertion",
  "TSParameterProperty",
] as const;

export const identifierKinds = [
  "Identifier",
  "JSXIdentifier",
  "TSTypeParameter",
] as const;

export const jsxIdentifierKinds = ["JSXIdentifier"] as const;
export const jsxNamespacedNameKinds = ["JSXNamespacedName"] as const;

export const jsxMemberExpressionKinds = ["JSXMemberExpression"] as const;

export const jsxAttributeKinds = ["JSXAttribute"] as const;

export const jsxSpreadAttributeKinds = ["JSXSpreadAttribute"] as const;

export const importdeclarationKinds = ["ImportDeclaration"] as const;

export const importSpecifierKinds = ["ImportSpecifier"] as const;
export const importDefaultSpecifierKinds = ["ImportDefaultSpecifier"] as const;
export const importNamespaceSpecifierKinds = [
  "ImportNamespaceSpecifier",
] as const;
export const importKinds = [
  ...importSpecifierKinds,
  ...importDefaultSpecifierKinds,
  ...importNamespaceSpecifierKinds,
] as const;

export type ImportKinds = Exclude<
  Kinds.ModuleSpecifierKind,
  Kinds.ExportSpecifierKind
>;

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

export function isArgumentParam(value: unknown): value is ArgumentParam {
  return isSpreadElementKind(value) || isExpressionKind(value);
}

export function isExpressionKind(
  value: unknown
): value is Kinds.ExpressionKind {
  return isInList(value, expressionKinds);
}

export function isFunctionExpressionKind(
  value: unknown
): value is Kinds.FunctionExpressionKind | Kinds.ArrowFunctionExpressionKind {
  return isInList(value, functionExpressionKinds);
}

export function isPatternKind(value: unknown): value is Kinds.ExpressionKind {
  return isInList(value, patternKinds);
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
  value: unknown
): value is Kinds.SpreadElementKind {
  return isInList(value, spreadElementKinds);
}

export function isRestElementKind(
  value: unknown
): value is Kinds.RestElementKind {
  return isInList(value, restElementKinds);
}

export function isSpreadPropertyKind(
  value: unknown
): value is Kinds.SpreadPropertyKind {
  return isInList(value, spreadPropertyKinds);
}

export function isIdentifierKind(value: unknown): value is IdentifierKind {
  return isInList(value, identifierKinds);
}

export function isJsxNamespacedNameKinds(
  value: unknown
): value is Kinds.JSXNamespacedNameKind {
  return isInList(value, jsxNamespacedNameKinds);
}

export function isJsxMemberExpressionKind(
  value: unknown
): value is Kinds.JSXMemberExpressionKind {
  return isInList(value, jsxMemberExpressionKinds);
}

export function isArrayExpressionKind(
  value: unknown
): value is Kinds.ArrayExpressionKind {
  return isInList(value, arrayExpressionKinds);
}

export function isArraySpreadKind(
  value: unknown
): value is Kinds.SpreadElementKind | Kinds.RestElementKind {
  return isSpreadElementKind(value) || isRestElementKind(value);
}

export function isObject(value: unknown): value is {} {
  if (value === undefined) return false;
  if (value === null) return false;
  return typeof value === "object";
}
