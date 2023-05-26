import core, { ASTNode, Collection } from "jscodeshift";
import { namedTypes } from "ast-types";

export function getImportSpecifier(
  j: core.JSCodeshift,
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
  j: core.JSCodeshift,
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
  j: core.JSCodeshift,
  source: Collection<any>,
  specifier: string,
  sourcePath: string
) {
  const specifiers = getImportSpecifier(j, source, specifier, sourcePath);

  return specifiers.length > 0 ? specifiers.nodes()[0]!.local!.name : null;
}

function isImportDeclaration(
  node: namedTypes.Node
): node is namedTypes.ImportDeclaration {
  return node.type === "ImportDeclaration";
}

function isImportDefaultSpecifier(
  node: namedTypes.ModuleSpecifier
): node is namedTypes.ImportDefaultSpecifier {
  return node.type === "ImportDefaultSpecifier";
}

function isImportSpecifier(
  node: namedTypes.ModuleSpecifier
): node is namedTypes.ImportSpecifier {
  return node.type === "ImportSpecifier";
}

function isImportNamespaceSpecifier(
  node: namedTypes.ModuleSpecifier
): node is namedTypes.ImportNamespaceSpecifier {
  return node.type === "ImportNamespaceSpecifier";
}

export type Imports =
  | {
      type: "ImportDefaultSpecifier";
      sourceName: string;
      localName: string;
      importedName: string | undefined;
    }
  | {
      type: "ImportSpecifier";
      sourceName: string;
      localName: string;
      importedName: string;
    }
  | {
      type: "ImportNamespaceSpecifier";
      sourceName: string;
      localName: string;
      importedName: string | undefined;
    };

export type ImportedElements =
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

export function getImportNames(path: Collection<ASTNode>): Imports[] {
  function collect(declaration: namedTypes.ImportDeclaration): Imports[] {
    return declaration.specifiers.map((importSpecifier) => {
      if (isImportDefaultSpecifier(importSpecifier)) {
        return {
          type: "ImportDefaultSpecifier",
          // typedefinisjonen tillater string | RegExp | boolean | number men har aldri sett det være noe annet enn string.
          sourceName: `${declaration.source.value}`,
          localName: importSpecifier.local.name,
          importedName: undefined,
        };
      }
      if (isImportSpecifier(importSpecifier)) {
        return {
          type: "ImportSpecifier",
          sourceName: `${declaration.source.value}`,
          localName: importSpecifier.local.name,
          importedName: importSpecifier.imported.name,
        };
      }
      if (isImportNamespaceSpecifier(importSpecifier)) {
        return {
          type: "ImportNamespaceSpecifier",
          sourceName: `${declaration.source.value}`,
          localName: importSpecifier.local.name,
          importedName: undefined,
        };
      }
      return undefined;
    });
  }
  return path.nodes().filter(isImportDeclaration).flatMap(collect);
}

export function findImport(path: Collection<ASTNode>, moduleName: string) {
  return path
    .find(core.ImportDeclaration)
    .filter((declaration) => declaration.node.source.value === moduleName);
}
