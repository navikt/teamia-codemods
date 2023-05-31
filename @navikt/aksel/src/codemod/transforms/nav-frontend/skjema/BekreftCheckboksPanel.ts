import { JSCodeshift, ASTPath } from "jscodeshift";
import { namedTypes } from "ast-types";
import { parseAttribute } from "../../../utils/jsxAttributes";
import { setJsxNames } from "../../../utils/jsxName";
import { wrapValue } from "../../../utils/expression";

export default function BekreftCheckboksPanelTransformer(
  j: JSCodeshift,
  jsx: ASTPath<namedTypes.JSXElement>
) {
  jsx.node.openingElement.attributes = jsx.node.openingElement.attributes.map(
    (attr) => {
      const parsed = parseAttribute(attr);

      switch (parsed.name) {
        case "feil":
          return j.jsxAttribute(
            j.jsxIdentifier("error"),
            attr.type === "JSXSpreadAttribute"
              ? wrapValue(attr.argument)
              : attr.value
          );
        case "inputProps":
          return attr.type === "JSXSpreadAttribute"
            ? attr
            : j.jsxSpreadAttribute(attr.value);
        default:
          return attr;
      }
    }
  );

  setJsxNames(jsx.node, ["ConfirmationPanel"]);
}
