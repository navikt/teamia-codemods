import { getJsxNames, setJsxNames } from "../../../utils/jsxName";
import {
  getRawAttributeValue,
  parseAttribute,
  wrapAttributeValue,
} from "../../../utils/jsxAttributes";
import { findImport, getImportNames, Imports } from "../../../utils/imports";
import { createComments } from "../../../utils/jsxChildren";
import { namedTypes } from "ast-types";
import core, { Collection } from "jscodeshift";
import { notEmpty, notUndefined } from "../../../utils/otherUtils";
import { isJsxElement } from "../../../utils/jsxElement";
import feiloppsummeringTransformer from "./Feiloppsummering";
import { wrapValueInExpressionContainer } from "../../../utils/expression";
import * as Kinds from "ast-types/gen/kinds";

/**
 *
 * export { default as , FnrInputProps } from "./fnr-input";
 * export { default as Input, InputProps } from "./input";
 * export { default as Textarea, TextareaProps } from "./textarea";
 * export { default as TextareaControlled, TextareaControlledProps, } from "./textarea-controlled";
 * export { default as Checkbox, CheckboxProps } from "./checkbox";
 * export { default as CheckboxGruppe } from "./checkbox-gruppe";
 * export { default as Radio, RadioProps } from "./radio";
 * export { default as RadioGruppe } from "./radio-gruppe";
 * export { default as Select, SelectProps } from "./select";
 * export { default as SkjemaGruppe, SkjemaGruppeProps, SkjemaGruppeFeilContext, SkjemaGruppeFeilContextProps, } from "./skjema-gruppe";
 * export { default as ToggleGruppe, ToggleGruppeProps } from "./toggle-gruppe";
 * export { default as ToggleKnapp, ToggleKnappProps } from "./toggle-knapp";
 * export { default as RadioPanelGruppe, RadioPanelGruppeProps, } from "./radio-panel-gruppe";
 * export { default as RadioPanel, RadioPanelProps } from "./radio-panel";
 * export { default as CheckboksPanelGruppe, CheckboksPanelGruppeProps, } from "./checkboks-panel-gruppe";
 * export { default as CheckboksPanel, CheckboksPanelProps, } from "./checkboks-panel";
 * export { default as BekreftCheckboksPanel, BekreftCheckboksPanelProps, } from "./bekreft-checkboks-panel";
 * export { default as Feiloppsummering, FeiloppsummeringProps, FeiloppsummeringFeil, } from "./feiloppsummering";
 * export { default as Label } from "./label";
 * export { default as SkjemaelementFeilmelding } from "./skjemaelement-feilmelding";
 *
 *  Input InputProps -> TextField
 *  Textarea TextareaControlled TextareaProps -> Textarea
 *  Checkbox, CheckboxProps, CheckboxGruppe -> CheckboxGroup Checkbox
 *  Radio, RadioProps, RadioGruppe -> RadioGroup, Radio
 *  Select, SelectProps -> Select
 *  BekreftCheckboksPanel, BekreftCheckboksPanelProps, -> ConfirmationPanel
 *  Feiloppsummering, FeiloppsummeringProps, FeiloppsummeringFeil, -> ErrorSummary ErrorSummary.Item
 *
 *  Label -> Label
 *  FnrInput, FnrInputProps -> ❌
 *  ToggleGruppe, ToggleGruppeProps -> ToggleGroup ToggleGroup.Item ❌
 *  SkjemaGruppe, SkjemaGruppeProps, SkjemaGruppeFeilContext, SkjemaGruppeFeilContextProps -> ❌
 *  RadioPanelGruppe, RadioPanelGruppeProps, RadioPanel, RadioPanelProps -> ❌
 *  CheckboksPanelGruppe, CheckboksPanelGruppeProps, CheckboksPanel, CheckboksPanelProps, -> ❌
 *  SkjemaelementFeilmelding -> ❌
 *
 *  Input InputProps, Textarea TextareaControlled TextareaProps, Checkbox, CheckboxProps, CheckboxGruppe,
 *  Radio, RadioProps, RadioGruppe, Select, SelectProps, ToggleGruppe, ToggleGruppeProps,
 *  BekreftCheckboksPanel, BekreftCheckboksPanelProps, Feiloppsummering, FeiloppsummeringProps, FeiloppsummeringFeil ,Label
 *
 *
 *
 *
 *  FnrInput,
 *  FnrInputProps,
 *  SkjemaGruppe,
 *  SkjemaGruppeProps,
 *  SkjemaGruppeFeilContext,
 *  SkjemaGruppeFeilContextProps,
 *  RadioPanelGruppe,
 *  RadioPanelGruppeProps,
 *  RadioPanel,
 *  RadioPanelProps
 *  CheckboksPanelGruppe,
 *  CheckboksPanelGruppeProps,
 *  CheckboksPanel,
 *  CheckboksPanelProps,
 *  SkjemaelementFeilmelding
 */

