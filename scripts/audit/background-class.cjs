const fs = require('fs');
const path = require('path');

module.exports = {
  id: 'background-class',
  run: (gameInfo, gameDir, gameFolderPath) => {
    const label = 'Background Class';
    const stylesPath = path.join(gameFolderPath, 'utils', 'styles.scss');

    if (!fs.existsSync(stylesPath)) {
      return {
        label,
        passed: false,
        error: 'utils/styles.scss is missing',
      };
    }

    const stylesContent = fs.readFileSync(stylesPath, 'utf8');
    const hasBackgroundClass = /^\s*\.background\s*(?:\{|,)/m.test(stylesContent);

    return {
      label,
      passed: hasBackgroundClass,
      error: hasBackgroundClass ? null : '.background class is missing from utils/styles.scss',
    };
  },
};
