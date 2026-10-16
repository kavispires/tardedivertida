const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { execFileSync } = require('node:child_process');
const { test } = require('node:test');
const { getImportViolations } = require('./check-icon-imports.cjs');
const { analyzeStagedFiles } = require('./commit-assist.cjs');
const { parseStatusPaths } = require('./stage-game.cjs');

const ROOT = path.resolve(__dirname, '..');
const RESTRICTED_MODULE = '@pages/Dev/utils/iconsCollection';
const SETUP = `
import { setupAchievements, calculateAchievements } from './achievements';
import { getListOfPlayersIds, getListOfPlayers } from '../../mechanics/players';
import { saveGameToUsers } from '../../services/user';

export const prepareSetupPhase = (players, store) => {
  const achievements = setupAchievements(getListOfPlayersIds(players));
  return { store: { achievements } };
};
export const prepareGameOverPhase = async (store) => {
  const achievements = calculateAchievements(store.achievements);
  await saveGameToUsers({
    gameName: 'sample-game',
    achievements,
  });
};
`;

/**
 * Loads a script with explicit I/O substitutions and without running its CLI.
 */
function loadScript(relative, dependencies = {}, dirname) {
  const filename = path.join(ROOT, relative);
  const requireFromFile = createRequire(filename);
  const module = { exports: {} };
  const context = {
    module,
    __dirname: dirname ?? path.dirname(filename),
    process: {
      stdin: {},
      stdout: {},
      exit(code) { throw new Error(`Unexpected process.exit(${code})`); },
    },
    console: { log() {}, warn() {}, error() {} },
    require: name => dependencies[name] ?? requireFromFile(name),
  };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  return module.exports;
}

/**
 * Runs the complete achievement audit with in-memory game source files.
 */
function auditSetup(setup) {
  const frontend = path.join(ROOT, 'src/games/sample-game');
  const backend = path.join(ROOT, 'functions/src/games/sample-game');
  const files = new Map([
    [path.join(backend, 'achievements.ts'), 'const achievementBuilder = {}; export const { setupAchievements, calculateAchievements } = achievementBuilder;'],
    [path.join(backend, 'setup.ts'), setup],
    [path.join(frontend, 'utils/achievements.ts'), 'export default achievementsReference;'],
    [path.join(ROOT, 'src/utils/achievements.ts'), "import SAMPLE_GAME from '@games/sample-game/utils/achievements';\nconst ACHIEVEMENTS_DICT = { 'sample-game': SAMPLE_GAME };"],
  ]);
  const audit = loadScript('scripts/audit/achievements.cjs', {
    fs: {
      existsSync: filename => files.has(filename),
      readFileSync: filename => {
        assert(files.has(filename), `Unexpected file read: ${filename}`);
        return files.get(filename);
      },
    },
  });
  return audit.run({ features: ['achievements'] }, 'sample-game', frontend);
}

test('achievement audit accepts current named imports, aliases, and multiline persistence arguments', () => {
  assert.equal(auditSetup(SETUP).passed, true);
  const aliases = SETUP
    .replace('setupAchievements, calculateAchievements', 'setupAchievements as initialize, calculateAchievements as calculate')
    .replace('getListOfPlayersIds, getListOfPlayers', 'getListOfPlayersIds as playerIds, getListOfPlayers')
    .replace('{ saveGameToUsers }', '{ saveGameToUsers as persist }')
    .replace('= setupAchievements(', '= initialize(')
    .replace('getListOfPlayersIds(players)', 'playerIds(players)')
    .replace('= calculateAchievements(', '= calculate(')
    .replace('await saveGameToUsers(', 'await persist(')
    .replace('    achievements,\n  });', `    notes: '${'x'.repeat(500)}',\n    achievements,\n  });`);
  assert.equal(auditSetup(aliases).passed, true);
  assert.equal(auditSetup(SETUP.replace(
    'const achievements = setupAchievements(getListOfPlayersIds(players));',
    'store.achievements = setupAchievements(getListOfPlayers(players).map((player) => player.id));',
  )).passed, true);
});

