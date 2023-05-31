import { JSCodeshift, ASTNode, Collection } from "jscodeshift";
import * as Kinds from "ast-types/gen/kinds";
import { builders, namedTypes } from "ast-types";
import { isInList } from "./otherUtils";
import {
  importdeclarationKinds,
  importDefaultSpecifierKinds,
  ImportKinds,
  importNamespaceSpecifierKinds,
  importSpecifierKinds,
} from "./typeKinds";

export type ImportData =
  | DefaultImportData
  | SpecifierImportData
  | NamespaceImportData;

type DefaultImportData = {
  type: "ImportDefaultSpecifier";
  sourceName: string;
  localName: string;
  importedName: "default";
};
type SpecifierImportData = {
  type: "ImportSpecifier";
  sourceName: string;
  localName: string;
  importedName: string;
};
type NamespaceImportData = {
  type: "ImportNamespaceSpecifier";
  sourceName: string;
  localName: string;
  importedName: "*";
};

export type ImportDataElementBundle = {
  importData: ImportData;
  jsxElements: Collection<Kinds.JSXElementKind>;
};

export type ImportedElements =
  | {
      type: "JSXComponent";
      importData: ImportData;
      jsxElements: Collection<namedTypes.JSXElement>;
    }
  | {
      type: "TSType";
      importData: ImportData;
      tsTypes: Collection<namedTypes.TSTypeReference>;
    }
  | {
      type: "UnusedImport";
      importData: ImportData;
    };

type SpecifierShorthand = { imported: string; local: string } | string;
type SpecifierData =
  | DefaultSpecifierData
  | NamespaceSpecifierData
  | ImportSpecifierData;

type DefaultSpecifierData = {
  type: "ImportDefaultSpecifier";
  importedName: "default";
  localName: string;
};

type NamespaceSpecifierData = {
  type: "ImportNamespaceSpecifier";
  importedName: "*";
  localName: string;
};

type ImportSpecifierData = {
  type: "ImportSpecifier";
  importedName: string;
  localName?: string;
};

export function getImportSpecifier(
  j: JSCodeshift,
  source: Collection<any>,
  specifier: string,
  sourcePath: string
) {
  return source
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === sourcePath)
    .find(j.ImportSpecifier)
    .filter((path) => path.value.imported.name === specifier);
}

export function renameImportSpecifier(
  j: JSCodeshift,
  source: Collection<any>,
  specifier: string,
  newSpecifier: string,
  sourcePath: string
) {
  getImportSpecifier(j, source, specifier, sourcePath).replaceWith(
    j.importSpecifier(j.identifier(newSpecifier))
  );
}

export function getImportSpecifierName(
  j: JSCodeshift,
  source: Collection<any>,
  specifier: string,
  sourcePath: string
) {
  const specifiers = getImportSpecifier(j, source, specifier, sourcePath);

  return specifiers.length > 0 ? specifiers.nodes()[0]!.local!.name : null;
}

export function isImportDeclaration(
  value: unknown
): value is namedTypes.ImportDeclaration {
  return isInList(value, importdeclarationKinds);
}

export function isImportSpecification(value: unknown): value is ImportKinds {
  return (
    isImportDefaultSpecifierKinds(value) ||
    isImportSpecifierKinds(value) ||
    isImportNamespaceSpecifierKinds(value)
  );
}
export function isImportDefaultSpecifierKinds(
  value: unknown
): value is Kinds.ImportDefaultSpecifierKind {
  return isInList(value, importDefaultSpecifierKinds);
}

export function isImportSpecifierKinds(
  value: unknown
): value is Kinds.ImportSpecifierKind {
  return isInList(value, importSpecifierKinds);
}

export function isImportNamespaceSpecifierKinds(
  value: unknown
): value is Kinds.ImportNamespaceSpecifierKind {
  return isInList(value, importNamespaceSpecifierKinds);
}

