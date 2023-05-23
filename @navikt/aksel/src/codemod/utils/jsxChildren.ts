import { namedTypes } from "ast-types";
import core, { ASTPath } from "jscodeshift";
import { wrapValueInExpressionContainer } from "./expression";
import {
  jsxElementKind,
  jsxExpressionContainerKind,
  jsxFragmentKind,
  jsxSpreadChildKind,
  jsxTextKind,
  literalKind,
} from "./typeKinds";
import { generateNewNames } from "./jsxName";

const validChildTypes = [
  ...jsxTextKind,
  ...jsxExpressionContainerKind,
  ...jsxSpreadChildKind,
  ...jsxElementKind,
  ...jsxFragmentKind,
  ...literalKind,
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
//Record<any, any> & {type: typeof validChildTypes[number]};
export function isValidChild(value: unknown): value is JsxChild {
  if (typeof value !== "object" || value === null) return false;
  return (validChildTypes as readonly string[]).includes(value["type"]);
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
    return wrapValueInExpressionContainer(item);
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