const unMigratableComponents = [
  "FnrInput",
  "SkjemaGruppe",
  "SkjemaGruppeFeilContext",
  "RadioPanelGruppe",
  "RadioPanel",
  "CheckboksPanelGruppe",
  "CheckboksPanel",
  "SkjemaelementFeilmelding",
  "ToggleGruppe", // ToggleGruppe/Knapp er strengt talt migrerbare,
  "ToggleKnapp", // men det er kun arkiverte repoer som bruker dem fra skjema-pakken.
] as const;

const unMigratableProps = [
  "FnrInputProps",
  "SkjemaGruppeProps",
  "SkjemaGruppeFeilContextProps",
  "RadioPanelGruppeProps",
  "RadioPanelProps",
  "CheckboksPanelGruppeProps",
  "CheckboksPanelProps",
  "ToggleGruppeProps",
  "ToggleKnappProps",
] as const;

const unMigratableImports = [
  ...unMigratableComponents,
  ...unMigratableProps,
] as const;

function getMigratableNewName(name: Imports) {
  if (
    typeof name.localName !== "string" &&
    typeof name.importedName !== "string"
  )
    return undefined;

  if (migratableComponents.has(name.importedName)) {
    return migratableComponents.get(name.importedName);
  }
  if (migratableComponents.has(name.localName)) {
    return migratableComponents.get(name.localName);
  }
  if (migratableProps.has(name.importedName)) {
    return migratableProps.get(name.importedName);
  }
  if (migratableProps.has(name.localName)) {
    return migratableProps.get(name.localName);
  }
  return undefined;
}
const migratableComponents = new Map([
  ["Input", "TextField"],
  ["Textarea", "Textarea"],
  ["TextareaControlled", "Textarea"],
  ["Checkbox", "Checkbox"],
  ["CheckboxGruppe", "CheckboxGroup"],
  ["Radio", "Radio"],
  ["RadioGruppe", "RadioGroup"],
  ["Select", "Select"],
  ["BekreftCheckboksPanel", "ConfirmationPanel"],
  ["Feiloppsummering", "ErrorSummary"],
  ["Label", "Label"],
]);

const migratableProps = new Map([
  ["InputProps", "TextFieldProps"],
  ["TextareaProps", "TextareaProps"],
  ["CheckboxProps", "CheckboxProps"],
  ["RadioProps", "RadioProps"],
  ["SelectProps", "SelectProps"],
  ["BekreftCheckboksPanelProps", "ConfirmationPanelProps"],
  ["FeiloppsummeringProps", "ErrorSummaryProps"],
  ["FeiloppsummeringFeil", "ErrorSummaryItemProps"],
]);