test('achievement audit rejects missing calls, comment-only matches, and incorrect initialization arguments', () => {
  for (const initialization of [
    '// const achievements = setupAchievements(getListOfPlayersIds(players));',
    'const achievements = setupAchievements([]);',
    'setupAchievements(getListOfPlayersIds(players));',
    'const achievements = setupAchievements(getListOfPlayersIds(otherPlayers));',
    'const achievements = setupAchievements(getListOfPlayers(players).map((player) => player.name));',
  ]) {
    const result = auditSetup(SETUP.replace(
      'const achievements = setupAchievements(getListOfPlayersIds(players));', initialization,
    ));
    assert.equal(result.passed, false, initialization);
    assert.match(result.error, /initialization/);
  }
  const unrelatedImport = SETUP.replace("from '../../mechanics/players'", "from './unrelated'");
  assert.match(auditSetup(unrelatedImport).error, /initialization/);
  const invalidCalculation = SETUP.replace('calculateAchievements(store.achievements)', 'calculateAchievements([])');
  assert.match(auditSetup(invalidCalculation).error, /calculateAchievements/);
  const unawaited = SETUP.replace('await saveGameToUsers', 'saveGameToUsers');
  assert.match(auditSetup(unawaited).error, /missing saveGameToUsers/);
  const commented = SETUP.replace(/  await saveGameToUsers\([\s\S]*?\n  \}\);/, '// await saveGameToUsers({ achievements });');
  assert.match(auditSetup(commented).error, /missing saveGameToUsers/);
});

test('achievement audit checks the achievements property passed to persistence rather than incidental text', () => {
  for (const replacement of ["notes: 'achievements',", 'other: { achievements },']) {
    const result = auditSetup(SETUP.replace('    achievements,', `    ${replacement}`));
    assert.equal(result.passed, false);
    assert.match(result.error, /not passing achievements/);
  }
  assert.match(auditSetup(SETUP.replace('    achievements,', '    achievements: [ /* no awards */ ],')).error, /empty achievements/);
  assert.equal(auditSetup(SETUP + '\nconst unrelated = { achievements: [] };').passed, true);
});

test('icon guard recognizes static, multiline, dynamic, relative, and re-exported barrel imports', () => {
  const filename = path.join(ROOT, 'src/components/Example.tsx');
  for (const source of [
    `import { Icon } from '${RESTRICTED_MODULE}';`,
    `import {\n Icon,\n} from \"${RESTRICTED_MODULE}\";`,
    `export { Icon } from '${RESTRICTED_MODULE}';`,
    `const icons = import('${RESTRICTED_MODULE}');`,
    `const icons = require('${RESTRICTED_MODULE}');`,
    `type Icons = import('${RESTRICTED_MODULE}');`,
    "import { Icon } from '../pages/Dev/utils/iconsCollection.tsx';",
  ]) {
    const violations = getImportViolations(filename, source);
    assert.equal(violations.length, 1, source);
    assert.match(violations[0], /^src\/components\/Example.tsx:\d+:/);
  }
  assert.equal(getImportViolations(filename, `import {\n Icon,\n} from '${RESTRICTED_MODULE}';`)[0],
    `src/components/Example.tsx:3: ${RESTRICTED_MODULE}`);
});

