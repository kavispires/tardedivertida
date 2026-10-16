const fs = require('fs');
const path = require('path');
const ts = require('typescript');

/**
 * Collects helper calls using their imported names, including aliased named imports.
 * @param {ts.SourceFile} source - Parsed backend setup module
 * @returns {{calls: ts.CallExpression[], isCall: Function}} Calls and a helper-name predicate
 */
function getHelperCalls(source) {
  const modules = new Map([
    ['./achievements', ['setupAchievements', 'calculateAchievements']],
    ['../../mechanics/players', ['getListOfPlayersIds', 'getListOfPlayers']],
    ['../../services/user', ['saveGameToUsers']],
  ]);
  const imports = new Map();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const helpers = modules.get(statement.moduleSpecifier.text);
    const bindings = statement.importClause?.namedBindings;
    if (!helpers || statement.importClause?.isTypeOnly || !bindings || !ts.isNamedImports(bindings)) continue;
    for (const binding of bindings.elements) {
      const name = (binding.propertyName ?? binding.name).text;
      if (!binding.isTypeOnly && helpers.includes(name)) imports.set(binding.name.text, name);
    }
  }
  const calls = [];
  function visit(node) {
    if (ts.isCallExpression(node)) calls.push(node);
    ts.forEachChild(node, visit);
  }
  visit(source);
  const isCall = (node, name) => node && ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) && imports.get(node.expression.text) === name;
  return { calls, isCall };
}

/**
 * Checks a direct property reference without matching source comments or unrelated object properties.
 * @param {ts.Node} node - Expression to inspect
 * @param {string} object - Expected object identifier
 * @param {string} property - Expected property name
 * @returns {boolean} Whether the expression accesses the requested property
 */
function isProperty(node, object, property) {
  return node && ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression) &&
    node.expression.text === object && node.name.text === property;
}

