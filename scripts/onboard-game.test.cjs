const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const ts = require('typescript');
const {
  addGameDefinition,
  addRegistryEntry,
  getRegistryKeys,
  validatePhaseName,
  validateActionName,
  actionToHandlerName,
  actionToPropName,
} = require('./onboard-game/utils.cjs');

const ROOT = path.resolve(__dirname, '..');
const GAME_NAME = 'sample-game';
const GAME_KEY = 'SAMPLE_GAME';
const metadata = {
  gameName: GAME_NAME,
  gameKey: GAME_KEY,
  gameCode: 'S',
  phases: ['SETUP', 'CARD_PLAY', 'RESULTS', 'GAME_OVER'],
  actions: ['SUBMIT_CARD'],
  playerCounts: { min: 3, max: 6 },
  rounds: { type: 'fixed', count: 5 },
};

/**
 * Loads onboarding against an in-memory filesystem so no application files are modified.
 */
function createFixture() {
  const files = new Map();
  const directories = new Set();
  const answers = [];
  const messages = [];
  const writes = [];
  const absolute = file => path.resolve(file);
  const exists = file => files.has(absolute(file)) || directories.has(absolute(file)) || fs.existsSync(file);
  const read = (file, encoding) => {
    const content = files.has(absolute(file)) ? files.get(absolute(file)) : fs.readFileSync(file);
    return encoding ? content.toString() : Buffer.from(content);
  };
  const write = (file, content, options) => {
    if (options?.flag === 'wx') assert(!exists(file), `Attempted overwrite: ${file}`);
    files.set(absolute(file), content.toString());
    writes.push(absolute(file));
  };
  const mockFs = {
    constants: fs.constants,
    existsSync: exists,
    readFileSync: read,
    writeFileSync: write,
    mkdirSync: file => directories.add(absolute(file)),
    readdirSync: fs.readdirSync,
    copyFileSync: (source, target, flags) => {
      if (flags === fs.constants.COPYFILE_EXCL) assert(!exists(target), `Attempted overwrite: ${target}`);
      write(target, read(source));
    },
  };
  const modules = new Map();
  function load(relative) {
    const filename = path.join(ROOT, relative);
    if (modules.has(filename)) return modules.get(filename);
    const requireFromFile = createRequire(filename);
    const module = { exports: {} };
    const sandbox = {
      module,
      __dirname: path.dirname(filename),
      process: { stdin: {}, stdout: {} },
      console: Object.fromEntries(['log', 'warn', 'error'].map(level => [level, (...args) => messages.push(args.join(' '))])),
      require: name => {
        if (name === 'fs') return mockFs;
        if (name === 'readline') return {
          createInterface: () => ({
            close() {},
            question: (_, callback) => {
              assert(answers.length, 'Unexpected interactive prompt');
              callback(answers.shift());
            },
          }),
        };
        if (name === './onboard-game/index.cjs') return load('scripts/onboard-game/index.cjs');
        return requireFromFile(name);
      },
    };
    vm.runInNewContext(fs.readFileSync(filename, 'utf8'), sandbox, { filename });
    modules.set(filename, module.exports);
    return module.exports;
  }
  return { files, directories, answers, messages, writes, read, load };
}

/**
 * Type-checks generated files and registry updates against actual application contracts.
 */
function checkGeneratedTypes(fixture, backend) {
  const configPath = path.join(ROOT, backend ? 'functions/tsconfig.json' : 'tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  assert(!config.error);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));
  const prefix = path.join(ROOT, backend ? 'functions/src' : 'src') + path.sep;
  const generated = [...fixture.files.keys()].filter(file => file.startsWith(prefix) && /\.tsx?$/.test(file));
  const declarations = parsed.fileNames.filter(file => file.endsWith('.d.ts'));
  const options = { ...parsed.options, noEmit: true, incremental: false };
  const host = ts.createCompilerHost(options);
  const realExists = host.fileExists.bind(host);
  const realRead = host.readFile.bind(host);
  const realDirectoryExists = host.directoryExists.bind(host);
  host.fileExists = file => fixture.files.has(path.resolve(file)) || realExists(file);
  host.readFile = file => fixture.files.get(path.resolve(file)) ?? realRead(file);
  host.directoryExists = directory =>
    [...fixture.files.keys()].some(file => file.startsWith(path.resolve(directory) + path.sep)) ||
    realDirectoryExists(directory);
  host.getSourceFile = (file, target) => {
    const text = host.readFile(file);
    return text === undefined ? undefined : ts.createSourceFile(file, text, target, true);
  };
  const program = ts.createProgram([...generated, ...declarations], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program).filter(diagnostic =>
    !diagnostic.file || generated.includes(path.resolve(diagnostic.file.fileName)));
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: file => file,
    getCurrentDirectory: () => ROOT,
    getNewLine: () => '\n',
  }));
}

