// Constants
import { QUEM_SOU_EU_PHASES } from './constants';
// Helpers
import utils from '../../utils';
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and game mode
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param imageCardsMode - Whether the game is in image cards mode
 */
export const determineNextPhase = (currentPhase: string, round: Round, imageCardsMode: boolean): string => {
  const { SETUP, CHARACTER_FILTERING, CHARACTER_DESCRIPTION, GUESSING, RESULTS, GAME_OVER } =
    QUEM_SOU_EU_PHASES;
  const order = [SETUP, CHARACTER_FILTERING, CHARACTER_DESCRIPTION, GUESSING, RESULTS];

  if (currentPhase === SETUP) {
    return imageCardsMode ? CHARACTER_DESCRIPTION : CHARACTER_FILTERING;
  }

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : CHARACTER_DESCRIPTION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Build round ranking by scoring player guesses
 * @param players - The collection of players in the game (this function modifies players)
 * @param currentRound - The current round number
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
  playerId: UID;
  characterId: UID;
  playersSay: Dictionary<UID[]>;
  playersPoints: Record<UID, number>;
};

/**
 * Builds gallery entries with player guesses and points
 * @param store - The Firebase store data for tracking achievements
 * @param players - The collection of players in the game
 * @param currentRound - The current round number
 */
export const buildGallery = (store: PlainObject, players: Players, currentRound: number): GalleryEntry[] => {
  const listOfPlayers = utils.players.getListOfPlayers(players);

  const gallery = listOfPlayers.map((player) => {
    // Achievement: choseRandomly
    if (player.choseRandomly) {
      increaseAchievement(store.achievements, player.id, 'chooseForMe', 1);
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

    listOfPlayers.forEach((opponent) => {
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
