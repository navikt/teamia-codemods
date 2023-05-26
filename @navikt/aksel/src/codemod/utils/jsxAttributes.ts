import * as Kinds from "ast-types/gen/kinds";
import core, { ASTPath, JSXAttribute, JSXSpreadAttribute } from "jscodeshift";
import { namedTypes } from "ast-types";
import {
  isLiteralKind,
  isNakedLiteral,
  NakedLiteral,
  literalKinds,
  jsxExpressionContainerKind,
  jsxElementKind,
  jsxFragmentKind,
  isJsxExpressionContainerExpressionKind,
  isJsxExpressionContainerKind,
  isJsxEmptyExpressionKind,
  isIdentifierKind,
  jsxAttributeKinds,
  jsxSpreadAttributeKinds,
  isExpressionKind,
  jsxIdentifierKinds,
  jsxNamespacedNameKinds,
} from "./typeKinds";
import { wrapValue } from "./expression";
import { isInList } from "./otherUtils";

import { isJsxElement, isJsxFragment } from "./jsxElements";

export type ValidAttributeValue =
  | Kinds.LiteralKind
  | Kinds.JSXExpressionContainerKind
  | Kinds.JSXElementKind
  | Kinds.JSXFragmentKind;

export type JSXIdentifierAttribute = Omit<JSXAttribute, "name"> & {
  name: Kinds.JSXIdentifierKind;
};
export type JSXNamespacedAttribute = Omit<JSXAttribute, "name"> & {
  name: Kinds.JSXNamespacedNameKind;
};

export function isValidAttributeValue(
  value: unknown
): value is ValidAttributeValue {
  return isInList(value, [
    ...literalKinds,
    ...jsxExpressionContainerKind,
    ...jsxElementKind,
    ...jsxFragmentKind,
  ]);
}

export function isJsxAttribute(
  value: unknown
): value is Kinds.JSXAttributeKind {
  return isInList(value, jsxAttributeKinds);
}

export function isJsxIdentifierAttribute(
  value: unknown
): value is JSXIdentifierAttribute {
  if (!isJsxAttribute(value)) {
    return false;
  }
  return isInList(value.name, jsxIdentifierKinds);
}

export function isJsxNamespacedAttribute(
  value: unknown
): value is JSXNamespacedAttribute {
  if (!isJsxAttribute(value)) {
    return false;
  }
  return isInList(value.name, jsxNamespacedNameKinds);
}

export function isJsxSpreadAttribute(
  value: unknown
): value is Kinds.JSXSpreadAttributeKind {
  return isInList(value, jsxSpreadAttributeKinds);
}

export function isAttribute(
  value: unknown
): value is Kinds.JSXAttributeKind | Kinds.JSXSpreadAttributeKind {
  return isJsxAttribute(value) || isJsxSpreadAttribute(value);
}

function compareAttributeName(a: AttributeName, b: AttributeName): boolean {
  return a.name === b.name && a.namespace === b.namespace;
}

export function attributeIsNamed(
  attribute: unknown,
  name: string,
  namespace?: string
) {
  if (!isAttribute(attribute)) {
    return false;
  }
  return compareAttributeName(getAttributeName(attribute), {
    name: name,
    namespace: namespace,
  });
}

export function hasAttribute(
  array: unknown[],
  name: string,
  namespace?: string
) {
  return array.some((item) => {
    if (!isAttribute(item)) {
      return false;
    }
    return compareAttributeName(getAttributeName(item), {
      name: name,
      namespace: namespace,
    });
  });
}

type AttributeName = {
  namespace?: string;
  name?: string;
};
export function getAttributeName(value: unknown): AttributeName {
  if (!isAttribute(value)) {
    return {
      name: undefined,
      namespace: undefined,
    };
  }
  if (isJsxAttribute(value)) {
    if (isIdentifierKind(value.name)) {
      return {
        name: value.name.name,
        namespace: undefined,
      };
    }
    return {
      name: value.name.name.name,
      namespace: value.name.namespace.name,
    };
  }
  if (isIdentifierKind(value.argument)) {
    return {
      name: value.argument.name,
      namespace: undefined,
    };
  }
  return {
    name: undefined,
    namespace: undefined,
  };
}

/*export function getRawAttributeValue(
  attribute: JSXAttribute | JSXSpreadAttribute
) {
  if (attribute === undefined || attribute.type === undefined) return "";
  if (attribute.type === "JSXSpreadAttribute") return "";
  if (attribute?.value === null) {
    return null;
  }
  if (isLiteralKind(attribute.value)) return attribute?.value?.value || "";

  if (attribute?.value?.type === "JSXExpressionContainer") {
    if (isLiteralKind(attribute?.value?.expression)) {
      if (attribute?.value?.expression?.value === undefined) return "";
      return attribute?.value?.expression?.value || "";
    }
    return attribute?.value || "";
  }
  return undefined;
}

 */
export function getRawAttributeValue(
  attribute: JSXAttribute | JSXSpreadAttribute
) {
  if (attribute.type === "JSXAttribute") {
    return getRawValue(attribute.value);
  }
  return getRawValue(attribute.argument);
}

export function getRawValue(value: unknown) {
  if (isNakedLiteral(value)) {
    return value;
  }
  if (isValidAttributeValue(value)) {
    const attributeValue = extractAttributeValue(value);
    return isNakedLiteral(attributeValue) ? attributeValue : undefined;
  }
  if (isJsxEmptyExpressionKind(value)) {
    const attributeValue = extractAttributeValue(value);
    return isNakedLiteral(attributeValue) ? attributeValue : undefined;
  }
  if (isExpressionKind(value)) {
    const attributeValue = extractAttributeValue(value);
    return isNakedLiteral(attributeValue) ? attributeValue : undefined;
  }
  return undefined;
}