module.exports = {
  id: 'achievements-implementation',
  run: (gameInfo, gameDir, gameFolderPath) => {
    const label = 'Achievements Implementation';

    // Helper to keep our returns clean
    const fail = (error) => ({ label, passed: false, error });

    // --- Path Resolution ---
    // Assuming your script runs from /scripts/audit, we traverse up to the root to find the backend
    const backendDir = path.resolve(__dirname, '../../functions/src/games', gameDir);
    const frontendDir = gameFolderPath; // This is already resolving to src/games/<game-name>

    // -------------------------------------------------------------------------
    // BACKEND AUDITS
    // -------------------------------------------------------------------------
    const beAchievementsPath = path.join(backendDir, 'achievements.ts');
    const beSetupPath = path.join(backendDir, 'setup.ts');

    // 1. Backend: achievements.ts audit
    if (!fs.existsSync(beAchievementsPath)) return fail('Backend: achievements.ts is missing');
    const beAchContent = fs.readFileSync(beAchievementsPath, 'utf8');

    if (!beAchContent.trim()) return fail('Backend: achievements.ts is empty');
    if (!beAchContent.includes('achievementBuilder')) return fail('Backend: missing achievementBuilder usage');
    if (!beAchContent.includes('setupAchievements') || !beAchContent.includes('calculateAchievements')) {
      return fail('Backend: achievements.ts missing setupAchievements or calculateAchievements export');
    }

    // 2. Backend: setup.ts setupAchievements initialization audit
    if (!fs.existsSync(beSetupPath)) return fail('Backend: setup.ts is missing');
    const setupContent = fs.readFileSync(beSetupPath, 'utf8');

    const setupSource = ts.createSourceFile(beSetupPath, setupContent, ts.ScriptTarget.Latest, true);
    if (setupSource.parseDiagnostics.length > 0) return fail('Backend: setup.ts could not be parsed');
    const { calls, isCall } = getHelperCalls(setupSource);
    const initializesAchievements = calls.some(call => {
      if (!isCall(call, 'setupAchievements')) return false;
      if (!ts.isVariableDeclaration(call.parent) && !(ts.isBinaryExpression(call.parent) &&
        call.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken && call.parent.right === call)) return false;
      const argument = call.arguments[0];
      if (isCall(argument, 'getListOfPlayersIds')) {
        return argument.arguments[0]?.getText(setupSource) === 'players';
      }
      if (!argument || !ts.isCallExpression(argument) || !ts.isPropertyAccessExpression(argument.expression) ||
        argument.expression.name.text !== 'map') return false;
      const playersCall = argument.expression.expression;
      const mapper = argument.arguments[0];
      return isCall(playersCall, 'getListOfPlayers') &&
        playersCall.arguments[0]?.getText(setupSource) === 'players' &&
        mapper && ts.isArrowFunction(mapper) && mapper.parameters.length === 1 &&
        isProperty(mapper.body, mapper.parameters[0].name.getText(setupSource), 'id');
    });
    if (!initializesAchievements) {
      return fail('Backend: setup.ts missing setupAchievements initialization line');
    }

    // 3. Backend: calculateAchievements uses store.achievements
    if (!calls.some(call => isCall(call, 'calculateAchievements') && isProperty(call.arguments[0], 'store', 'achievements'))) {
      return fail('Backend: setup.ts missing calculateAchievements called with store.achievements');
    }

    // 4. Backend: saveGameToUsers audit
    const saveCalls = calls.filter(call => isCall(call, 'saveGameToUsers') && ts.isAwaitExpression(call.parent));
    if (saveCalls.length === 0) {
      return fail('Backend: setup.ts missing saveGameToUsers call');
    }

    const achievementProperties = saveCalls.map(call => {
      const argument = call.arguments[0];
      return argument && ts.isObjectLiteralExpression(argument)
        ? [...argument.properties].reverse().find(property =>
          (ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property)) &&
          (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) &&
          property.name.text === 'achievements')
        : undefined;
    });
    if (achievementProperties.some(property => !property)) {
      return fail('Backend: setup.ts saveGameToUsers is not passing achievements');
    }

    if (achievementProperties.some(property => ts.isPropertyAssignment(property) &&
      ts.isArrayLiteralExpression(property.initializer) && property.initializer.elements.length === 0)) {
      return fail('Backend: setup.ts is passing empty achievements: []');
    }

    // -------------------------------------------------------------------------
    // FRONTEND AUDITS
    // -------------------------------------------------------------------------
    const feUtilsAchPath = path.join(frontendDir, 'utils/achievements.ts');

    // 1 & 2. Frontend: utils/achievements.ts audits
    if (!fs.existsSync(feUtilsAchPath)) return fail('Frontend: utils/achievements.ts is missing');
    const feUtilsAchContent = fs.readFileSync(feUtilsAchPath, 'utf8');

    if (!feUtilsAchContent.includes('export default achievementsReference;')) {
      return fail('Frontend: achievements.ts missing exact default export');
    }

    // 3. Frontend: gameInfo features array
    const features = gameInfo.features;
    if (!Array.isArray(features) || !features.includes('achievements')) {
      return fail('Frontend: gameInfo.json missing "achievements" in features array');
    }

    // -------------------------------------------------------------------------
    // GLOBAL FRONTEND CHECKS (src/utils/achievements.ts)
    // -------------------------------------------------------------------------
    const globalAchDictPath = path.resolve(__dirname, '../../src/utils/achievements.ts');

    if (!fs.existsSync(globalAchDictPath)) {
      return fail('Global: src/utils/achievements.ts dictionary is missing');
    }

    const globalAchContent = fs.readFileSync(globalAchDictPath, 'utf8');

    // 1. Verify the game is imported at the top of the file
    const importRegex = new RegExp(`from '@games/${gameDir}/utils/achievements'`);
    if (!importRegex.test(globalAchContent)) {
      return fail(`Global: ${gameDir} is not imported in src/utils/achievements.ts`);
    }

    // 2. Verify the game exists in ACHIEVEMENTS_DICT and is NOT mapped to null
    // This regex matches optionally quoted keys (e.g. adedanhx: or 'arte-ruim':)
    // and captures whatever it is mapped to on the right side of the colon.
    const dictRegex = new RegExp(`(?:'|")?${gameDir}(?:'|")?\\s*:\\s*([A-Za-z0-9_]+)`);
    const match = globalAchContent.match(dictRegex);

    if (!match) {
      return fail(`Global: ${gameDir} is missing from ACHIEVEMENTS_DICT`);
    }

    if (match[1] === 'null') {
      return fail(`Global: ${gameDir} is set to null in ACHIEVEMENTS_DICT`);
    }

    // -------------------------------------------------------------------------
    // ALL AUDITS PASSED
    // -------------------------------------------------------------------------
    return {
      label,
      passed: true,
      error: null
    };
  }
};
