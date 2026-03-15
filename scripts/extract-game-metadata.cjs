const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, '../src/games');

function extractGameMetadata() {
  const games = [];
  const excludedReleases = ['planned', 'deprecated', 'paused', 'cancelled'];

  // Get all directories in src/games
  const gameDirectories = fs.readdirSync(gamesDir).filter(dir => {
    const fullPath = path.join(gamesDir, dir);
    return fs.statSync(fullPath).isDirectory() && dir !== '_template';
  });

  for (const gameDir of gameDirectories) {
    const gameInfoPath = path.join(gamesDir, gameDir, 'game-info.json');

    if (fs.existsSync(gameInfoPath)) {
      try {
        const gameInfo = JSON.parse(fs.readFileSync(gameInfoPath, 'utf8'));

        const metadata = {
          gameName: gameInfo.gameName,
          gameCode: gameInfo.gameCode,
          version: gameInfo.version,
          release: gameInfo.release,
          hasRules: !!(gameInfo.rules &&
                      ((gameInfo.rules.pt && gameInfo.rules.pt.length > 0) ||
                       (gameInfo.rules.en && gameInfo.rules.en.length > 0))),
          title: gameInfo.title,
        };

        games.push(metadata);
      } catch (error) {
        console.error(`Error reading ${gameDir}/game-info.json:`, error.message);
      }
    }
  }

  // Sort by gameName
  games.sort((a, b) => a.gameName.localeCompare(b.gameName));

  // Filter valid games (not planned or deprecated)
  const validGames = games.filter(game => !excludedReleases.includes(game.release));

  console.log('=== ALL GAMES ===');
  console.log(`Total games: ${games.length}`);
  console.log();

  console.log('=== VALID GAMES (excluding planned/deprecated) ===');
  console.log(`Valid games: ${validGames.length}`);
  console.log();
  console.table(validGames.map(g => ({
    Code: g.gameCode,
    Name: g.gameName,
    Version: g.version,
    Release: g.release,
    'Has Rules': g.hasRules ? '✓' : '✗',
    'Title (PT)': g.title?.pt || 'N/A'
  })));

  console.log('\n=== EXCLUDED GAMES (planned/deprecated) ===');
  const excludedGames = games.filter(game => excludedReleases.includes(game.release));
  console.log(`Excluded games: ${excludedGames.length}`);
  console.table(excludedGames.map(g => ({
    Code: g.gameCode,
    Name: g.gameName,
    Version: g.version,
    Release: g.release,
    'Has Rules': g.hasRules ? '✓' : '✗'
  })));

  console.log('\n=== GAMES WITHOUT RULES ===');
  const noRulesGames = validGames.filter(game => !game.hasRules);
  console.log(`Games without rules: ${noRulesGames.length}`);
  if (noRulesGames.length > 0) {
    console.table(noRulesGames.map(g => ({
      Code: g.gameCode,
      Name: g.gameName,
      Release: g.release
    })));
  }

  // Save to JSON file for further processing
  const output = {
    totalGames: games.length,
    validGames: validGames.length,
    excludedGames: excludedGames.length,
    gamesWithoutRules: noRulesGames.length,
    allGames: games,
    validGamesList: validGames,
    excludedGamesList: excludedGames,
    gamesWithoutRulesList: noRulesGames
  };

  const outputPath = path.join(__dirname, '../game-metadata.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Metadata saved to: game-metadata.json`);
}

extractGameMetadata();
