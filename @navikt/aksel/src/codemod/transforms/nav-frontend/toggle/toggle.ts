import { setJsxName } from "../../../utils/jsxName";
import {
  createProp,
  getPropValue,
  hasProp,
  removeProp,
  replaceProp,
} from "../../../utils/jsxAttributes";
import {
  addImports,
  findImports,
  getImportData,
  removeImports,
} from "../../../utils/imports";
import { notEmpty, notUndefined } from "../../../utils/otherUtils";
import { isArrayExpressionKind } from "../../../utils/typeKinds";
import {
  addChildren,
  createChild,
  createComments,
  wrapChild,
} from "../../../utils/jsxElements";
import {
  getPropertyKeyName,
  isObjectExpressionKind,
  isObjectPropertyKind,
} from "../../../utils/object";

function hasOnClickProp(prop: unknown) {
  return getToggleProps(prop).some((record) => {
    return "onClick" in record;
  });
}

function hasValueProp(prop: unknown) {
  return getToggleProps(prop).some((record) => {
    return "value" in record;
  });
}

function getToggleProps(arrayNode: unknown) {
  if (!isArrayExpressionKind(arrayNode)) return [];
  return arrayNode.elements
    .map((arrElement): Record<string, any> => {
      if (isObjectExpressionKind(arrElement)) {
        return Object.assign(
          {},
          ...arrElement.properties
            .filter(isObjectPropertyKind)
            .map((prop) => ({ [getPropertyKeyName(prop.key)]: prop.value }))
        );
      }
      return undefined;
    })
    .filter(notUndefined);
}

function extractChildFromProps(props: Record<string, any>) {
  return "children" in props ? wrapChild(props.children) : undefined;
}
function extractChildsProps(props: Record<string, any>) {
  return Object.entries(props)
    .filter(([key, value]) => !["children", "kompakt", "pressed"].includes(key))
    .map(([key, value]) => createProp(key, value));
}

function extractChildAndProps(props: Record<string, any>) {
  return {
    child: extractChildFromProps(props),
    childProps: extractChildsProps(props),
  };
}

function createToggleItems(prop: unknown) {
  return getToggleProps(prop)
    .map(extractChildAndProps)
    .filter((props) => notUndefined(props.child))
    .map((props) => {
      return createChild(
        ["ToggleGroup", "Item"],
        [props.child],
        props.childProps
      );
    });
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

  const j = api.jscodeshift;
  const root = j(file.source);

  const navFrontendPath = findImports(root, "nav-frontend-toggle");

  // Early return if file does not import component
  if (navFrontendPath.size() === 0) {
    return;
  }

  const importNames = getImportData(navFrontendPath);
  const jsxElements = importNames.map((imp) => ({
    importData: imp,
    jsxElements: root.findJSXElements(imp.localName),
  }));

  addImports(root, ["ToggleGroup"], "@navikt/ds-react");
  removeImports(
    root,
    [
      "*",
      "default",
      "ToggleKnappPure",
      "ToggleKnappPureProps",
      "ToggleKnapp",
      "ToggleGruppe",
      "ToggleGruppeProps",
      "ToggleGruppePure",
      "ToggleGruppePureProps",
    ],
    "nav-frontend-toggle"
  );

  /**
   * Endrer state
   */

  jsxElements?.forEach((imp) => {
    imp.jsxElements?.forEach((jsx) => {
      const commentLines: string[] = [];
      setJsxName(jsx.node, "ToggleGroup");

      if (imp.importData.importedName === "ToggleGruppe") {
        const toggles = getPropValue(jsx, "defaultToggles");
        removeProp(jsx, "defaultToggles");
        if (hasOnClickProp(toggles)) {
          commentLines.push(
            "TODO: toggleknapper støtter fremdeles onClick, men det er anbefalt å bruke det nye apiet til 'ToggleGroup'"
          );
        }
        if (!hasValueProp(toggles)) {
          commentLines.push(
            "TODO: sørg for å legge til value prop i 'ToggleGroup.Item'"
          );
        }

        const children = createToggleItems(toggles);
        addChildren(jsx, children);
      }

      if (imp.importData.importedName === "ToggleGruppePure") {
        const toggles = getPropValue(jsx, "toggles");
        removeProp(jsx, "toggles");
        if (hasOnClickProp(toggles)) {
          commentLines.push(
            "TODO: toggleknapper støtter fremdeles onClick, men det er anbefalt å bruke det nye apiet til 'ToggleGroup'"
          );
        }
        if (!hasValueProp(toggles)) {
          commentLines.push(
            "TODO: sørg for å legge til value prop i 'ToggleGroup.Item'"
          );
        }
        const children = createToggleItems(toggles);
        addChildren(jsx, children);
      }

      if (hasProp(jsx, "onChange")) {
        commentLines.push(
          "TODO: vær bevist på at at apiet til ToggleGroup har endret seg, dette kan knekke eksisterende 'onChange'"
        );
      }

      if (hasProp(jsx, "kompakt")) {
        const kompakt = getPropValue(jsx, "kompakt");
        if (kompakt === true || kompakt === undefined || kompakt === null) {
          replaceProp(jsx, "kompakt", "size", "small");
        } else {
          replaceProp(jsx, "kompakt", "size", "medium");
        }
      }

      if (hasProp(jsx, "minstEn")) {
        commentLines.push("TODO: 'minstEn' støttes ikke i ds-react");
        removeProp(jsx, "minstEn");
      }
      if (hasProp(jsx, "multiSelect")) {
        commentLines.push("TODO: 'multiSelect' støttes ikke i ds-react");
        removeProp(jsx, "multiSelect");
      }

      if (notEmpty(commentLines)) {
        jsx.insertBefore(...createComments(commentLines));
      }
    });
  });

  return root.toSource();
}
