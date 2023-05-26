import {
  findImport,
  getImportNames,
  ImportedElements,
  Imports,
} from "../../../utils/imports";
import { createComments } from "../../../utils/jsxElements";
import { namedTypes } from "ast-types";
import core from "jscodeshift";
import { ImmutableMap, notUndefined } from "../../../utils/otherUtils";
import feiloppsummeringTransformer from "./Feiloppsummering";
import inputTransformer from "./Input";
import TextareaTransformer from "./Textarea";
import CheckboxTransformer from "./Checkbox";
import CheckboxGruppeTransformer from "./CheckboxGruppe";
import RadioTransformer from "./Radio";
import RadioGruppeTransformer from "./RadioGruppe";
import SelectTransformer from "./Select";
import BekreftCheckboksPanelTransformer from "./BekreftCheckboksPanel";

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
const migratableComponents: ImmutableMap<string, string> = new Map([
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

const migratableProps: ImmutableMap<string, string> = new Map([
  ["InputProps", "TextFieldProps"],
  ["TextareaProps", "TextareaProps"],
  ["CheckboxProps", "CheckboxProps"],
  ["RadioProps", "RadioProps"],
  ["SelectProps", "SelectProps"],
  ["BekreftCheckboksPanelProps", "ConfirmationPanelProps"],
  ["FeiloppsummeringProps", "ErrorSummaryProps"],
  ["FeiloppsummeringFeil", "ErrorSummaryItemProps"],
]);

export function breddeToWidth(bredde: unknown) {
  function buildWidth(width: string) {
    return core.jsxAttribute(
      core.jsxIdentifier("style"),
      core.jsxExpressionContainer(
        core.objectExpression([
          core.objectProperty(
            core.jsxIdentifier("width"),
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

export function matchName(imp: Imports, name: string): boolean {
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

  const importedElements = importNames.map((imp): ImportedElements => {
    const jsxLocalName = root.findJSXElements(getLocalName(imp));
    const jsxImportName = root.findJSXElements(getImportedName(imp));
    const typesLocalName = root
      .find(namedTypes.TSTypeReference)
      .filter((t) => getLocalName(imp) === getTypeRefName(t.node)[0]);
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
  if (dsReactPath.size() === 0 && dsImports.length > 0) {
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
            ...createComments([
              "TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk",
            ])
          );

          return;
        }

        if (matchName(imp.importData, "Input")) {
          inputTransformer(j, jsx);
        }

        if (
          matchName(imp.importData, "Textarea") ||
          matchName(imp.importData, "TextareaControlled")
        ) {
          TextareaTransformer(j, jsx, imp);
        }

        if (matchName(imp.importData, "Checkbox")) {
          CheckboxTransformer(j, jsx);
        }

        if (matchName(imp.importData, "CheckboxGruppe")) {
          CheckboxGruppeTransformer(j, jsx);
        }

        if (matchName(imp.importData, "Radio")) {
          RadioTransformer(j, jsx);
        }

        if (matchName(imp.importData, "RadioGruppe")) {
          RadioGruppeTransformer(j, jsx);
        }

        if (matchName(imp.importData, "Select")) {
          SelectTransformer(j, jsx);
        }

        if (matchName(imp.importData, "BekreftCheckboksPanel")) {
          BekreftCheckboksPanelTransformer(j, jsx);
        }

        if (matchName(imp.importData, "Feiloppsummering")) {
          feiloppsummeringTransformer(j, jsx);
        }
      });
    }
  });

  return root.toSource();
}
