import { isInList } from "./otherUtils";
import * as Kinds from "ast-types/gen/kinds";
import {
  expressionKinds,
  identifierKinds,
  isExpressionKind,
  isIdentifierKind,
  isJsxExpressionContainerKind,
  isLiteralKind,
  isPatternKind,
  isSpreadElementKind,
  isSpreadPropertyKind,
  literalKinds,
  objectExpressionKind,
  objectMethodKind,
  ObjectPropertyKeyKind,
  objectPropertyKind,
} from "./typeKinds";

export function isObjectExpressionKind(
  value: unknown
): value is Kinds.ObjectExpressionKind {
  return isInList(value, objectExpressionKind);
}

export function isObjectPropertyKind(
  value: unknown
): value is Kinds.ObjectPropertyKind | Kinds.PropertyKind {
  return isInList(value, objectPropertyKind);
}

export function isObjectMethodKind(
  value: unknown
): value is Kinds.ObjectMethodKind {
  return isInList(value, objectMethodKind);
}

export function isObjectSpreadPropertyKind(
  value: unknown
): value is Kinds.SpreadPropertyKind | Kinds.SpreadElementKind {
  return isSpreadPropertyKind(value) || isSpreadElementKind(value);
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

export function isObjectPropertyValueKind(
  value: unknown
): value is Kinds.ExpressionKind | Kinds.PatternKind {
  return isExpressionKind(value) || isPatternKind(value);
}

export function getPropertyKeyName(property: unknown): string | undefined {
  if (!isObjectPropertyKeyKind(property)) return undefined;
  if (isLiteralKind(property)) return String(property.value);
  if (isIdentifierKind(property)) return property.name;
  if (isJsxExpressionContainerKind(property)) {
    return getPropertyKeyName(property.expression);
  }
  return undefined;
}
