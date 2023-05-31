import { getJsxNames, setJsxName, setJsxNames } from "../../../utils/jsxName";
import { parseAttribute, ParsedAttribute } from "../../../utils/jsxAttributes";
import { findImports, getImportData } from "../../../utils/imports";
import { createChild, createComments } from "../../../utils/jsxElements";
import { ImmutableMap, notUndefined } from "../../../utils/otherUtils";
import { wrapValue } from "../../../utils/expression";

function getNewPlacement(placement: unknown) {
  if (typeof placement !== "string") return "top";

  const oldNewMap = new Map([
    ["over", "top"],
    ["over-venstre", "top-start"],
    ["over-hoyre", "top-end"],
    ["under", "bottom"],
    ["under-venstre", "bottom-start"],
    ["under-hoyre", "bottom-end"],
    ["venstre", "left"],
    ["hoyre", "right"],
  ]);

  if (oldNewMap.has(placement)) {
    return oldNewMap.get(placement);
  }
  return "top";
}

const oldToNewNameMap: ImmutableMap<string, string | undefined> = new Map([
  ["ankerEl", "anchorEl"],
  ["autoFokus", undefined],
  ["avstandTilAnker", "offset"],
  ["innerRef", "ref"],
  ["onOpen", undefined],
  ["onRequestClose", "onClose"],
  ["orientering", "placement"],
  ["posisjon", undefined],
  ["utenPil", "arrow"],
]);

function getNewName(name: unknown) {
  if (typeof name !== "string") return undefined;

  if (oldToNewNameMap.has(name)) {
    return oldToNewNameMap.get(name);
  }

  return name;
}

const oldToNewContentNameMap: ImmutableMap<string, string | undefined> =
  new Map([
    ["ankerEl", undefined],
    ["autoFokus", undefined],
    ["avstandTilAnker", undefined],
    ["innerRef", "ref"],
    ["onOpen", undefined],
    ["onRequestClose", undefined],
    ["orientering", undefined],
    ["posisjon", undefined],
    ["utenPil", undefined],
  ]);
function getNewNameContent(name: unknown) {
  if (typeof name !== "string") return undefined;

  if (oldToNewContentNameMap.has(name)) {
    return oldToNewContentNameMap.get(name);
  }

  return name;
}

function getNewValue(parsedAttribute: ParsedAttribute) {
  const oldNewMap = new Map<string, (val: unknown) => any>([
    ["orientering", getNewPlacement],
    ["utenPil", (val) => val === false],
  ]);
  if (oldNewMap.has(parsedAttribute.name)) {
    return oldNewMap.get(parsedAttribute.name)(parsedAttribute.rawValue);
  }

  return parsedAttribute.value;
}

export default function transformer(file, api) {
  if (
    file.path !== undefined &&
    (file.path.endsWith(".less") ||
      file.path.endsWith(".sass") ||
      file.path.endsWith(".css"))
  ) {
    console.log("Transform is not applicable to file type, skipping.");
    return;
  }

  // Deklarer state
  const j = api.jscodeshift;
  const root = j(file.source);

  const navFrontendPath = findImports(root, "nav-frontend-popover");
  const dsReactPath = findImports(root, "@navikt/ds-react");

  // Early return if file does not import alertstriper
  if (navFrontendPath.size() === 0) {
    return;
  }

  const importNames = getImportData(navFrontendPath);
  const jsxElements = importNames.map((imp) => ({
    importData: imp,
    jsxElements: root.findJSXElements(imp.localName),
  }));

  // Muter state:
  // hvis ds-react ikke finnes, lag den, ellers append Alert
  if (dsReactPath.size() === 0) {
    navFrontendPath.replaceWith(
      j.importDeclaration(
        [j.importSpecifier(j.jsxIdentifier("Popover"))],
        j.stringLiteral("@navikt/ds-react")
      )
    );
  } else {
    dsReactPath.forEach((declaration) => {
      const importDeclarations = declaration.node.specifiers;
      if (
        !importDeclarations.some((specifier) => {
          return (
            specifier.type === "ImportSpecifier" &&
            specifier.local.name === "Popover"
          );
        })
      ) {
        declaration.node.specifiers = [
          ...importDeclarations,
          j.importSpecifier(j.jsxIdentifier("Popover")),
        ];
        navFrontendPath.remove();
      }
    });
  }

  jsxElements?.forEach((imp) => {
    imp.jsxElements?.forEach((jsx) => {
      /**
       * Endrer navn på komponentene
       */
      if (imp.importData.type === "ImportDefaultSpecifier") {
        setJsxName(jsx.node, "Popover");
        if (
          !jsx.node.children.some(
            (child) =>
              child.type === "JSXElement" &&
              ["Popover.Content", "PopoverBase"].includes(getJsxNames(child))
          )
        ) {
          const children = jsx.node.children;
          jsx.node.children = [
            createChild(["Popover", "Content"], children, []),
          ];
        }
        jsx.node.children = [
          ...jsx.node.children,
          ...createComments([
            "TODO: kan ikke bli fullstendig migrert programatisk, trenger manuell sjekk.",
          ]),
        ];
      } else {
        setJsxNames(jsx.node, ["Popover", "Content"]);
      }

      /**
       * Endrer navn og verdi på attributer
       */

      const commentLines: string[] = [];

      jsx.node.openingElement.attributes = jsx.node.openingElement.attributes
        .map((attr) => {
          const parsed = parseAttribute(attr);

          if (parsed.type !== "JSXSpreadAttribute") {
            if (imp.importData.type === "ImportSpecifier") {
              return notUndefined(getNewNameContent(parsed.name))
                ? j.jsxAttribute(
                    j.jsxIdentifier(getNewNameContent(parsed.name)),
                    wrapValue(getNewValue(parsed))
                  )
                : undefined;
            }
            return notUndefined(getNewName(parsed.name))
              ? j.jsxAttribute(
                  j.jsxIdentifier(getNewName(parsed.name)),
                  wrapValue(getNewValue(parsed))
                )
              : undefined;
          }

          if (imp.importData.type === "ImportSpecifier") {
            if (oldToNewContentNameMap.has(parsed.name)) {
              commentLines.push(
                `TODO: ${parsed.name} er definert som en variabel og kan dermed ikke automatisk migreres`
              );
            }
            return attr;
          }
          if (oldToNewNameMap.has(parsed.name)) {
            commentLines.push(
              `TODO: ${parsed.name} er definert som en variabel og kan dermed ikke automatisk migreres`
            );
          }
          return attr;
        })
        .filter(notUndefined);

      if (commentLines.length > 0) {
        jsx.insertBefore(...createComments(commentLines));
      }
    });
  });

  return root.toSource();
}
