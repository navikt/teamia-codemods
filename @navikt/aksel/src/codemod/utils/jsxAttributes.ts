import * as Kinds from "ast-types/gen/kinds";
import core, { ASTPath, JSXAttribute, JSXSpreadAttribute } from "jscodeshift";
import { namedTypes } from "ast-types";
import {
  isAstNodeKind,
  isLiteralKind,
  isNakedLiteral,
  NakedLiteral,
  literalKind,
  jsxExpressionContainerKind,
  jsxElementKind,
  jsxFragmentKind,
  isObject,
} from "./typeKinds";
import { wrapValueInExpressionContainer } from "./expression";

type ValidAttributeValue =
  | Kinds.LiteralKind
  | Kinds.JSXExpressionContainerKind
  | Kinds.JSXElementKind
  | Kinds.JSXFragmentKind;

export function isValidAttributeValue(
  value: unknown
): value is ValidAttributeValue {
  if (isObject(value) && "type" in value && typeof value.type === "string") {
    return (
      [
        ...literalKind,
        ...jsxExpressionContainerKind,
        ...jsxElementKind,
        ...jsxFragmentKind,
      ] as readonly string[]
    ).includes(value.type);
  }
  return false;
}
export function getAttributeName(attribute: JSXAttribute | JSXSpreadAttribute) {
  if (attribute === undefined || !("type" in attribute)) return "";
  if (attribute.type === "JSXSpreadAttribute") return "";
  if (attribute?.name !== undefined && attribute?.name?.type !== undefined) {
    if (attribute.name.type === "JSXIdentifier")
      return attribute?.name?.name || "";
    return attribute?.name?.name?.name;
  }
  return "";
}

export function getRawAttributeValue(
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
      console.log("here?");
      return attribute?.value?.expression?.value || "";
    }
    return attribute?.value || "";
  }
  return undefined;
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
  if (value === undefined) return null;

  if (typeof value === "string") {
    return core.stringLiteral(value);
  }

  if (
    isAstNodeKind(value) &&
    ["JSXElement", "JSXFragment", "JSXExpressionContainer"].includes(value.type)
  ) {
    return value;
  }

  return wrapValueInExpressionContainer(value);
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
  rawValue: string | number | boolean | null | undefined;
};

type ParsedJSXIdentifierAttribute = {
  type: "JSXIdentifier";
  name: string;
  value: NakedLiteral | namedTypes.Expression;
  rawValue: string | number | boolean | null | undefined;
};

type ParsedJSXSpreadAttribute = {
  type: "JSXSpreadAttribute";
  name: undefined | string;
  value: namedTypes.Expression;
  rawValue: string | number | boolean | null | undefined;
};

export function parseLiteral(value: NakedLiteral) {
  if (value === undefined) return core.nullLiteral();
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
  if (attribute.type === "JSXSpreadAttribute") {
    console.log("parse", attribute.argument["name"]);

    let name: string | undefined = undefined;
    switch (attribute.argument.type) {
      case "Identifier":
      case "JSXIdentifier": {
        name = attribute.argument.name;
        break;
      }
      default: {
        name = undefined;
        break;
      }
    }
    //attr?.value?.value || attr?.name?.name || attr?.argument?.name
    return {
      type: "JSXSpreadAttribute",
      name: name,
      value: attribute.argument,
      rawValue: undefined,
    };
  }

  let partialParse;
  switch (attribute.name.type) {
    case "JSXIdentifier": {
      partialParse = {
        type: "JSXIdentifier",
        name: attribute.name.name,
      } satisfies Omit<ParsedJSXIdentifierAttribute, "value" | "rawValue">;
      break;
    }
    case "JSXNamespacedName": {
      partialParse = {
        type: "JSXNamespacedName",
        name: attribute.name.name.name,
        namespace: attribute.name.namespace.name,
      } satisfies Omit<ParsedJSXNamespaceAttribute, "value" | "rawValue">;
      break;
    }
    default: {
      throw Error("Malformed attribute");
    }
  }

  if (isNakedLiteral(attribute.value)) {
    console.log(
      "isNakedLiteral",
      attribute.value,
      parseLiteral(attribute.value)
    );
    return {
      ...partialParse,
      value: parseLiteral(attribute.value),
      rawValue: attribute.value,
    };
  }
  if (isLiteralKind(attribute.value)) {
    console.log("isLiteralKind", attribute.value, attribute.value.value);
    return {
      ...partialParse,
      value: attribute.value,
      rawValue: attribute.value.value,
    };
  }
  if (attribute.value.type === "JSXExpressionContainer") {
    if (isLiteralKind(attribute.value.expression)) {
      console.log(
        "wrapped LiteralKind",
        attribute.value,
        attribute.value.expression.value
      );
      return {
        ...partialParse,
        value: attribute.value.expression,
        rawValue: attribute.value.expression.value,
      };
    }
    console.log("JSXExpressionContainer", attribute.value.expression);
    return {
      ...partialParse,
      value: attribute.value.expression,
      rawValue: undefined,
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
