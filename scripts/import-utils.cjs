const ts = require('typescript');

/**
 * Combines compatible named imports without changing default, namespace, or type/value bindings.
 * @param {string[]} importLines - Complete import declarations
 * @returns {string[]} Imports with compatible named bindings deduplicated
 */
function combineDuplicateImports(importLines) {
  const result = [];
  const groups = new Map();
  for (const line of importLines) {
    const source = ts.createSourceFile('imports.ts', line, ts.ScriptTarget.Latest, true);
    if (source.parseDiagnostics.length > 0 || source.statements.length !== 1) {
      throw new Error(`Cannot safely parse import declaration: ${line}`);
    }
    const declaration = source.statements[0];
    if (!ts.isImportDeclaration(declaration) && !ts.isImportEqualsDeclaration(declaration)) {
      throw new Error(`Expected an import declaration: ${line}`);
    }
    const clause = ts.isImportDeclaration(declaration) ? declaration.importClause : undefined;
    const bindings = clause?.namedBindings;
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, line);
    let hasComments = false;
    for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
      if (token === ts.SyntaxKind.SingleLineCommentTrivia || token === ts.SyntaxKind.MultiLineCommentTrivia) {
        hasComments = true;
        break;
      }
    }
    if (!clause || clause.name || !bindings || !ts.isNamedImports(bindings) ||
      bindings.elements.length === 0 || hasComments) {
      result.push(line);
      continue;
    }

    const attributes = declaration.attributes?.getText(source) ?? '';
    const key = JSON.stringify([declaration.moduleSpecifier.text, clause.isTypeOnly, attributes]);
    let group = groups.get(key);
    const isNewGroup = !group;
    if (!group) {
      group = {
        index: result.length,
        module: declaration.moduleSpecifier.getText(source),
        isTypeOnly: clause.isTypeOnly,
        attributes,
        bindings: new Map(),
      };
      groups.set(key, group);
      result.push(line);
    }
    for (const binding of bindings.elements) {
      const bindingKey = JSON.stringify([
        binding.isTypeOnly,
        (binding.propertyName ?? binding.name).text,
        binding.name.text,
      ]);
      if (!group.bindings.has(bindingKey)) group.bindings.set(bindingKey, binding.getText(source));
    }
    if (!isNewGroup) {
      result[group.index] = `import ${group.isTypeOnly ? 'type ' : ''}{ ${[...group.bindings.values()].join(', ')} } from ${group.module}${attributes ? ` ${attributes}` : ''};`;
    }
  }
  return result;
}

module.exports = { combineDuplicateImports };