function breddeToWidth(bredde: unknown) {
  function buildWidth(width: string) {
    return core.jsxAttribute(
      core.jsxIdentifier("style"),
      core.jsxExpressionContainer(
        core.objectExpression([
          core.objectProperty(
            core.stringLiteral("width"),
            core.stringLiteral(width)
          ),
        ])
      )
    );
  }

  switch (bredde) {
    case "fullbredde":
      return buildWidth("100%");
    case "XXL":
      return buildWidth("420px");
    case "XL":
      return buildWidth("350px");
    case "L":
      return buildWidth("280px");
    case "M":
      return buildWidth("210px");
    case "S":
      return buildWidth("140px");
    case "XS":
      return buildWidth("70px");
    case "XXS":
      return buildWidth("35px");
    default:
      return undefined;
  }
}

function getTypeRefName(typeRef: namedTypes.TSTypeReference) {
  function traverse(typeName: namedTypes.TSTypeReference["typeName"]) {
    let name: string[] = [];
    let cursor = typeName;
    let done = false;
    while (!done) {
      if (cursor.type !== "TSQualifiedName") {
        name.unshift(cursor.name);
        done = true;
        return name;
      }

      if (cursor.right.type === "TSQualifiedName") {
        name.unshift(...traverse(cursor.right));
      } else {
        name.unshift(cursor.right.name);
      }

      if (cursor.left.type !== "TSQualifiedName") {
        name.unshift(cursor.left.name);
        done = true;
        return name;
      }
      cursor = cursor.left;
    }
  }

  return traverse(typeRef.typeName);
}

function setTypeBaseName(typeRef: namedTypes.TSTypeReference, newName: string) {
  let cursor = typeRef.typeName;
  let done = false;
  while (!done) {
    if (cursor.type !== "TSQualifiedName") {
      cursor.name = newName;
      done = true;
      return;
    }
    if (cursor.left.type !== "TSQualifiedName") {
      cursor.left.name = newName;
      done = true;
      return;
    }
    cursor = cursor.left;
  }
}

type Specifier =
  | namedTypes.ImportSpecifier
  | namedTypes.ImportDefaultSpecifier
  | namedTypes.ImportNamespaceSpecifier;

function getSpecifierName(specifier: Specifier) {
  if (specifier.type === "ImportSpecifier") {
    return {
      importedName: specifier.imported.name,
      localName: specifier.local.name,
    };
  }
  return {
    importedName: specifier.local.name,
    localName: specifier.local.name,
  };
}

function matchName(imp: Imports, name: string): boolean {
  return getImportedName(imp) === name || getLocalName(imp) === name;
}

function getImportedName(imp: Imports) {
  return imp.importedName || imp.localName;
}
function getLocalName(imp: Imports) {
  return imp.localName || imp.importedName;
}

function tupleIncludes<T extends readonly string[]>(tuple: T, val: string) {
  return tuple.includes(val);
}