export function getImportData(path: Collection<ASTNode>): ImportData[] {
  function collect(declaration: namedTypes.ImportDeclaration): ImportData[] {
    return declaration.specifiers.map((importSpecifier) => {
      if (isImportSpecifierKinds(importSpecifier)) {
        return {
          type: "ImportSpecifier",
          sourceName: String(declaration.source.value),
          localName: importSpecifier.local.name,
          importedName: importSpecifier.imported.name,
        };
      }
      if (isImportDefaultSpecifierKinds(importSpecifier)) {
        return {
          type: "ImportDefaultSpecifier",
          sourceName: String(declaration.source.value),
          localName: importSpecifier.local.name,
          importedName: "default",
        };
      }
      if (isImportNamespaceSpecifierKinds(importSpecifier)) {
        return {
          type: "ImportNamespaceSpecifier",
          sourceName: String(declaration.source.value),
          localName: importSpecifier.local.name,
          importedName: "*",
        };
      }
      return undefined;
    });
  }
  return path.nodes().filter(isImportDeclaration).flatMap(collect);
}

export function findImports(root: Collection, sourceName: string) {
  return root.find(
    namedTypes.ImportDeclaration,
    sourceName && { source: { value: sourceName } }
  );
}

export function addImports(
  rootPath: Collection,
  names: SpecifierShorthand[],
  source: string
) {
  const specifierData = names.map(shorthandToSpecifierData);
  setImports(rootPath, specifierData, source);
}

function setImports(
  rootPath: Collection,
  imports: SpecifierData[],
  source: string
) {
  const existingDeclatationPath = findImports(rootPath, source);

  const existingSpecifiers = existingDeclatationPath
    .nodes()
    .flatMap((declaration) => declaration.specifiers);

  const newSpecifiers = imports.map(buildImportSpecifier);

  const combinedSpecifiers = combineSpecifiers(
    existingSpecifiers,
    newSpecifiers
  );

  const newDeclaration = buildImportDeclaration(combinedSpecifiers, source);

  setDeclaration(rootPath, existingDeclatationPath, newDeclaration);
}

export function removeImports(
  rootPath: Collection,
  names: SpecifierShorthand[],
  source: string
) {
  const specifierData = names.map(shorthandToSpecifierData);
  deleteImports(rootPath, specifierData, source);
}
export function deleteImports(
  rootPath: Collection,
  imports: SpecifierData[],
  source: string
) {
  const existingDeclarationPath = findImports(rootPath, source);

  if (existingDeclarationPath.size() === 0) {
    return;
  }
  if (existingDeclarationPath.size() > 1) {
    throw Error(
      "removeImports does not allow multiple import declarations from same source"
    );
  }

  const existingSpecifiers = existingDeclarationPath
    .nodes()
    .flatMap((declaration) => declaration.specifiers);

  const filteredSpecifiers = existingSpecifiers.filter(
    specifierFilterBuilder(imports)
  );

  if (filteredSpecifiers.length === 0) {
    existingDeclarationPath.remove();
  } else {
    replaceImport(
      existingDeclarationPath,
      buildImportDeclaration(filteredSpecifiers, source)
    );
  }
}

function shorthandToSpecifierData(name: SpecifierShorthand): SpecifierData {
  const importedName = typeof name === "string" ? name : name.imported;
  const localName = typeof name === "string" ? name : name.local;

  switch (importedName) {
    case "*":
      return {
        type: "ImportNamespaceSpecifier",
        importedName: "*",
        localName: localName,
      };
    case "default":
      return {
        type: "ImportDefaultSpecifier",
        importedName: "default",
        localName: localName,
      };
    default:
      return {
        type: "ImportSpecifier",
        importedName: importedName,
        localName: localName,
      };
  }
}