/**
 * Verifies generated declarations and type members have meaningful multiline JSDoc and accurate function tags.
 */
function checkGeneratedDocumentation(file, content) {
  const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  assert.equal(source.parseDiagnostics.length, 0, file);
  function documentation(node) {
    const docs = node.jsDoc ?? [];
    assert.equal(docs.length, 1, `${file}: expected one JSDoc block for ${node.getText(source)}`);
    const doc = docs[0];
    assert.equal(typeof doc.comment, 'string', `${file}: missing description`);
    assert(doc.comment.trim() && !doc.comment.includes('TODO'), `${file}: placeholder description`);
    assert(doc.getText(source).startsWith('/**\n'), `${file}: expected multiline JSDoc`);
    for (const tag of doc.tags ?? []) {
      assert.equal(typeof tag.comment, 'string', `${file}: missing ${tag.tagName.text} description`);
      assert(tag.comment.trim(), `${file}: empty ${tag.tagName.text} description`);
      assert(!tag.typeExpression, `${file}: redundant JSDoc type annotation`);
    }
    return doc;
  }
  function visit(node) {
    if (
      ts.isVariableStatement(node) && node.parent === source ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isPropertySignature(node) ||
      ts.isIndexSignatureDeclaration(node) ||
      ts.isPropertyAssignment(node) && path.basename(file) === 'constants.ts'
    ) {
      const doc = documentation(node);
      if (ts.isVariableStatement(node)) {
        for (const declaration of node.declarationList.declarations) {
          if (!declaration.initializer || !ts.isArrowFunction(declaration.initializer)) continue;
          const parameters = declaration.initializer.parameters.map(parameter => parameter.name.getText(source));
          const tags = doc.tags ?? [];
          const documentedParameters = tags.filter(ts.isJSDocParameterTag).map(tag => tag.name.getText(source));
          assert.deepEqual(documentedParameters, parameters, `${file}: incorrect parameter documentation`);
          assert(tags.some(ts.isJSDocReturnTag), `${file}: missing return description`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

test('constant names require nonempty alphabetic segments and valid generated action parameters', () => {
  for (const invalid of ['', '_', '___', '_CARD', 'CARD_', 'CARD__PLAY', 'CARD1', 'CARD-PLAY']) {
    assert.equal(validatePhaseName(invalid), false, invalid);
    assert.equal(validateActionName(invalid), false, invalid);
  }
  for (const invalid of ['SUBMIT_', 'CLASS', 'SUBMIT_CLASS', 'SUBMIT_AWAIT', 'SUBMIT_EVAL', 'SUBMIT_ARGUMENTS', 'SUBMIT_ACTION']) {
    assert.equal(validateActionName(invalid), false, invalid);
  }
  for (const valid of ['CARD', 'CARD_PLAY', 'SUBMIT_CARD', 'SUBMIT_TYPE', 'CLASS_NAME']) {
    assert.equal(validatePhaseName(valid), true, valid);
    assert.equal(validateActionName(valid), true, valid);
  }
});

test('phase prompts retry invalid, reserved, duplicate, and empty comma-only lists', async () => {
  for (const invalid of [
    ',, ,', '_', 'CARD_', '_CARD', 'CARD__PLAY', 'CARD1', 'CARD-PLAY',
    'LOBBY', 'RULES', 'SETUP', 'GAME_OVER', 'SETUP,CARD_PLAY', 'CARD_PLAY,GAME_OVER',
    'card_play,CARD_PLAY',
  ]) {
    const fixture = createFixture();
    const inputs = [invalid, 'card play, voting'];
    const phases = await fixture.load('scripts/onboard-game/prompts.cjs').promptForPhases(async () => {
      assert(inputs.length, 'Unexpected phase prompt');
      return inputs.shift();
    });
    assert.deepEqual([...phases], ['SETUP', 'CARD_PLAY', 'VOTING', 'GAME_OVER'], invalid);
    assert.equal(inputs.length, 0);
    assert(fixture.messages.some(message => message.includes('❌')), invalid);
  }
  for (const input of ['', '   ']) {
    const fixture = createFixture();
    const phases = await fixture.load('scripts/onboard-game/prompts.cjs').promptForPhases(async () => input);
    assert.deepEqual([...phases], ['SETUP', 'CARD_PLAY', 'GAME_OVER']);
  }
});

test('action prompts retry invalid lists and colliding generated handler or payload names', async () => {
  for (const invalid of [
    '', '   ', ',, ,', '_', 'SUBMIT_', 'SUBMIT__CARD', 'SUBMIT_CLASS', 'SUBMIT_AWAIT', 'SUBMIT_EVAL',
    'SUBMIT_ARGUMENTS', 'SUBMIT_ACTION', 'submit_card,SUBMIT_CARD', 'CARD,SUBMIT_CARD', 'SUBMIT_FOO_BAR,SUBMIT_FOOBAR',
  ]) {
    const fixture = createFixture();
    const inputs = [invalid, 'submit card, submit votes'];
    const actions = await fixture.load('scripts/onboard-game/prompts.cjs').promptForActions(async () => {
      assert(inputs.length, 'Unexpected action prompt');
      return inputs.shift();
    });
    assert.deepEqual([...actions], ['SUBMIT_CARD', 'SUBMIT_VOTES'], invalid);
    assert.equal(inputs.length, 0);
    assert(fixture.messages.some(message => message.includes('❌')), invalid);
  }
  const fixture = createFixture();
  const inputs = ['CARD_PLAY, CARD_PLAYER, SUBMIT_TYPE'];
  const actions = await fixture.load('scripts/onboard-game/prompts.cjs').promptForActions(async () => {
    assert(inputs.length, 'Unexpected action prompt');
    return inputs.shift();
  });
  assert.equal(new Set(actions.map(actionToHandlerName)).size, actions.length);
  assert.equal(new Set(actions.map(actionToPropName)).size, actions.length);
});

test('backend registry supports private, exported, and asserted GAMES arrays', () => {
  for (const prefix of ['', 'export ']) {
    const content = `${prefix}const GAMES = [
  { name: 'alpha', code: 'A', key: 'ALPHA', extra: true },
  // Keep this game comment.
  { name: 'zulu', code: 'Z', key: 'ZULU' },
] as const;
export const unrelated = true;`;
    const result = addGameDefinition(content, GAME_NAME, 'S');
    assert(result.startsWith(`${prefix}const GAMES`));
    assert(result.includes('extra: true'));
    assert(result.includes('// Keep this game comment.'));
    assert(result.indexOf("name: 'alpha'") < result.indexOf("name: 'sample-game'"));
    assert(result.indexOf("name: 'sample-game'") < result.indexOf("name: 'zulu'"));
    assert(result.endsWith('export const unrelated = true;'));
    assert.equal(ts.createSourceFile('games.ts', result, ts.ScriptTarget.Latest, true).parseDiagnostics.length, 0);
    assert.throws(() => addGameDefinition(result, GAME_NAME, 'S'), /already exists/);
  }
});

test('registry insertion supports empty and non-trailing-comma objects and is idempotent', () => {
  for (const content of [
    'const registry = {};',
    'const registry = { z: 1 };',
    'const registry = { a: 1 };',
    'const registry = { a: 1, };',
  ]) {
    const updated = addRegistryEntry(content, 'registry', 'middle', 'middle: 2');
    assert.equal(ts.createSourceFile('registry.ts', updated, ts.ScriptTarget.Latest, true).parseDiagnostics.length, 0);
    assert(getRegistryKeys(updated, 'registry').includes('middle'));
    assert.equal(addRegistryEntry(updated, 'registry', 'middle', 'middle: 3'), updated);
  }
  assert.throws(() => addRegistryEntry('const other = {};', 'registry', 'a', 'a: 1'), /Could not find registry/);
});

for (const rounds of [null, { type: 'fixed', count: 5 }, { type: 'max', count: 8 }]) {
  test(`backend scaffolds compile with ${rounds?.type ?? 'no'} rounds`, async () => {
    const fixture = createFixture();
    const backend = fixture.load('scripts/onboard-game/index.cjs');
    assert(await backend.updateGamesConstant(GAME_NAME, 'S'));
    await backend.createGameFolder(GAME_NAME, {
      ...metadata,
      rounds,
      actions: ['SUBMIT_CARD', 'SUBMIT_VOTES', 'SUBMIT_TYPE'],
    });
    const generated = [...fixture.files.keys()].filter(file => file.includes(`/games/${GAME_NAME}/`));
    assert.equal(generated.length, 8);
    assert(generated.every(file => file.includes('/functions/src/games/')));
    assert(!generated.some(file => file.includes('/functions/src/engine/')));
    const source = generated.map(file => fixture.read(file, 'utf8')).join('\n');
    assert(!source.includes('utils.firestore'));
    assert(!source.includes("from '../../utils'"));
    for (const file of generated) checkGeneratedDocumentation(file, fixture.read(file, 'utf8'));
    checkGeneratedTypes(fixture, true);
  });
}

test('onboarding registers current backend engines and transforms nested frontend templates', async () => {
  const fixture = createFixture();
  const backend = fixture.load('scripts/onboard-game/index.cjs');
  await backend.updateGamesConstant(GAME_NAME, 'S');
  await backend.createGameFolder(GAME_NAME, metadata);
  const cli = fixture.load('scripts/onboard-game.cjs');
  fixture.answers.push(GAME_NAME);
  await cli.runBackendEngineHookup();
  assert(fixture.read(path.join(ROOT, 'functions/src/games/delegators.ts'), 'utf8').includes(
    `[GAME_NAMES.${GAME_KEY}]: () => import('./${GAME_NAME}')`));
  checkGeneratedTypes(fixture, true);
  fixture.answers.push(GAME_NAME, 'Jogo de exemplo', 'Sample game', '');
  await cli.runFrontendGameInfo();
  const folder = path.join(ROOT, 'src/games', GAME_NAME);
  const info = JSON.parse(fixture.read(path.join(folder, 'game-info.json'), 'utf8'));
  assert.equal(info.gameCode, 'S');
  assert.equal(info.playerCount.min, 3);
  assert.equal(info.playerCount.max, 6);
  assert(fixture.read(path.join(ROOT, 'src/utils/info.ts'), 'utf8').includes(
    `'sample-game': () => import('@games/sample-game/game-info.json')`));
  fixture.answers.push(GAME_NAME);
  await cli.runFrontendSetup();
  assert(fixture.read(path.join(ROOT, 'src/games/gameLoader.ts'), 'utf8').includes(
    "[GAME_COLLECTION.SAMPLE_GAME]: lazy(() => import('@games/sample-game/SessionSampleGame'))"));
  assert(fixture.read(path.join(folder, 'utils/api-requests.ts'), 'utf8').includes('SAMPLE_GAME_ACTIONS.SUBMIT_CARD'));
  assert(fixture.read(path.join(folder, 'PhaseTemplate.tsx'), 'utf8').includes('SAMPLE_GAME_PHASES.SETUP'));
  const session = fixture.read(path.join(folder, 'SessionSampleGame.tsx'), 'utf8');
  for (const phase of metadata.phases) assert(session.includes(`SAMPLE_GAME_PHASES.${phase}`));
  assert(!session.includes('SessionTemplate'));
  checkGeneratedTypes(fixture, false);

  const apiPath = path.join(folder, 'utils/api-requests.ts');
  fixture.files.set(apiPath, '// Existing implementation must survive reruns.\n' + fixture.read(apiPath, 'utf8'));
  const before = new Map(fixture.files);
  const writesBefore = fixture.writes.length;
  fixture.answers.push(GAME_NAME, GAME_NAME);
  await cli.runFrontendSetup();
  await cli.runBackendEngineHookup();
  assert.deepEqual(fixture.files, before);
  assert.equal(fixture.writes.length, writesBefore);
});

test('frontend-only scaffolds use renamed fallback constants and preserve existing metadata', async () => {
  const fixture = createFixture();
  const folder = path.join(ROOT, 'src/games', GAME_NAME);
  fixture.directories.add(folder);
  const infoPath = path.join(folder, 'game-info.json');
  fixture.files.set(infoPath, fs.readFileSync(path.join(ROOT, 'src/games/_template/game-info.json'), 'utf8'));
  const originalInfo = fixture.files.get(infoPath);
  const cli = fixture.load('scripts/onboard-game.cjs');
  fixture.answers.push(GAME_NAME);
  await cli.runFrontendSetup();
  const constants = fixture.read(path.join(folder, 'utils/constants.ts'), 'utf8');
  assert(getRegistryKeys(constants, 'SAMPLE_GAME_PHASES').includes('GAME_OVER'));
  assert(getRegistryKeys(constants, 'SAMPLE_GAME_PHASES').includes('UNKNOWN'));
  assert(getRegistryKeys(constants, 'SAMPLE_GAME_ACTIONS').includes('UNKNOWN'));
  assert.equal(fixture.files.get(infoPath), originalInfo);
  checkGeneratedTypes(fixture, false);
});

test('existing client constants take precedence over backend constants', async () => {
  const fixture = createFixture();
  const folder = path.join(ROOT, 'src/games', GAME_NAME);
  fixture.directories.add(folder);
  const constantsPath = path.join(folder, 'utils/constants.ts');
  const constants = "export const SAMPLE_GAME_PHASES = { CUSTOM: 'CUSTOM', GAME_OVER: 'GAME_OVER' } as const;\n" +
    "export const SAMPLE_GAME_ACTIONS = { CUSTOM_ACTION: 'CUSTOM_ACTION' } as const;\n";
  fixture.files.set(constantsPath, constants);
  const backend = fixture.load('scripts/onboard-game/index.cjs');
  await backend.updateGamesConstant(GAME_NAME, 'S');
  await backend.createGameFolder(GAME_NAME, metadata);
  const cli = fixture.load('scripts/onboard-game.cjs');
  fixture.answers.push(GAME_NAME);
  await cli.runFrontendSetup();
  assert.equal(fixture.files.get(constantsPath), constants);
  assert(fixture.read(path.join(folder, 'PhaseTemplate.tsx'), 'utf8').includes('SAMPLE_GAME_PHASES.CUSTOM'));
  assert(fixture.read(path.join(folder, 'utils/api-requests.ts'), 'utf8').includes('SAMPLE_GAME_ACTIONS.CUSTOM_ACTION'));
});

test('missing loader registry fails explicitly without reporting successful setup', async () => {
  const fixture = createFixture();
  fixture.directories.add(path.join(ROOT, 'src/games', GAME_NAME));
  fixture.files.set(path.join(ROOT, 'src/games/gameLoader.ts'), 'const otherRegistry = {};');
  const cli = fixture.load('scripts/onboard-game.cjs');
  fixture.answers.push(GAME_NAME);
  await assert.rejects(cli.runFrontendSetup(), /Could not find gameSessions collection/);
  assert(!fixture.messages.some(message => message.includes('Frontend setup complete')));
});

test('invalid existing constants fail before creating any scaffold files', async () => {
  const fixture = createFixture();
  const folder = path.join(ROOT, 'src/games', GAME_NAME);
  fixture.directories.add(folder);
  fixture.files.set(path.join(folder, 'utils/constants.ts'),
    "export const SAMPLE_GAME_PHASES = { CUSTOM: 'CUSTOM' };\n" +
    "export const SAMPLE_GAME_ACTIONS = { CUSTOM_ACTION: 'CUSTOM_ACTION' };\n");
  const before = new Map(fixture.files);
  const cli = fixture.load('scripts/onboard-game.cjs');
  fixture.answers.push(GAME_NAME);
  await assert.rejects(cli.runFrontendSetup(), /must define a playable phase, GAME_OVER, and a player action/);
  assert.deepEqual(fixture.files, before);
  assert.equal(fixture.writes.length, 0);
});
