import * as Kinds from "ast-types/gen/kinds";
import * as core from "jscodeshift";
import {
  isArrayExpressionKind,
  isArraySpreadKind,
  isExpressionKind,
  isIdentifierKind,
  isJsxExpressionContainerKind,
  isLiteralKind,
  isNakedLiteral,
  isObject,
  isSpreadElementKind,
  isStringLiteralKind,
  NakedLiteral,
} from "./typeKinds";
import { parseLiteral } from "./jsxAttributes";
import { notUndefined, tupleIncludes } from "./otherUtils";
import {
  isObjectExpressionKind,
  isObjectMethodKind,
  isObjectPropertyKeyKind,
  isObjectPropertyKind,
  isObjectPropertyValueKind,
  isObjectSpreadPropertyKind,
} from "./object";

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

export const ExpressionLabel = "ExpressionLabel";
export const ArrayExpressionLabel = "ArrayExpressionLabel";
export const ObjectExpressionLabel = "ObjectExpressionLabel";
export const ObjectMethodLabel = "ObjectMethodLabel";
export const ObjectPropertyLabel = "ObjectPropertyLabel";
export const ObjectPropertyKeyLabel = "ObjectPropertyKeyLabel";
export const ObjectPropertyValueLabel = "ObjectPropertyValueLabel";
export const SpreadPropertyLabel = "SpreadPropertyLabel";
export const ArraySpreadLabel = "ArraySpreadLabel";
export const LiteralLabel = "LiteralLabel";
export const UnknownLabel = "UnknownLabel";

export const Labels = [
  ExpressionLabel,
  ArrayExpressionLabel,
  ObjectExpressionLabel,
  ObjectMethodLabel,
  ObjectPropertyLabel,
  ObjectPropertyKeyLabel,
  ObjectPropertyValueLabel,
  SpreadPropertyLabel,
  ArraySpreadLabel,
  LiteralLabel,
  UnknownLabel,
];

export function isElementType(value: unknown): value is ElementType {
  return (
    isObject(value) && "type" in value && tupleIncludes(Labels, value.type)
  );
}

export function getElementValue(value: unknown) {
  if (!isElementType(value)) return value;
  if (value.type === UnknownLabel) {
    return value.value;
  }
  if (value.value instanceof Array) {
    return value.value.map(getElementValue);
  }
  return getElementValue(value.value);
}

export type ElementType =
  | LiteralType
  | ArrayExpressionType
  | ArraySpreadType
  | ExpressionType
  | ObjectExpressionType
  | SpreadPropertyType
  | ObjectMethodType
  | ObjectPropertyType
  | ObjectPropertyKeyType
  | ObjectPropertyValueType
  | UnknownType;
export type LiteralType = { type: typeof LiteralLabel; value: NakedLiteral };
export type ArrayExpressionType = {
  type: typeof ArrayExpressionLabel;
  value: readonly (
    | ObjectExpressionType
    | ArraySpreadType
    | LiteralType
    | ExpressionType
    | UnknownType
  )[];
};
export type ArraySpreadType = {
  type: typeof ArraySpreadLabel;
  value: Kinds.RestElementKind | Kinds.SpreadElementKind;
};
export type ExpressionType = {
  type: typeof ExpressionLabel;
  value: Kinds.ExpressionKind;
};
export type ObjectExpressionType = {
  type: typeof ObjectExpressionLabel;
  readonly value: (
    | ObjectPropertyType
    | ObjectMethodType
    | SpreadPropertyType
    | UnknownType
  )[];
};
export type SpreadPropertyType = {
  type: typeof SpreadPropertyLabel;
  value: Kinds.SpreadPropertyKind | Kinds.SpreadElementKind;
};
export type ObjectMethodType = {
  type: typeof ObjectMethodLabel;
  value: Kinds.ObjectMethodKind;
};
export type ObjectPropertyType = {
  type: typeof ObjectPropertyLabel;
  value: readonly [ObjectPropertyKeyType, ObjectPropertyValueType];
};
export type ObjectPropertyKeyType = {
  type: typeof ObjectPropertyKeyLabel;
  value: string | undefined;
};
export type ObjectPropertyValueType = {
  type: typeof ObjectPropertyValueLabel;
  value:
    | NakedLiteral
    | ObjectExpressionType
    | ArrayExpressionType
    | ExpressionType
    | UnknownType;
};
export type UnknownType = { type: typeof UnknownLabel; value: unknown };