function specifierFilterBuilder(filterList: SpecifierData[]) {
  return function (specifier: ImportKinds) {
    return !filterList.some((importFilter) => {
      switch (importFilter.type) {
        case "ImportSpecifier": {
          return (
            specifier.type === "ImportSpecifier" &&
            specifier.imported.name === importFilter.importedName
          );
        }
        case "ImportDefaultSpecifier": {
          return (
            specifier.type === "ImportDefaultSpecifier" ||
            (specifier.type === "ImportSpecifier" &&
              specifier.imported.name === "default")
          );
        }
        case "ImportNamespaceSpecifier": {
          return specifier.type === "ImportNamespaceSpecifier";
        }
      }
    });
  };
}

function setDeclaration(
  rootPath: Collection,
  importDeclatationPath: Collection,
  importDecleration: Kinds.ImportDeclarationKind
) {
  switch (importDeclatationPath.size()) {
    case 0: {
      appendImport(rootPath, importDecleration);
      break;
    }
    case 1: {
      replaceImport(importDeclatationPath, importDecleration);
      break;
    }
    default: {
      throw Error(
        "setDeclaration does not allow multiple import declarations from same source"
      );
    }
  }
}

function appendImport(
  path: Collection,
  importDeclaration: Kinds.ImportDeclarationKind
) {
  const importDeclarationPaths = path.find(namedTypes.ImportDeclaration);
  if (importDeclarationPaths.size() > 0) {
    const lastImport = importDeclarationPaths.at(
      importDeclarationPaths.size() - 1
    );
    lastImport.insertAfter([importDeclaration]);
  } else {
    const rootElement = path.find(namedTypes.Program);
    rootElement.nodes()[0].body = [
      importDeclaration,
      ...rootElement.nodes()[0].body,
    ];
  }
}

function replaceImport(
  path: Collection,
  importDeclaration: Kinds.ImportDeclarationKind
) {
  const importPath = path.at(path.size() - 1);
  importPath.replaceWith([importDeclaration]);
}
function getSpeciferName(specifier: ImportKinds) {
  switch (specifier.type) {
    case "ImportSpecifier":
      return specifier.imported.name;
    case "ImportDefaultSpecifier":
      return specifier.local.name;
    case "ImportNamespaceSpecifier":
      return specifier.local.name;
  }
}

function combineSpecifiers(
  existingSpecifiers: ImportKinds[],
  newSpecifiers: ImportKinds[]
) {
  const existingImports = new Set<string>();
  existingSpecifiers.forEach((specifier) => {
    existingImports.add(getSpeciferName(specifier));
  });
  const newWithoutDuplicated = newSpecifiers.filter(
    (specifier) => !existingImports.has(getSpeciferName(specifier))
  );

  const combinedSpecifiers = [...existingSpecifiers, ...newWithoutDuplicated];

  if (
    combinedSpecifiers.some(isImportNamespaceSpecifierKinds) &&
    combinedSpecifiers.some(isImportSpecifierKinds)
  ) {
    throw Error(
      "Import declaration can't have both named and namespaced imports."
    );
  }

  return combinedSpecifiers;
}

function buildImportDeclaration(specifiers: ImportKinds[], sourceName: string) {
  return builders.importDeclaration(
    specifiers,
    builders.stringLiteral(sourceName)
  );
}

function buildImportSpecifier(specifierData: SpecifierData): ImportKinds {
  switch (specifierData.type) {
    case "ImportSpecifier":
      return createImportSpecifier(
        specifierData.importedName,
        specifierData.localName
      );
    case "ImportDefaultSpecifier":
      return createImportDefaultSpecifier(specifierData.localName);
    case "ImportNamespaceSpecifier":
      return createImportNamespaceSpecifier(specifierData.localName);
  }
}

function createImportDefaultSpecifier(name: string) {
  return builders.importDefaultSpecifier(builders.jsxIdentifier(name));
}
function createImportSpecifier(importedName: string, localName: string) {
  return builders.importSpecifier(
    builders.jsxIdentifier(importedName),
    builders.jsxIdentifier(localName)
  );
}
function createImportNamespaceSpecifier(name: string) {
  return builders.importNamespaceSpecifier(builders.jsxIdentifier(name));
}
