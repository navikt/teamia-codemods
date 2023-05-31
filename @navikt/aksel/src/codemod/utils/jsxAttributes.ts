import * as Kinds from "ast-types/gen/kinds";
import core, { ASTPath, JSXAttribute, JSXSpreadAttribute } from "jscodeshift";
import { builders, namedTypes } from "ast-types";
import {
  isLiteralKind,
  isNakedLiteral,
  NakedLiteral,
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
  stringLiteralKinds,
  jsxTextKind,
  isStringLiteralKind,
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

type ShorthandName = string | NamespacedAttributeName | undefined;
type NamespacedAttributeName = { name: string; namespace?: string };

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

export function isValidAttributeValue(
  value: unknown
): value is ValidAttributeValue {
  return isInList(value, [
    ...stringLiteralKinds,
    ...jsxTextKind,
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

function compareAttributeName(a: ShorthandName, b: ShorthandName): boolean {
  if (a === undefined) return a === b;
  if (b === undefined) return a === b;

  const aAttr = typeof a === "string" ? { name: a, namespace: undefined } : a;
  const bAttr = typeof b === "string" ? { name: b, namespace: undefined } : b;

  return aAttr.name === bAttr.name && aAttr.namespace === bAttr.namespace;
}

export function attributeIsNamed(
  attribute: unknown,
  name: string,
  namespace?: string
) {
  if (!isAttribute(attribute)) {
    return false;
  }
  const attributeName = getAttributeName(attribute);
  if (attributeName === undefined) return false;

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
  return array.some((attribute) => {
    return attributeIsNamed(attribute, name, namespace);
  });
}

export function getAttributeName(value: unknown): ShorthandName | undefined {
  if (!isAttribute(value)) {
    return undefined;
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
  return undefined;
}
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

export function wrapAttributeValue(value: unknown) {
  if (isNakedLiteral(value)) {
    const literal = parseLiteral(value);
    if (literal === undefined) return null;
    if (isStringLiteralKind(literal)) return literal;
    builders.jsxExpressionContainer(literal);
  }

  if (isValidAttributeValue(value)) {
    return value;
  }

  if (isJsxExpressionContainerExpressionKind(value)) {
    return wrapValue(value);
  }
  return undefined;
}

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

function parseShorthandName(name: ShorthandName) {
  if (name === undefined) return { name: undefined, namespace: undefined };
  if (typeof name === "string") return { name: name, namespace: undefined };
  return { name: name.name, namespace: name.namespace };
}

export function parseAttribute(
  attribute: namedTypes.JSXAttribute | namedTypes.JSXSpreadAttribute | undefined
): ParsedAttribute {
  if (attribute === undefined) return undefined;
  //if (attribute.type === "JSXSpreadAttribute") {
  const { name, namespace } = parseShorthandName(getAttributeName(attribute));

  const value = getAttributeValue(attribute);
  const rawValue = getRawAttributeValue(attribute);

  if (isJsxSpreadAttribute(attribute)) {
    return {
      type: "JSXSpreadAttribute",
      name: name,
      value: value,
      rawValue: rawValue,
    } satisfies ParsedAttribute;
  }
  if (isJsxNamespacedAttribute(attribute)) {
    return {
      type: "JSXNamespacedName",
      name: name,
      namespace: namespace,
      value: value,
      rawValue: rawValue,
    } satisfies ParsedAttribute;
  }
  if (isJsxIdentifierAttribute(attribute)) {
    return {
      type: "JSXIdentifier",
      name: name,
      value: value,
      rawValue: rawValue,
    } satisfies ParsedAttribute;
  }
  return undefined;
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

export function hasProp(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  propName: ShorthandName
) {
  const { name, namespace } = parseShorthandName(propName);
  return hasAttribute(
    jsxElement.node.openingElement.attributes,
    name,
    namespace
  );
}

export function getPropValue(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  propname: ShorthandName
) {
  const { name, namespace } = parseShorthandName(propname);
  const attributes = jsxElement.node.openingElement.attributes;
  for (const attribute of attributes) {
    if (attributeIsNamed(attribute, name, namespace)) {
      return getAttributeValue(attribute);
    }
  }
  return undefined;
}

export function renameProp(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  oldName: ShorthandName,
  newName: ShorthandName
) {
  const attributes = jsxElement.node.openingElement.attributes;
  const { name, namespace } = parseShorthandName(oldName);

  jsxElement.node.openingElement.attributes = attributes.map((attribute) => {
    if (
      attributeIsNamed(attribute, name, namespace) &&
      isJsxAttribute(attribute)
    ) {
      return builders.jsxAttribute(buildName(newName), attribute.value);
    }
    return attribute;
  });
}

export function replaceProp(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  oldName: ShorthandName,
  newName: ShorthandName,
  newValue: ValidAttributeValue | string
) {
  removeProp(jsxElement, oldName);
  setProp(jsxElement, newName, newValue);
}

export function removeProp(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  attributeName: ShorthandName
) {
  if (attributeName === undefined) return;
  const { name, namespace } = parseShorthandName(attributeName);

  jsxElement.node.openingElement.attributes =
    jsxElement.node.openingElement.attributes.filter(
      (attribute) => !attributeIsNamed(attribute, name, namespace)
    );
}

export function setProp(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  attributeName: ShorthandName,
  value?: ValidAttributeValue | string
) {
  if (attributeName === undefined) return;
  const { name, namespace } = parseShorthandName(attributeName);

  const propValue =
    typeof value === "string" ? builders.stringLiteral(value) : value;

  const attributes = jsxElement.node.openingElement.attributes;
  if (!hasAttribute(attributes, name, namespace)) {
    jsxElement.node.openingElement.attributes = [
      ...attributes,
      builders.jsxAttribute(buildName(attributeName), propValue),
    ];
  } else {
    jsxElement.node.openingElement.attributes = attributes.map((attribute) => {
      if (attributeIsNamed(attribute, name, namespace)) {
        return builders.jsxAttribute(buildName(attributeName), propValue);
      }
      return attribute;
    });
  }
}

function buildName(name: ShorthandName) {
  if (typeof name === "string") {
    return builders.jsxIdentifier(name);
  }
  return builders.jsxNamespacedName(
    builders.jsxIdentifier(name.namespace),
    builders.jsxIdentifier(name.name)
  );
}

export function createProp(name: ShorthandName, value: unknown) {
  return builders.jsxAttribute(buildName(name), wrapAttributeValue(value));
}
