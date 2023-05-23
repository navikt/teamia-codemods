import { namedTypes } from "ast-types";
import { isKeyOfObject } from "./otherUtils";

export function isJsxElement(node: unknown): node is namedTypes.JSXElement {
  if (node === undefined || node === null) return false;
  if (typeof node === "object" && isKeyOfObject("type", node)) {
    return node["type"] === "JSXElement";
  }
}
