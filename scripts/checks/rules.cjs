module.exports = {
  id: 'rules-en-pt',
  run: (gameInfo, gameDir, gameFolderPath) => {
    const hasEnRules = gameInfo.rules?.en && Array.isArray(gameInfo.rules.en) && gameInfo.rules.en.length > 1;
    const hasPtRules = gameInfo.rules?.pt && Array.isArray(gameInfo.rules.pt) && gameInfo.rules.pt.length > 1;

    let error = null;

    // Determine the specific failure reason
    if (!hasEnRules && !hasPtRules) {
      error = 'EN and PT rules missing';
    } else if (!hasEnRules) {
      error = 'EN rules missing';
    } else if (!hasPtRules) {
      error = 'PT rules missing';
    }

    return {
      label: 'Rules (EN/PT)',
      passed: hasEnRules && hasPtRules,
      error: error
    };
  }
};
