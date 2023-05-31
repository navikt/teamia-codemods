import * as Kinds from "ast-types/gen/kinds";
import { builders, namedTypes } from "ast-types";
import core, { ASTPath, Collection } from "jscodeshift";
import { wrapValue } from "./expression";
import {
  isAstNodeKind,
  isExpressionKind,
  isIdentifierKind,
  isJsxEmptyExpressionKind,
  isJsxMemberExpressionKind,
  isJsxNamespacedNameKinds,
  isNakedLiteral,
  isStringLiteralKind,
  jsxElementKind,
  jsxExpressionContainerKind,
  jsxFragmentKind,
  jsxSpreadChildKind,
  jsxTextKind,
} from "./typeKinds";
import { generateNewNames } from "./jsxName";
import { isInList } from "./otherUtils";

const validChildTypes = [
  ...jsxTextKind,
  ...jsxExpressionContainerKind,
  ...jsxSpreadChildKind,
  ...jsxElementKind,
  ...jsxFragmentKind,
] as const;

export type JsxChild =
  | namedTypes.JSXExpressionContainer
  | namedTypes.JSXElement
  | namedTypes.JSXFragment
  | namedTypes.JSXSpreadChild
  | namedTypes.JSXText
  | namedTypes.Literal
  | namedTypes.StringLiteral
  | namedTypes.NumericLiteral
  | namedTypes.BigIntLiteral
  | namedTypes.NullLiteral
  | namedTypes.BooleanLiteral
  | namedTypes.RegExpLiteral;

export function isValidChild(value: unknown): value is JsxChild {
  return isInList(value, validChildTypes);
}

export function wrapChild(value: unknown) {
  if (isValidChild(value)) return value;
  if (isNakedLiteral(value)) return builders.jsxText(String(value));
  if (isStringLiteralKind(value)) return builders.jsxText(value.value);
  if (isExpressionKind(value)) return builders.jsxExpressionContainer(value);
  if (isJsxEmptyExpressionKind(value))
    return builders.jsxExpressionContainer(value);
  return undefined;
}

export function getChildren(
  jsxElement: ASTPath<namedTypes.JSXElement>
): JsxChild[] {
  return jsxElement.value.children;
}

export function setChildren(
  jsxElement: ASTPath<namedTypes.JSXElement>,
  children: JsxChild[]
) {
  jsxElement.value.children = children;
}
export function insertChildren(arr: JsxChild[], index, ...items: unknown[]) {
  //don't modify existing array
  let shallowArrCopy = [...arr];
  let wrappedItems = items.map((item) => {
    if (isValidChild(item)) {
      return item;
    }
    return wrapValue(item);
  });

  shallowArrCopy.splice(index, 0, ...wrappedItems);
  return shallowArrCopy;
}

export function prependChildren(arr: JsxChild[], ...items: unknown[]) {
  return insertChildren(arr, 0, ...items);
}
export function appendChildren(arr: JsxChild[], ...items: unknown[]) {
  return insertChildren(arr, arr.length, ...items);
}

export function addChildren(
  jsxElementPath: ASTPath<Kinds.JSXElementKind>,
  children: Kinds.JSXElementKind["children"],
  position?: number | "first" | "last"
) {
  if (children.length === 0) {
    return;
  }

  if (!jsxElementPath.node.closingElement) {
    jsxElementPath.node.openingElement.selfClosing = false;
    jsxElementPath.node.selfClosing = false;
    jsxElementPath.node.closingElement = builders.jsxClosingElement(
      jsxElementPath.node.openingElement.name
    );
  }
  const existingChildren =
    jsxElementPath.node.children instanceof Array
      ? [...jsxElementPath.node.children]
      : undefined;

  if (existingChildren !== undefined && existingChildren.length > 0) {
    switch (position) {
      case undefined: {
        jsxElementPath.node.children = [...existingChildren, ...children];
        break;
      }
      case "first": {
        jsxElementPath.node.children = [...children, ...existingChildren];
        break;
      }
      case "last": {
        jsxElementPath.node.children = [...existingChildren, ...children];
        break;
      }
      default: {
        existingChildren.splice(position, 0, ...children);
        jsxElementPath.node.children = existingChildren.splice(
          position,
          0,
          ...children
        );
        break;
      }
    }
  } else {
    jsxElementPath.node.children = children;
  }
}

export function createChild(
  name: string | string[],
  children: JsxChild[],
  attributes: (namedTypes.JSXAttribute | namedTypes.JSXSpreadAttribute)[]
) {
  const identifier =
    typeof name === "string"
      ? generateNewNames([name])
      : generateNewNames(name);

  if (identifier === undefined) {
    return core.jsxExpressionContainer(core.jsxEmptyExpression());
  }

  return core.jsxElement(
    core.jsxOpeningElement(identifier, attributes),
    core.jsxClosingElement(identifier),
    children
  );
}

export function createComments(comments: string[]) {
  const commentContent = core.jsxEmptyExpression();
  commentContent.comments = comments.map((comment) => {
    return core.commentLine(" " + comment);
  });

  const comment = core.jsxExpressionContainer(commentContent);
  const lineBreak = core.jsxText("\n");

  return [lineBreak, comment, lineBreak];
}

export function getTemplateLiteral(
  head: string,
  tail: string,
  identifier: string
) {
  return core.templateLiteral(
    [
      core.templateElement({ cooked: head, raw: head }, false),
      core.templateElement({ cooked: tail, raw: tail }, true),
    ],
    [core.identifier(identifier)]
  );
}

export function isJsxElement(value: unknown): value is namedTypes.JSXElement {
  return isInList(value, jsxElementKind);
}

export function isJsxFragment(value: unknown): value is Kinds.JSXFragmentKind {
  return isInList(value, jsxFragmentKind);
}

export function isJsxText(value: unknown): value is Kinds.JSXTextKind {
  return isInList(value, jsxTextKind);
}

export function findJsxByNamespace(path: Collection, namespace: string) {
  path.find(namedTypes.JSXElement, findRootNamespace(namespace));
}

function findRootNamespace(namespace: string): (node: unknown) => boolean {
  return function traverse(node: unknown): boolean {
    if (!isAstNodeKind(node)) return false;
    if (isJsxElement(node)) return traverse(node.openingElement.name);
    if (isIdentifierKind(node)) return node.name === namespace;
    if (isJsxNamespacedNameKinds(node))
      return node.namespace.name === namespace;
    if (isJsxMemberExpressionKind(node)) return traverse(node.object);
    return false;
  };
}

//.openingElement.name.object.name
