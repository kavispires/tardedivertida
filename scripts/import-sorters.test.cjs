const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const ts = require('typescript');
const { combineDuplicateImports } = require('./import-utils.cjs');

const ROOT = path.resolve(__dirname, '..');
const SORTERS = ['sort-imports.cjs', 'sort-functions-imports.cjs'];
const FIXTURES = [
  {
    name: 'type imports followed by runtime imports',
    imports: ["import type { GameState } from './game';", "import { createGame } from './game';"],
  },
  {
    name: 'runtime imports followed by type imports',
    imports: ["import { createGame } from './game';", "import type { GameState } from './game';"],
  },
  {
    name: 'default and named runtime imports',
    imports: ["import React from 'react';", "import { useState } from 'react';"],
  },
  {
    name: 'default and named type imports',
    imports: ["import type DefaultModel from './models';", "import type { ModelOptions } from './models';"],
  },
  {
    name: 'multiple default-type aliases',
    imports: ["import type First from './models';", "import type Second from './models';"],
  },
  {
    name: 'namespace imports and their aliases',
    imports: ["import * as Models from './models';", "import * as OtherModels from './models';", "import { create } from './models';"],
  },
  {
    name: 'type-only namespace imports',
    imports: ["import type * as Models from './models';", "import type { Model } from './models';"],
  },
  {
    name: 'mixed default and named declarations',
    imports: ["import Client, { create as make } from './client';", "import { connect } from './client';"],
  },
  {
    name: 'inline type modifiers and named aliases',
    imports: ["import { type Model as DomainModel, create as make } from './models';", "import { update as change } from './models';"],
  },
  {
    name: 'quoted import names containing commas',
    imports: ['import { "first,second" as combined } from "./names";', "import { other } from './names';"],
  },
  {
    name: 'matching import attributes',
    imports: ["import { first } from './data' with { type: 'json' };", "import { second } from './data' with { type: 'json' };"],
  },
  {
    name: 'different import attributes',
    imports: ["import { first } from './data' with { mode: 'first' };", "import { second } from './data' with { mode: 'second' };"],
  },
  {
    name: 'side-effect and empty imports',
    imports: ["import './setup';", "import {} from './models';", "import { type Model } from './models';", "import { create } from './models';"],
  },
  {
    name: 'comments attached to named bindings',
    imports: ["import { /* Keep this annotation. */ First } from './models';", "import { Second } from './models';"],
  },
];

/**
 * Captures semantic import bindings independently of declaration formatting or grouping.
 */
function importBindings(content) {
  const source = ts.createSourceFile('fixture.ts', content, ts.ScriptTarget.Latest, true);
  assert.equal(source.parseDiagnostics.length, 0, content);
  const bindings = [];
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const module = statement.moduleSpecifier.text;
    const attributes = statement.attributes?.getText(source) ?? '';
    const clause = statement.importClause;
    const add = (kind, imported, local, typeOnly) =>
      bindings.push(JSON.stringify({ module, attributes, kind, imported, local, typeOnly }));
    if (!clause) {
      add('side-effect');
      continue;
    }
    if (clause.name) add('default', 'default', clause.name.text, clause.isTypeOnly);
    const named = clause.namedBindings;
    if (named && ts.isNamespaceImport(named)) add('namespace', '*', named.name.text, clause.isTypeOnly);
    if (named && ts.isNamedImports(named)) {
      if (named.elements.length === 0) add('empty', undefined, undefined, clause.isTypeOnly);
      for (const element of named.elements) {
        add('named', (element.propertyName ?? element.name).text, element.name.text,
          clause.isTypeOnly || element.isTypeOnly);
      }
    }
  }
  return [...new Set(bindings)].sort();
}

/**
 * Runs either sorter through its actual command entry point, using in-memory file reads and writes.
 */
function sortFixture(sorter, content) {
  const filename = path.join(ROOT, 'scripts', sorter);
  const fixture = path.join(ROOT, 'functions/src/games/sort-fixture/index.ts');
  let output = content;
  const module = { exports: {} };
  const requireFromFile = createRequire(filename);
  const mockRequire = name => name === 'fs' ? {
    readFileSync: file => {
      assert.equal(file, fixture);
      return output;
    },
    writeFileSync: (file, value) => {
      assert.equal(file, fixture);
      output = value;
    },
  } : requireFromFile(name);
  mockRequire.main = module;
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    module,
    require: mockRequire,
    process: { argv: ['node', filename, fixture] },
  }, { filename });
  return output;
}

for (const fixture of FIXTURES) {
  test(`merging preserves ${fixture.name}`, () => {
    const output = combineDuplicateImports(fixture.imports);
    assert.deepEqual(importBindings(output.join('\n')), importBindings(fixture.imports.join('\n')));
    assert.deepEqual(combineDuplicateImports(output), output);
  });
  for (const sorter of SORTERS) {
    test(`${sorter} preserves ${fixture.name}`, () => {
      const content = fixture.imports.join('\n') + '\n\nexport const sentinel = 1;\n';
      const output = sortFixture(sorter, content);
      assert.deepEqual(importBindings(output), importBindings(content));
      assert(output.endsWith('export const sentinel = 1;\n'));
      const emit = source => ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext, verbatimModuleSyntax: true },
      }).outputText;
      assert.deepEqual(importBindings(emit(output)), importBindings(emit(content)));
      assert.equal(sortFixture(sorter, output), output);
    });
  }
}

test('compatible named imports are still merged and deduplicated without losing aliases', () => {
  assert.deepEqual(combineDuplicateImports([
    "import { first as one } from './models';",
    "import { second, first as one } from './models';",
    "import { first as another } from './models';",
  ]), ["import { first as one, second, first as another } from './models';"]);
  assert.deepEqual(combineDuplicateImports([
    "import type { First } from './models';",
    "import type { Second } from './models';",
  ]), ["import type { First, Second } from './models';"]);
});

test('imports with comments are retained instead of losing comments during merging', () => {
  const imports = [
    "import { /* Keep this binding annotation. */ First } from './models';",
    "import { Second } from './models';",
  ];
  assert.deepEqual(combineDuplicateImports(imports), imports);
});

test('malformed or accidentally concatenated code fails before it can be rewritten as an import', () => {
  assert.throws(() => combineDuplicateImports(["import { Missing from './models';"]), /Cannot safely parse/);
  assert.throws(() => combineDuplicateImports(["import { First } from './models';\nexport const value = 1;"]), /Cannot safely parse/);
});
