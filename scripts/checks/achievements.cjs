// scripts/checks/achievements.cjs
const fs = require('fs');
const path = require('path');

module.exports = {
  id: 'achievements-implementation',
  run: (gameInfo, gameDir, gameFolderPath) => {
    const label = 'Achievements Implementation';

    // Helper to keep our returns clean
    const fail = (error) => ({ label, passed: false, error });

    // --- Path Resolution ---
    // Assuming your script runs from /scripts/checks, we traverse up to the root to find the backend
    const backendDir = path.resolve(__dirname, '../../functions/src/engine', gameDir);
    const frontendDir = gameFolderPath; // This is already resolving to src/games/<game-name>

    // -------------------------------------------------------------------------
    // BACKEND CHECKS
    // -------------------------------------------------------------------------
    const beAchievementsPath = path.join(backendDir, 'achievements.ts');
    const beSetupPath = path.join(backendDir, 'setup.ts');

    // 1. Backend: achievements.ts checks
    if (!fs.existsSync(beAchievementsPath)) return fail('Backend: achievements.ts is missing');
    const beAchContent = fs.readFileSync(beAchievementsPath, 'utf8');

    if (!beAchContent.trim()) return fail('Backend: achievements.ts is empty');
    if (!beAchContent.includes('achievementBuilder')) return fail('Backend: missing achievementBuilder usage');
    if (!beAchContent.includes('setupAchievements') || !beAchContent.includes('calculateAchievements')) {
      return fail('Backend: achievements.ts missing setupAchievements or calculateAchievements export');
    }

    // 2. Backend: setup.ts setupAchievements initialization check
    if (!fs.existsSync(beSetupPath)) return fail('Backend: setup.ts is missing');
    const setupContent = fs.readFileSync(beSetupPath, 'utf8');

    // Match either pattern:
    // 1. const achievements = setupAchievements(utils.players.getListOfPlayersIds(players))
    // 2. store.achievements = setupAchievements(utils.players.getListOfPlayers(players).map(...))
    const setupLineRegex = /^\s*(const achievements|store\.achievements)\s*=\s*setupAchievements\(\s*utils\.players\.getListOfPlayers(Ids)?\(/m;
    if (!setupLineRegex.test(setupContent)) {
      return fail('Backend: setup.ts missing setupAchievements initialization line');
    }

    // 3. Backend: calculateAchievements uses store.achievements
    // Matches "calculateAchievements(" followed by "store.achievements" as the first argument
    const calcRegex = /calculateAchievements\(\s*store\.achievements/;
    if (!calcRegex.test(setupContent)) {
      return fail('Backend: setup.ts missing calculateAchievements called with store.achievements');
    }

    // 4. Backend: saveGameToUsers checks
    if (!setupContent.includes('await utils.user.saveGameToUsers')) {
      return fail('Backend: setup.ts missing saveGameToUsers call');
    }

    const saveGameRegex = /await utils\.user\.saveGameToUsers\([\s\S]{0,200}achievements[\s\S]{0,200}\)/;
    if (!saveGameRegex.test(setupContent)) {
      return fail('Backend: setup.ts saveGameToUsers is not passing achievements');
    }

    if (setupContent.includes('achievements: []')) {
      return fail('Backend: setup.ts is passing empty achievements: []');
    }

    // -------------------------------------------------------------------------
    // FRONTEND CHECKS
    // -------------------------------------------------------------------------
    const feUtilsAchPath = path.join(frontendDir, 'utils/achievements.ts');

    // 1 & 2. Frontend: utils/achievements.ts checks
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
    // ALL CHECKS PASSED
    // -------------------------------------------------------------------------
    return {
      label,
      passed: true,
      error: null
    };
  }
};
