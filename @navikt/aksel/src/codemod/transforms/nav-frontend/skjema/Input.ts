import { JSCodeshift, ASTPath } from "jscodeshift";
import { namedTypes } from "ast-types";
import { parseAttribute } from "../../../utils/jsxAttributes";
import { notUndefined } from "../../../utils/otherUtils";
import { setJsxNames } from "../../../utils/jsxName";
import { breddeToWidth } from "./skjema";
import { wrapValue } from "../../../utils/expression";

export default function InputTransformer(
  j: JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>
) {
  setJsxNames(jsx.node, ["TextField"]);

  const smallOrMedium = (val: unknown) => {
    if (val === true || val === null) {
      return j.jsxAttribute(j.jsxIdentifier("size"), j.stringLiteral("small"));
    }
    return j.jsxAttribute(j.jsxIdentifier("size"), j.stringLiteral("medium"));
  };

  jsx.node.openingElement.attributes = jsx.node.openingElement.attributes
    .map((attr) => {
      const parsed = parseAttribute(attr);

      switch (parsed.name) {
        case "bredde":
          return breddeToWidth(parsed.rawValue);
        case "feil":
          return j.jsxAttribute(
            j.jsxIdentifier("error"),
            wrapValue(parsed.rawValue)
          );
        case "inputRef":
          return j.jsxAttribute(
            j.jsxIdentifier("ref"),
            wrapValue(parsed.value)
          );
        case "mini":
          return smallOrMedium(parsed.rawValue);
        default:
          return attr;
      }
    })
    .filter(notUndefined);
}