export function getAttributeValue(
  attribute: JSXAttribute | JSXSpreadAttribute
) {
  if (attribute.type === "JSXAttribute") {
    return extractAttributeValue(attribute.value);
  }
  return extractAttributeValue(attribute.argument);
}
export function extractAttributeValue(
  value:
    | ValidAttributeValue
    | Kinds.ExpressionKind
    | Kinds.JSXEmptyExpressionKind
):
  | undefined
  | NakedLiteral
  | Exclude<
      ValidAttributeValue | Kinds.ExpressionKind,
      Kinds.JSXExpressionContainerKind
    > {
  if (isJsxEmptyExpressionKind(value)) {
    return undefined;
  }
  if (isLiteralKind(value)) {
    return value.value as NakedLiteral;
  }
  if (isJsxElement(value)) {
    return value;
  }
  if (isJsxFragment(value)) {
    return value;
  }
  if (isJsxExpressionContainerKind(value)) {
    return extractAttributeValue(value.expression);
  }
  return value;
}

const filterAttributeByNames =
  (...names: string[]) =>
  (jsxAttribute: ASTPath<namedTypes.JSXAttribute>) => {
    if (jsxAttribute.node.name.type === "JSXIdentifier") {
      return names.includes(jsxAttribute.node.name.name);
    }
    return names.includes(jsxAttribute.node.name.name.name);
  };

export function wrapAttributeValue(value: unknown) {
  if (isNakedLiteral(value)) {
    return parseLiteral(value);
  }

  if (isValidAttributeValue(value)) {
    return value;
  }

  if (isJsxExpressionContainerExpressionKind(value)) {
    return wrapValue(value);
  }
  return undefined;
}

export type ParsedAttribute =
  | ParsedJSXNamespaceAttribute
  | ParsedJSXIdentifierAttribute
  | ParsedJSXSpreadAttribute;

type ParsedJSXNamespaceAttribute = {
  type: "JSXNamespacedName";
  name: string;
  namespace: string;
  value: NakedLiteral | namedTypes.Expression;
  rawValue: NakedLiteral;
};

type ParsedJSXIdentifierAttribute = {
  type: "JSXIdentifier";
  name: string;
  value: NakedLiteral | namedTypes.Expression;
  rawValue: NakedLiteral;
};

type ParsedJSXSpreadAttribute = {
  type: "JSXSpreadAttribute";
  name: undefined | string;
  value: NakedLiteral | namedTypes.Expression;
  rawValue: NakedLiteral;
};

export function parseLiteral(value: NakedLiteral) {
  if (value === undefined) return undefined;
  if (value === null) return core.nullLiteral();
  if (typeof value === "string") return core.stringLiteral(value);
  if (typeof value === "symbol")
    return core.stringLiteral((value as symbol).toString());
  if (typeof value === "number") return core.numericLiteral(value);
  if (typeof value === "boolean") return core.booleanLiteral(value);
  if (typeof value === "bigint")
    return core.bigIntLiteral((value as bigint).toString());
  if (value instanceof RegExp)
    return core.regExpLiteral(value.source, value.flags);
}

export function parseAttribute(
  attribute: namedTypes.JSXAttribute | namedTypes.JSXSpreadAttribute
): ParsedAttribute {
  //if (attribute.type === "JSXSpreadAttribute") {
  const name = getAttributeName(attribute);
  const value = getAttributeValue(attribute);
  const rawValue = getRawAttributeValue(attribute);

  if (isJsxSpreadAttribute(attribute)) {
    return {
      type: "JSXSpreadAttribute",
      name: name.name,
      value: value,
      rawValue: rawValue,
    };
  }
  if (isJsxNamespacedAttribute(attribute)) {
    return {
      type: "JSXNamespacedName",
      name: name.name,
      namespace: name.namespace,
      value: value,
      rawValue: rawValue,
    };
  }
  if (isJsxIdentifierAttribute(attribute)) {
    return {
      type: "JSXIdentifier",
      name: name.name,
      value: value,
      rawValue: rawValue,
    };
  }
}

export function setAttributes(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  attributeArray: (namedTypes.JSXAttribute | namedTypes.JSXSpreadAttribute)[]
) {
  jsxElement.node.attributes = attributeArray;
}

export function getAttributes(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  ...filter: string[]
) {
  //return
  const jsxPath = core(jsxElement);
  const spreadAttributes = jsxPath
    .find(namedTypes.JSXSpreadAttribute)
    .nodes()
    .filter((attribute) => filter.length === 0)
    .map(parseAttribute);
  const attributes = jsxPath
    .find(namedTypes.JSXAttribute)
    .nodes()
    .map(parseAttribute)
    .filter((attribute) =>
      filter.length === 0 ? true : filter.includes(attribute[0])
    );

  return [...attributes, ...spreadAttributes];
}

export function renameAttribute(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  oldName: string,
  newName: string
) {
  core(jsxElement)
    .find(namedTypes.JSXAttribute)
    .filter(filterAttributeByNames(oldName))
    .forEach((attribute) => {
      if (attribute.value.name.type === "JSXIdentifier") {
        attribute.value.name.name = newName;
      } else {
        attribute.value.name.name.name = newName;
      }
    });
}

export const removeAttribute = (
  jsxElement: ASTPath<namedTypes.JSXElement>,
  propertyName: string
) => {
  //const path = core(jsxElement);

  core(jsxElement)
    .find(namedTypes.JSXAttribute)
    .filter((attribute) => attribute.value.name.name === propertyName)
    .remove();
};
