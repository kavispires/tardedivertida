// Constants
import { QUEM_SOU_EU_ACHIEVEMENTS, QUEM_SOU_EU_PHASES } from './constants';
// Helpers
import utils from '../../utils';
import { FirebaseStoreData, QuemSouEuAchievement } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, CHARACTER_FILTERING, CHARACTER_DESCRIPTION, GUESSING, RESULTS, GAME_OVER } =
    QUEM_SOU_EU_PHASES;
  const order = [RULES, SETUP, CHARACTER_FILTERING, CHARACTER_DESCRIPTION, GUESSING, RESULTS];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : CHARACTER_DESCRIPTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return CHARACTER_DESCRIPTION;
};

/**
 * Build round ranking
 * @param players - it modifies players
 * @returns
 */
export const buildRanking = (players: Players, currentRound: number) => {
  // Gained Points: [from guesses, from others]
  const scores = new utils.players.Scores(players, [0, 0]);

  const listOfPlayers = utils.players.getListOfPlayers(players);

  const answers = listOfPlayers.reduce((acc, player) => {
    acc[player.id] = player.character.id;
    return acc;
  }, {});

  // Collect points
  listOfPlayers.forEach((player) => {
    Object.entries(player.guesses).forEach(([guessPlayerId, voteCardId]) => {
      if (guessPlayerId === player.id) {
        return;
      }

      // Every correct guess gets N points
      if (answers[guessPlayerId] === voteCardId) {
        scores.add(player.id, currentRound, 0);
        player.score += currentRound;

        // Every player guessing yours correctly gets N points
        scores.add(guessPlayerId, currentRound, 1);
        players[guessPlayerId].score += currentRound;
      }
    });
  });

  return scores.rank(players);
};

type GalleryEntry = {
  playerId: PlayerId;
  characterId: CardId;
  playersSay: Record<CardId, PlayerId[]>;
  playersPoints: Record<PlayerId, number>;
};

export const buildGallery = (players: Players, currentRound: number): GalleryEntry[] => {
  const listOfPlayers = utils.players.getListOfPlayers(players);

  const gallery = listOfPlayers.map((player) => {
    // Achievement: choseRandomly
    if (player.choseRandomly) {
      utils.achievements.increase(player, player.id, 'chooseForMe', 1);
    }

    // Make PlayersSay and PlayerPoints
    const playersSay = {};
    const playersPoints = {
      [player.id]: 0,
    };
    const characterId = player.character.id;

    // Create array in people say for actual guess
    if (playersSay[characterId] === undefined) {
      playersSay[characterId] = [];
    }

    listOfPlayers.map((opponent) => {
      if (player.id !== opponent.id) {
        const guessId = opponent.guesses[player.id];

        // Create array in people say for actual guess
        if (playersSay[guessId] === undefined) {
          playersSay[guessId] = [];
        }

        // Got correct
        if (guessId === characterId) {
          playersSay[characterId].push(opponent.id);
          playersPoints[opponent.id] = currentRound;
          playersPoints[player.id] += currentRound;
          // Got wrong
        } else {
          playersSay[guessId].push(opponent.id);
        }
      }
    });

    return {
      playerId: player.id,
      characterId,
      playersSay,
      playersPoints,
    };
  });

  return gallery;
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<QuemSouEuAchievement>[] = [];

  const { most: mostGlyphs, least: leastGlyphs } = utils.achievements.getMostAndLeastOf(store, 'glyphs');

  // Most glyphs: selected the most number of glyphs during the game
  if (mostGlyphs) {
    achievements.push({
      type: QUEM_SOU_EU_ACHIEVEMENTS.MOST_GLYPHS,
      playerId: mostGlyphs.playerId,
      value: mostGlyphs.glyphs,
    });
  }

  // Least glyphs: selected the least number of glyphs during the game
  if (leastGlyphs) {
    achievements.push({
      type: QUEM_SOU_EU_ACHIEVEMENTS.LEAST_GLYPHS,
      playerId: leastGlyphs.playerId,
      value: leastGlyphs.glyphs,
    });
  }

  const { most: mostPositive, least: leastPositive } = utils.achievements.getMostAndLeastOf(
    store,
    'positive'
  );

  // Most positive: selected the most number of glyphs in the positive side during the game
  if (mostPositive) {
    achievements.push({
      type: QUEM_SOU_EU_ACHIEVEMENTS.MOST_POSITIVE,
      playerId: mostPositive.playerId,
      value: mostPositive.positive,
    });
  }

  // Least positive: selected the least number of glyphs in the positive side  during the game
  if (leastPositive) {
    achievements.push({
      type: QUEM_SOU_EU_ACHIEVEMENTS.LEAST_POSITIVE,
      playerId: leastPositive.playerId,
      value: leastPositive.positive,
    });
  }

  const { most: mostNegative, least: leastNegative } = utils.achievements.getMostAndLeastOf(
    store,
    'negative'
  );

  // Most negative: selected the most number of glyphs in the negative side during the game
  if (mostNegative) {
    achievements.push({
      type: QUEM_SOU_EU_ACHIEVEMENTS.MOST_NEGATIVE,
      playerId: mostNegative.playerId,
      value: mostNegative.negative,
    });
  }

  // Least negative: selected the least number of glyphs in the negative side  during the game
  if (leastNegative) {
    achievements.push({
      type: QUEM_SOU_EU_ACHIEVEMENTS.LEAST_NEGATIVE,
      playerId: leastNegative.playerId,
      value: leastNegative.negative,
    });
  }

  const { most: single } = utils.achievements.getMostAndLeastOf(store, 'single');
  // Single: selected a single item most times
  if (single) {
    achievements.push({
      type: QUEM_SOU_EU_ACHIEVEMENTS.SINGLE_ICON,
      playerId: single.playerId,
      value: single.single,
    });
  }

  const { most: tableVotes } = utils.achievements.getMostAndLeastOf(store, 'tableVotes');
  // tableVotes: selected the character from the table most times
  if (tableVotes) {
    achievements.push({
      type: QUEM_SOU_EU_ACHIEVEMENTS.TABLE_VOTES,
      playerId: tableVotes.playerId,
      value: tableVotes.tableVotes,
    });
  }

  // Choose for me: gave up on trying to match the clues the most
  const { most: chooseForMe } = utils.achievements.getMostAndLeastOf(store, 'chooseForMe');
  if (chooseForMe) {
    achievements.push({
      type: QUEM_SOU_EU_ACHIEVEMENTS.CHOOSE_FOR_ME,
      playerId: chooseForMe.playerId,
      value: chooseForMe.chooseForMe,
    });
  }

  return achievements;
};