test('icon guard allows only the documented exceptions and ignores ordinary strings or comments', () => {
  const source = `import { Icon } from '${RESTRICTED_MODULE}';`;
  for (const allowed of ['src/pages/Dev/Example.tsx', 'src/pages/Dev/utils/iconsCollection.tsx', 'src/icons/iconsCollectionByGame.tsx']) {
    assert.equal(getImportViolations(path.join(ROOT, allowed), source).length, 0, allowed);
  }
  for (const disallowed of ['src/pages/Development/Example.tsx', 'src/icons/collectionByGame.tsx', 'src/icons/iconsCollectionByGame.tsx.backup.ts']) {
    assert.equal(getImportViolations(path.join(ROOT, disallowed), source).length, 1, disallowed);
  }
  const filename = path.join(ROOT, 'src/components/Example.tsx');
  assert.equal(getImportViolations(filename, `// ${source}\nconst text = '${RESTRICTED_MODULE}';`).length, 0);
  assert.equal(getImportViolations(filename, "import { Icon } from '@icons/Icon';").length, 0);
  assert.equal(getImportViolations(filename, source + '\nconst unrelatedSyntaxError: = 1;').length, 1);
});

test('icon CLI reports violations and read failures with nonzero status', () => {
  const filename = path.join(ROOT, 'scripts/check-icon-imports.cjs');
  for (const scenario of ['allowed', 'restricted', 'read-error']) {
    const state = { exitCode: 0 };
    const messages = [];
    const module = { exports: {} };
    const requireFromFile = createRequire(filename);
    const mockRequire = name => name === 'fs' ? {
      readdirSync: () => [{ name: 'Example.tsx', isDirectory: () => false, isFile: () => true }],
      readFileSync: () => {
        if (scenario === 'read-error') throw new Error('Cannot read source file');
        return scenario === 'restricted'
          ? `import { Icon } from '${RESTRICTED_MODULE}';`
          : "import { Icon } from '@icons/Icon';";
      },
    } : requireFromFile(name);
    mockRequire.main = module;
    vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
      module,
      require: mockRequire,
      __dirname: path.dirname(filename),
      process: state,
      console: {
        log: (...args) => messages.push(args.join(' ')),
        error: (...args) => messages.push(args.join(' ')),
      },
    }, { filename });
    assert.equal(state.exitCode, scenario === 'allowed' ? 0 : 1, scenario);
    if (scenario === 'restricted') assert(messages.some(message => message.includes('src/Example.tsx:1:')));
    if (scenario === 'read-error') assert(messages.some(message => message.includes('Cannot read source file')));
  }
});

test('Git status parsing preserves unstaged markers, unusual filenames, and both rename paths', () => {
  const status = ' M functions/src/games/arte-ruim/setup.ts\0' +
    '?? src/games/new-game/file with spaces\nand a newline.tsx\0' +
    'R  src/games/new-game/Phase.tsx\0src/games/old-game/Phase.tsx\0' +
    ' C functions/src/games/new-game/helpers.ts\0functions/src/games/other-game/helpers.ts\0';
  assert.deepEqual(parseStatusPaths(status), [
    'functions/src/games/arte-ruim/setup.ts',
    'src/games/new-game/file with spaces\nand a newline.tsx',
    'src/games/new-game/Phase.tsx',
    'src/games/old-game/Phase.tsx',
    'functions/src/games/new-game/helpers.ts',
    'functions/src/games/other-game/helpers.ts',
  ]);
  assert.deepEqual(parseStatusPaths(''), []);
  assert.throws(() => parseStatusPaths('R  src/games/new-game/file.ts\0'), /without its original path/);
  const staging = loadScript('scripts/stage-game.cjs', {
    child_process: { execFileSync: (command, args, options) => {
      assert.equal(command, 'git');
      assert.deepEqual([...args], ['status', '--porcelain=v1', '-z', '--untracked-files=all']);
      assert.equal(options.cwd, ROOT);
      return status;
    } },
  });
  assert.deepEqual([...staging.getModifiedGames()], ['arte-ruim', 'new-game', 'old-game', 'other-game']);
});

/**
 * Creates an isolated Git index without making commits or modifying the working repository.
 */
