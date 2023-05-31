import { namedTypes } from "ast-types";
import * as core from "jscodeshift";

export function getJsxBaseName(jsxElement: namedTypes.JSXElement): string {
  return getJsxNamesAsArray(jsxElement)[0];
}

export function getJsxLeafName(jsxElement: namedTypes.JSXElement): string {
  return getJsxNamesAsArray(jsxElement).at(-1);
}
export function getJsxNames(jsxElement: namedTypes.JSXElement): string {
  return getJsxNamesAsArray(jsxElement).join(".");
}
export function getJsxNamesAsArray(
  jsxElement: namedTypes.JSXElement
): string[] {
  let names: string[] = [];

  let cursor = jsxElement.openingElement.name;
  while (cursor !== null) {
    if (cursor.type === "JSXMemberExpression") {
      names = [cursor.property.name, ...names];
      cursor = cursor.object;
    }
    if (cursor.type === "JSXIdentifier") {
      names = [cursor.name, ...names];
      cursor = null;
    }
  }

  return names;
}

export function setJsxNames(
  jsxElement: namedTypes.JSXElement,
  newNames: string[]
) {
  jsxElement.openingElement.name = generateNewNames(newNames);
  jsxElement.closingElement &&
    (jsxElement.closingElement.name = generateNewNames(newNames));
}

export function generateNewNames(newNames: string[]) {
  if (newNames.length === 0) {
    throw new Error("newNames kan ikke være en tom liste");
  }

  const nameTokens = [...newNames];
  /**
   * navn er bygd opp litt kontraintuitivt i AST
   * Hvis du har <NavnA.NavnB.NavnC.NavnD /> så vil det være
   * {
   *    property: {
   *      name: "NavnD"
   *    },
   *    object: {
   *      property: {
   *        name: "NavnC"
   *      },
   *      object: {
   *        property: {
   *          name: "NavnB"
   *        },
   *        object: {
   *          name: "NavnA"
   *        }
   *      }
   *    }
   * }
   */
  let cursor:
    | namedTypes.JSXIdentifier
    | namedTypes.JSXMemberExpression
    | undefined = undefined;
  while (nameTokens.length > 0) {
    if (cursor === undefined) {
      cursor = core.jsxIdentifier(nameTokens.shift());
    } else {
      cursor = core.jsxMemberExpression(
        cursor,
        core.jsxIdentifier(nameTokens.shift())
      );
    }
  }
  return cursor;
}

export const setJsxName = (jsxElement: namedTypes.JSXElement, name: string) => {
  const jsxName = core.jsxIdentifier(name);
  if (!jsxElement.closingElement) {
    jsxElement.openingElement.name = jsxName;
  } else {
    jsxElement.openingElement.name = jsxName;
    jsxElement.closingElement.name = jsxName;
  }
};

export const setJsxBaseName = (
  jsxElement: namedTypes.JSXElement,
  name: string
) => {
  function setBaseName(
    jsxElement: namedTypes.JSXOpeningElement | namedTypes.JSXClosingElement,
    name: string
  ) {
    let cursor:
      | namedTypes.JSXOpeningElement
      | namedTypes.JSXClosingElement
      | namedTypes.JSXMemberExpression = jsxElement;
    while (cursor !== null) {
      switch (cursor.type) {
        case "JSXOpeningElement":
        case "JSXClosingElement": {
          if (cursor.name.type === "JSXMemberExpression") {
            cursor = cursor.name;
            break;
          }
          cursor.name = core.jsxIdentifier(name);
          return;
        }
        case "JSXMemberExpression": {
          if (cursor.object.type === "JSXMemberExpression") {
            cursor = cursor.object;
            break;
          }
          cursor.object = core.jsxIdentifier(name);
          return;
        }
        default:
          throw new Error("Not a valid type");
      }
    }
  }

  if (jsxElement.selfClosing) {
    setBaseName(jsxElement.openingElement, name);
  } else {
    setBaseName(jsxElement.openingElement, name);
    setBaseName(jsxElement.closingElement, name);
  }
};
