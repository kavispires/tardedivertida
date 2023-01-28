// Types

// Constants
import { QUEM_SOU_EU_PHASES } from './constants';
// Helpers
import utils from '../../utils';

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

        // Every player guessing yours correctly gets 1 point
        scores.add(guessPlayerId, 1, 1);
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
          playersPoints[player.id] += 1;
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