export function parseArrayExpression(array: unknown): ArrayExpressionType {
  if (!isArrayExpressionKind(array))
    return { type: ArrayExpressionLabel, value: [] } as const;
  return {
    type: ArrayExpressionLabel,
    value: array.elements
      .map((element) => {
        if (isObjectExpressionKind(element)) {
          return parseObjectExpression(element);
        }
        if (isArraySpreadKind(element)) {
          return { type: ArraySpreadLabel, value: element } as const;
        }
        if (isLiteralKind(element)) {
          return { type: LiteralLabel, value: element.value } as const;
        }
        if (isExpressionKind(element)) {
          return parseExpression(element);
        }
      })
      .filter(notUndefined),
  } as const;
}

function parseExpression(
  value: unknown
): ExpressionType | LiteralType | UnknownType {
  if (!isExpressionKind(value)) return { type: UnknownLabel, value: value };
  if (isLiteralKind(value))
    return { type: LiteralLabel, value: value.value } as const;
  return { type: ExpressionLabel, value: value } as const;
}
function parseObjectExpression(value: unknown): ObjectExpressionType {
  if (!isObjectExpressionKind(value))
    return { type: ObjectExpressionLabel, value: [] };
  return {
    type: ObjectExpressionLabel,
    value: value.properties.map((property) => {
      if (isObjectPropertyKind(property)) {
        return parseObjectProperty(property);
      }
      if (isObjectSpreadPropertyKind(property)) {
        return { type: SpreadPropertyLabel, value: property } as const;
      }
      if (isObjectMethodKind(property)) {
        return { type: ObjectMethodLabel, value: property } as const;
      }
    }),
  };
}

function parseObjectProperty(value: unknown): UnknownType | ObjectPropertyType {
  if (!isObjectPropertyKind(value)) {
    console.log("unkown", value);
    return { type: UnknownLabel, value: value } as const;
  }

  return {
    type: ObjectPropertyLabel,
    value: [
      {
        type: ObjectPropertyKeyLabel,
        value: parseObjectPropertyKey(value.key),
      } as const,
      {
        type: ObjectPropertyValueLabel,
        value: parseObjectPropertyValue(value.value),
      } as const,
    ] as const,
  };
}

function parseObjectPropertyKey(value: unknown): string | undefined {
  if (!isObjectPropertyKeyKind(value)) {
    return undefined;
  }
  if (isLiteralKind(value)) {
    return String(value.value);
  }
  if (isIdentifierKind(value)) {
    return value.name;
  }
  if (isJsxExpressionContainerKind(value)) {
    return parseObjectPropertyKey(value.expression);
  }
  return undefined;
}

function parseObjectPropertyValue(
  value: unknown
):
  | UnknownType
  | ExpressionType
  | NakedLiteral
  | ArrayExpressionType
  | ObjectExpressionType {
  if (!isObjectPropertyValueKind(value))
    return { type: UnknownLabel, value: value } as const;
  if (isLiteralKind(value)) return value.value;
  if (isIdentifierKind(value)) return value.name;
  if (isObjectExpressionKind(value)) return parseObjectExpression(value);
  if (isArrayExpressionKind(value)) return parseArrayExpression(value);
  if (isExpressionKind(value)) {
    const expression = parseExpression(value);
    return expression.type === LiteralLabel ? expression.value : expression;
  }
  return { type: UnknownLabel, value: value } as const;
}
