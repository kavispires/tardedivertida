// Constants
import { LEAF_SIZE, ROTATIONS, TREVO_DA_SORTE_PHASES } from './constants';
// Helpers
import * as utils from '../../utils';
import { Clover, Guess, Guesses, Leaf, LeafGuess, LeafId, Leaves } from './types';
import { getRandomItems } from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @returns phase
 */
export const determineNextPhase = (
  currentPhase: string,
  gameOrder?: PlayerId[],
  activeCloverId?: PlayerId
): string => {
  const { RULES, SETUP, WORD_SELECTION, CLOVER_WRITING, CLOVER_GUESSING, RESULTS, GAME_OVER } =
    TREVO_DA_SORTE_PHASES;
  const order = [RULES, SETUP, WORD_SELECTION, CLOVER_WRITING, CLOVER_GUESSING, RESULTS, GAME_OVER];

  if (currentPhase === CLOVER_GUESSING) {
    // If last player, go to results
    if (gameOrder && activeCloverId === gameOrder[gameOrder.length - 1]) {
      return RESULTS;
    }

    return CLOVER_GUESSING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return WORD_SELECTION;
};

export const buildLeaves = (players: Players, gameMode: string) => {
  Object.values(players).forEach((player) => {
    const selectedWords: TextCard[] = utils.game.shuffle(
      player.hand.filter((card: TextCard) => !player.badWordsIds.includes(card.id))
    );

    const wordChunks = utils.game.sliceIntoChunks(selectedWords, LEAF_SIZE);
    const selectedChunks = gameMode === 'hard' ? wordChunks : getRandomItems(wordChunks, 5);
    const leaves = selectedChunks.reduce((acc: Leaves, entry) => {
      const leafId: LeafId = entry.map((card) => card.id.split('-')[1]).join('-');
      const leaf: Leaf = {
        id: leafId,
        cards: entry,
        lockedRotation: utils.game.getRandomItem(ROTATIONS),
        rotation: 0,
        position: null,
      };
      acc[leafId] = leaf;
      return acc;
    }, {});
    player.leaves = leaves;
  });
};

export const buildClovers = (players: Players) => {
  Object.values(players).forEach((player) => {
    const leaves: string[] = utils.game.shuffle(Object.keys(player.leaves));

    const clover: Clover = {
      rotation: 0,
      leaves: {
        A: leaves[0],
        B: leaves[1],
        C: leaves[2],
        D: leaves[3],
      },
    };

    player.clover = clover;
  });
};

export const buildGuesses = (players: Players) => {
  const listOfPlayers = utils.players.getListOfPlayers(players);
  listOfPlayers.forEach((player) => {
    player.guesses = listOfPlayers.reduce((acc: Guesses, p) => {
      if (p.id === player.id) return acc;

      acc[p.id] = {
        A: null,
        B: null,
        C: null,
        D: null,
        tries: 0,
      };

      return acc;
    }, {});
  });
};

export const buildRanking = (players: Players) => {
  // Gained Points: [First try, second try, granted by other players]
  const newScores = utils.helpers.buildNewScoreObject(players, [0, 0, 0]);

  const listOfPlayers = utils.players.getListOfPlayers(players);
  listOfPlayers.forEach((player) => {
    // For each guess, compare guesses with result
    Object.keys(player.guesses).forEach((resultCloverId) => {
      const guesses: Guess = player.guesses[resultCloverId];
      const clover: Clover = players[resultCloverId].clover;
      const leaves: Leaves = players[resultCloverId].leaves;
      const isSecondTry = guesses.tries > 1;
      const pointValue = isSecondTry ? 1 : 2;

      Object.keys(guesses).forEach((leafId) => {
        if (leafId !== 'tries') {
          const guess: LeafGuess = guesses[leafId];
          const result = leaves[clover[leafId]];

          if (guess.leafId === result.id && guess.rotation === result.lockedRotation) {
            newScores[player.id].gainedPoints[isSecondTry ? 1 : 0] += pointValue;
            newScores[player.id].newScore += pointValue;
            player.score += pointValue;

            // Author gets points only if first try
            if (!isSecondTry) {
              newScores[resultCloverId].gainedPoints[2] += 1;
              newScores[resultCloverId].newScore += 1;
              players[resultCloverId].score += 1;
            }
          }
        }
      });
    });
  });

  return Object.values(newScores).sort((a: NewScore, b: NewScore) => (a.newScore > b.newScore ? 1 : -1));
};