export default function transformer(file, api) {
  const localToImported = new Map<string, string>();
  const importedToLocal = new Map<string, string>();

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

  const navFrontendPath = findImport(root, "nav-frontend-skjema");
  const dsReactPath = findImport(root, "@navikt/ds-react");

  // Early return if file does not import skjema
  if (navFrontendPath.size() === 0) {
    return;
  }

  const importNames = getImportNames(navFrontendPath);
  /*const jsxElements = importNames.map(imp => ({
    importData: imp,
    jsxElements: root.findJSXElements(imp.localName),
  }))

   */

  type ImportedElements =
    | {
        type: "JSXComponent";
        importData: Imports;
        jsxElements: Collection<namedTypes.JSXElement>;
      }
    | {
        type: "TSType";
        importData: Imports;
        tsTypes: Collection<namedTypes.TSTypeReference>;
      }
    | {
        type: "UnusedImport";
        importData: Imports;
      };

  const importedElements = importNames.map((imp): ImportedElements => {
    if (
      typeof imp.localName === "string" &&
      typeof imp.importedName === "string"
    ) {
      localToImported.set(imp.localName, imp.importedName);
      importedToLocal.set(imp.importedName, imp.localName);
    }
    if (
      typeof imp.localName === "string" &&
      typeof imp.importedName !== "string"
    ) {
      localToImported.set(imp.localName, imp.localName);
      importedToLocal.set(imp.localName, imp.localName);
    }
    if (
      typeof imp.localName !== "string" &&
      typeof imp.importedName === "string"
    ) {
      localToImported.set(imp.importedName, imp.importedName);
      importedToLocal.set(imp.importedName, imp.importedName);
    }

    const jsxLocalName = root.findJSXElements(getLocalName(imp));
    const jsxImportName = root.findJSXElements(getImportedName(imp));
    const typesLocalName = root
      .find(namedTypes.TSTypeReference)
      .filter((t) => getLocalName(imp) === t.node[0]);
    const typesImportedName = root
      .find(namedTypes.TSTypeReference)
      .filter((t) => getImportedName(imp) === getTypeRefName(t.node)[0]);

    if (jsxLocalName.size() > 0) {
      return {
        type: "JSXComponent",
        importData: imp,
        jsxElements: jsxLocalName,
      } as const;
    }
    if (jsxImportName.size() > 0) {
      return {
        type: "JSXComponent",
        importData: imp,
        jsxElements: jsxImportName,
      } as const;
    }
    if (typesLocalName.size() > 0) {
      return {
        type: "TSType",
        importData: imp,
        tsTypes: typesLocalName,
      } as const;
    }
    if (typesImportedName.size() > 0) {
      return {
        type: "TSType",
        importData: imp,
        tsTypes: typesImportedName,
      } as const;
    }
    return {
      type: "UnusedImport",
      importData: imp,
    } as const;
  });

  const unUsedImports = importedElements
    .filter((e) => e.type === "UnusedImport")
    .map((e) => getImportedName(e.importData));

  const dsImports = importNames
    //.map(getImportedName)
    .filter(
      (imp) =>
        !(
          unUsedImports.includes(imp.importedName) ||
          unUsedImports.includes(imp.localName)
        )
    )
    .map((imp) => getMigratableNewName(imp))
    .filter(notUndefined);

  // Muter state:
  // hvis ds-react ikke finnes, lag den, ellers append
  if (dsReactPath.size() === 0) {
    navFrontendPath.insertAfter(
      j.importDeclaration(
        dsImports.map((importName) =>
          j.importSpecifier(j.jsxIdentifier(importName))
        ),
        j.stringLiteral("@navikt/ds-react")
      )
    );
  } else {
    dsReactPath.forEach((declaration) => {
      const specifierNames = declaration.node.specifiers.map(getSpecifierName);

      dsImports.forEach((dsImport) => {
        if (
          !specifierNames.map((spec) => spec.importedName).includes(dsImport)
        ) {
          declaration.node.specifiers = [
            ...declaration.node.specifiers,
            j.importSpecifier(j.jsxIdentifier(dsImport)),
          ];
        }
      });
    });
  }

  // Fjern alle paths som kan migreres, hvis ingen specifiers er igjen fjern import deklarasjonen.
  navFrontendPath.forEach((declaration) => {
    declaration.node.specifiers = declaration.node.specifiers.filter(
      (specifier) => {
        if (
          (specifier.type === "ImportSpecifier" &&
            unUsedImports.includes(specifier.imported.name)) ||
          unUsedImports.includes(specifier.local.name)
        ) {
          return false;
        }

        return (
          (specifier.type === "ImportSpecifier" &&
            tupleIncludes(unMigratableImports, specifier.imported.name)) ||
          tupleIncludes(unMigratableImports, specifier.local.name)
        );
      }
    );
  });
  if (
    navFrontendPath.every(
      (declaration) => declaration.node.specifiers.length === 0
    )
  ) {
    navFrontendPath.remove();
  }

  importedElements?.forEach((imp) => {
    if (imp.type === "TSType") {
      imp.tsTypes?.forEach((typeRef) => {
        const typeName = getTypeRefName(typeRef.node);

        if (typeName.length === 0) return;

        const newBaseName = getMigratableNewName(imp.importData);

        if (typeof newBaseName !== "string") return;

        setTypeBaseName(typeRef.node, newBaseName);

        return;
      });
    }
    if (imp.type === "JSXComponent") {
      imp.jsxElements?.forEach((jsx) => {
        if (
          tupleIncludes(unMigratableImports, getImportedName(imp.importData))
        ) {
          jsx.insertBefore(
            createComments([
              "TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk",
            ])
          );

          return;
        }

        if (matchName(imp.importData, "Input")) {
          setJsxNames(jsx.node, ["TextField"]);

          const smallOrMedium = (val: unknown) => {
            if (val === true || val === null) {
              return j.jsxAttribute(
                j.jsxIdentifier("size"),
                j.stringLiteral("small")
              );
            }
            return j.jsxAttribute(
              j.jsxIdentifier("size"),
              j.stringLiteral("medium")
            );
          };

          let attributes = jsx.node.openingElement.attributes;

          attributes
            .map((attr) => {
              const parsed = parseAttribute(attr);
              if (parsed.type === "JSXSpreadAttribute") return attr;

              switch (parsed.name) {
                case "bredde":
                  return breddeToWidth(parsed.value);
                case "feil":
                  return j.jsxAttribute(
                    j.jsxIdentifier("error"),
                    wrapAttributeValue(parsed.value)
                  );
                case "inputRef":
                  return j.jsxAttribute(
                    j.jsxIdentifier("ref"),
                    wrapAttributeValue(parsed.value)
                  );
                case "mini":
                  return smallOrMedium(getRawAttributeValue(attr));
                default:
                  return attr;
              }
            })
            .filter(notUndefined);
        }

        if (
          matchName(imp.importData, "Textarea") ||
          matchName(imp.importData, "TextareaControlled")
        ) {
          if (matchName(imp.importData, "TextareaControlled")) {
            setJsxNames(jsx.node, ["Textarea"]);
          }

          jsx.node.openingElement.attributes =
            jsx.node.openingElement.attributes.map((attr) => {
              const parsed = parseAttribute(attr);
              if (attr.type === "JSXSpreadAttribute") return attr;
              switch (parsed.name) {
                case "feil":
                  return j.jsxAttribute(j.jsxIdentifier("error"), attr.value);
                case "textareaRef":
                  return j.jsxAttribute(j.jsxIdentifier("ref"), attr.value);
                default:
                  return attr;
              }
            });
        }

        if (matchName(imp.importData, "Checkbox")) {
          const commentLines: string[] = [];

          jsx.node.openingElement.attributes =
            jsx.node.openingElement.attributes
              .map((attr) => {
                let parsed = parseAttribute(attr);
                if (attr.type === "JSXSpreadAttribute") return attr;
                switch (parsed.name) {
                  case "checkBoxRef":
                    return j.jsxAttribute(j.jsxIdentifier("ref"), attr.value);
                  case "label": {
                    jsx.node.children = [...jsx.node.children, attr.value];
                    return undefined;
                  }
                  case "feil": {
                    commentLines.push(
                      "TODO: i react-ds er error på checkbox en bool, selve feilmedlingene ligger i CheckboxGruppe"
                    );
                    return j.jsxAttribute(j.jsxIdentifier("error"));
                  }
                  case "onChange": {
                    commentLines.push(
                      "TODO: det er lagt opp for at man bruker onChange på CheckboxGruppe komponenten i stedet for å bruke hver enkelt checkbox sin onChange"
                    );
                    return attr;
                  }
                }
              })
              .filter(notUndefined);

          if (notEmpty(commentLines)) {
            jsx.node.children = [
              ...jsx.node.children,
              ...createComments(commentLines),
            ];
          }
        }

        if (matchName(imp.importData, "CheckboxGruppe")) {
          const commentLines: string[] = [];

          if (
            jsx.node.openingElement.attributes.every((attr) => {
              const parsed = parseAttribute(attr);
              return parsed.name !== "onChange";
            })
          ) {
            commentLines.push(
              "ds-react legger opp til at man bruker onChange på CheckboxGroup komponenten i stedet for individuelle Checkbox komponenter"
            );
          }

          jsx.node.openingElement.attributes =
            jsx.node.openingElement.attributes
              .map((attr) => {
                if (attr.type === "JSXSpreadAttribute") return attr;

                const parsed = parseAttribute(attr);

                switch (parsed.name) {
                  case "feil":
                    return j.jsxAttribute(j.jsxIdentifier("error"), attr.value);
                  case "feilmeldingId":
                    return j.jsxAttribute(j.identifier("errorId"), attr.value);
                  case "tag": {
                    commentLines.push(
                      "TODO: ds-react støtter ikke custom tag for CheckboxGroup"
                    );
                    return undefined;
                  }
                  case "utenFeilPropagering": {
                    commentLines.push(
                      "TODO: ds-react støtter ikke utenFeilPropagering for CheckboxGroup"
                    );
                    return undefined;
                  }
                  default:
                    return attr;
                }
              })
              .filter(notUndefined);

          if (notEmpty(commentLines)) {
            jsx.node.children = [
              ...createComments(commentLines),
              ...jsx.node.children,
            ];
          }

          setJsxNames(jsx.node, ["CheckboxGroup"]);
        }

        if (matchName(imp.importData, "Radio")) {
          const commentLines: string[] = [];
          let attributes = jsx.node.openingElement.attributes;

          attributes = attributes
            .map((attr) => {
              const parsed = parseAttribute(attr);

              switch (parsed.name) {
                case "name": {
                  commentLines.push(
                    "TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene"
                  );

                  const parentNode = jsx.parent?.node;
                  if (
                    isJsxElement(parentNode) &&
                    ["RadioGruppe", "RadioGroup"].includes(
                      getJsxNames(parentNode)
                    )
                  ) {
                    if (
                      !parentNode.openingElement.attributes.some(
                        (prop) => parseAttribute(prop).name === "name"
                      )
                    ) {
                      parentNode.openingElement.attributes = [
                        ...parentNode.openingElement.attributes,
                        j.jsxAttribute(
                          j.jsxIdentifier("name"),
                          wrapAttributeValue(parsed.value)
                        ),
                      ];
                    }
                    return undefined;
                  }
                  return attr;
                }
                case "label": {
                  const val: Kinds.ExpressionKind =
                    attr.type === "JSXSpreadAttribute"
                      ? attr.argument
                      : attr.value;
                  jsx.node.children = [
                    wrapValueInExpressionContainer(val),
                    ...jsx.node.children,
                  ];
                  return undefined;
                }
                case "feil": {
                  commentLines.push(
                    "TODO: i ds-react blir feil/error håndtert i RadioGroup komponenten"
                  );
                  return undefined;
                }
                case "radioRef": {
                  if (attr.type !== "JSXSpreadAttribute") {
                    return j.jsxAttribute(j.jsxIdentifier("ref"), attr.value);
                  }
                  commentLines.push(
                    "TODO: 'radioRef' er blitt 'ref', men siden den var deklarert som en variabel så kan den ikke automatisk migreres"
                  );
                  return attr;
                }
                case "onChange": {
                  commentLines.push(
                    "TODO: ds-react har lagt opp til at 'onChange' event handler blir satt i RadioGroup komponenten"
                  );
                  return attr;
                }
                default:
                  return attr;
              }
            })
            .filter(notUndefined);

          if (
            !attributes.some((attr) => parseAttribute(attr).name === "value")
          ) {
            attributes = [
              j.jsxAttribute(
                j.jsxIdentifier("value"),
                j.stringLiteral(
                  "TODO: ds-react krever en 'value' prop for Radio komponenter"
                )
              ),
              ...attributes,
            ];
          }

          if (notEmpty(commentLines)) {
            jsx.insertBefore(...createComments(commentLines));
          }

          jsx.node.openingElement.attributes = attributes;
        }

        if (matchName(imp.importData, "RadioGruppe")) {
          const commentLines: string[] = [];

          jsx.node.openingElement.attributes =
            jsx.node.openingElement.attributes.map((attr) => {
              const parsed = parseAttribute(attr);

              switch (parsed.name) {
                case "feil":
                  return j.jsxAttribute(
                    j.jsxIdentifier("error"),
                    wrapValueInExpressionContainer(parsed.value)
                  );
                case "feilmeldingId":
                  return j.jsxAttribute(
                    j.jsxIdentifier("errorId"),
                    wrapValueInExpressionContainer(parsed.value)
                  );
                case "tag": {
                  commentLines.push("TODO: 'tag' er ikke støttet i RadioGroup");
                  return undefined;
                }
                case "utenFeilPropagering": {
                  commentLines.push(
                    "TODO: 'utenFeilPropagering' er ikke støttet i RadioGroup"
                  );
                  return undefined;
                }
                default:
                  return attr;
              }
            });

          setJsxNames(jsx.node, ["RadioGroup"]);

          if (notEmpty(commentLines)) {
            jsx.insertBefore(...createComments(commentLines));
          }
        }

        if (matchName(imp.importData, "Select")) {
          const commentLines: string[] = [];

          jsx.node.openingElement.attributes =
            jsx.node.openingElement.attributes.map((attr) => {
              const parsed = parseAttribute(attr);
              if (attr.type !== "JSXSpreadAttribute") {
                switch (parsed.name) {
                  case "bredde":
                    return breddeToWidth(parsed.value);
                  case "feil":
                    return j.jsxAttribute(j.jsxIdentifier("error"), attr.value);
                  case "selectRef":
                    return j.jsxAttribute(j.jsxIdentifier("ref"), attr.value);
                  case "selected": {
                    commentLines.push(
                      "TODO: ds-react støtter ikke 'selected' prop"
                    );
                    return undefined;
                  }
                  default:
                    return attr;
                }
              }

              switch (parsed.name) {
                case "bredde": {
                  commentLines.push(
                    "TODO: ds-react støtter ikke 'bredde' property, siden denne var definert som en variabel så kan den ikke automatisk migreres"
                  );
                  return attr;
                }
                case "feil":
                  return j.jsxAttribute(
                    j.jsxIdentifier("error"),
                    wrapValueInExpressionContainer(attr.argument)
                  );
                case "selectRef":
                  return j.jsxAttribute(
                    j.jsxIdentifier("ref"),
                    wrapValueInExpressionContainer(attr.argument)
                  );
                case "selected": {
                  commentLines.push(
                    "TODO: ds-react støtter ikke 'selected' prop"
                  );
                  return undefined;
                }
                default:
                  return attr;
              }
            });

          if (notEmpty(commentLines)) {
            jsx.insertBefore(...createComments(commentLines));
          }
        }

        if (matchName(imp.importData, "BekreftCheckboksPanel")) {
          jsx.node.openingElement.attributes =
            jsx.node.openingElement.attributes.map((attr) => {
              const parsed = parseAttribute(attr);

              switch (parsed.name) {
                case "feil":
                  return j.jsxAttribute(
                    j.jsxIdentifier("error"),
                    attr.type === "JSXSpreadAttribute"
                      ? wrapValueInExpressionContainer(attr.argument)
                      : attr.value
                  );
                case "inputProps":
                  return attr.type === "JSXSpreadAttribute"
                    ? attr
                    : j.jsxSpreadAttribute(attr.value);
                default:
                  return attr;
              }
            });

          setJsxNames(jsx.node, ["ConfirmationPanel"]);
        }

        if (matchName(imp.importData, "Feiloppsummering")) {
          feiloppsummeringTransformer(j, jsx);
        }

        /**
         * Endrer navn på komponentene
         */
      });
    }
  });

  return root.toSource();
}