function createGitFixture(context) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'tardedivertida-script-test-'));
  context.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const git = args => execFileSync('git', args, { cwd: directory, encoding: 'utf8', stdio: 'pipe' });
  git(['init', '--quiet']);
  const answers = [];
  const staging = loadScript('scripts/stage-game.cjs', {
    readline: { createInterface: () => ({
      close() {},
      question: (_, callback) => {
        assert(answers.length, 'Unexpected staging prompt');
        callback(answers.shift());
      },
    }) },
  }, path.join(directory, 'scripts'));
  return { directory, git, staging, answers };
}

test('staging a frontend-only game excludes the absent backend path and leaves unrelated files unstaged', async context => {
  const fixture = createGitFixture(context);
  const game = 'src/games/frontend-game';
  fs.mkdirSync(path.join(fixture.directory, game), { recursive: true });
  fs.writeFileSync(path.join(fixture.directory, game, 'Session.tsx'), 'export const Session = true;\n');
  fs.writeFileSync(path.join(fixture.directory, 'unrelated.txt'), 'Leave unstaged.\n');
  assert.deepEqual([...fixture.staging.getModifiedGames()], ['frontend-game']);
  assert.deepEqual([...fixture.staging.getGamePaths('frontend-game')], [game]);
  fixture.answers.push('1');
  await fixture.staging.main();
  assert.equal(fixture.git(['diff', '--cached', '--name-only']).trim(), `${game}/Session.tsx`);
  assert(fixture.git(['status', '--porcelain=v1']).includes('?? unrelated.txt'));
});

test('staging includes tracked deletions even when the whole game directory was removed', async context => {
  const fixture = createGitFixture(context);
  const game = 'functions/src/games/deleted-game';
  const folder = path.join(fixture.directory, game);
  fs.mkdirSync(folder, { recursive: true });
  const file = path.join(folder, 'setup.ts');
  fs.writeFileSync(file, 'export const setup = true;\n');
  fixture.git(['add', '--', game]);
  fs.unlinkSync(file);
  fs.rmdirSync(folder);
  assert.deepEqual([...fixture.staging.getGamePaths('deleted-game')], [game]);
  fixture.answers.push('1');
  await fixture.staging.main();
  assert.equal(fixture.git(['ls-files']), '');
});

test('staging preserves the normal case of a game with frontend and backend directories', async context => {
  const fixture = createGitFixture(context);
  const paths = ['functions/src/games/both-sides', 'src/games/both-sides'];
  for (const folder of paths) {
    fs.mkdirSync(path.join(fixture.directory, folder), { recursive: true });
    fs.writeFileSync(path.join(fixture.directory, folder, 'example.ts'), 'export const example = true;\n');
  }
  assert.deepEqual([...fixture.staging.getGamePaths('both-sides')], paths);
  assert.deepEqual([...fixture.staging.getGamePaths('missing-game')], []);
  fixture.answers.push('1');
  await fixture.staging.main();
  assert.deepEqual(fixture.git(['diff', '--cached', '--name-only']).trim().split('\n'),
    paths.map(folder => `${folder}/example.ts`));
});

test('Git command failures are surfaced instead of being reported as no modified games', () => {
  const staging = loadScript('scripts/stage-game.cjs', {
    child_process: { execFileSync() { throw new Error('Git is unavailable'); } },
  });
  assert.throws(() => staging.getModifiedGames(), /Git is unavailable/);
});

test('commit scopes include backend game slugs, deduplicate frontend/backend, and preserve shared areas', () => {
  assert.deepEqual(analyzeStagedFiles([
    'functions/src/games/arte-ruim/setup.ts',
    'src/games/arte-ruim/PhaseDraw.tsx',
    'functions/src/games/megamix/helpers.ts',
    'functions/src/games/delegators.ts',
    'functions/src/engine/session.ts',
    'scripts/stage-game.cjs',
  ]), {
    games: ['arte-ruim', 'megamix'],
    areas: ['functions', 'scripts'],
  });
  assert.deepEqual(analyzeStagedFiles(['functions/src/engine/session.ts']).games, []);
});
