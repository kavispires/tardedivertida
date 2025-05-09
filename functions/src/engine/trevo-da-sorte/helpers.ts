import type { TextCard } from '../../types/tdr';
import type { Clover, Guess, Guesses, Leaf, LeafGuess, LeafId, Leaves } from './types';
// Constants
import { LEAF_SIZE, ROTATIONS, TREVO_DA_SORTE_PHASES } from './constants';
// Helpers
import utils from '../../utils';
import { getRandomItems } from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @returns phase
 */
export const determineNextPhase = (
  currentPhase: string,
  gameOrder?: PlayerId[],
  activeCloverId?: PlayerId,
): string => {
  const { LOBBY, SETUP, WORD_SELECTION, CLOVER_WRITING, CLOVER_GUESSING, RESULTS, GAME_OVER } =
    TREVO_DA_SORTE_PHASES;
  const order = [LOBBY, SETUP, WORD_SELECTION, CLOVER_WRITING, CLOVER_GUESSING, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    // If last player, go to results
    if (gameOrder && activeCloverId === gameOrder[gameOrder.length - 1]) {
      return GAME_OVER;
    }

    return CLOVER_GUESSING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return WORD_SELECTION;
};

export const buildLeaves = (players: Players, gameMode: string) => {
  utils.players.getListOfPlayers(players).forEach((player) => {
    const selectedWords: TextCard[] = utils.game.shuffle(
      player.hand.filter((card: TextCard) => !player.badWordsIds.includes(card.id)),
    );

    const wordChunks = utils.game.sliceIntoChunks(selectedWords, LEAF_SIZE);
    const selectedChunks = gameMode === 'hard' ? wordChunks : getRandomItems(wordChunks, 5);
    const leaves = selectedChunks.reduce((acc: Leaves, entry) => {
      const leafId: LeafId = entry.map((card) => card.id.split('-')[1]).join('-');
      const leaf: Leaf = {
        id: leafId,
        cards: entry,
      };
      acc[leafId] = leaf;
      return acc;
    }, {});
    player.leaves = leaves;
  });
};

export const buildClovers = (players: Players) => {
  utils.players.getListOfPlayers(players).forEach((player) => {
    const leaves: string[] = utils.game.shuffle(Object.keys(player.leaves));

    const clover: Clover = {
      cloverId: player.id,
      leaves: {
        A: {
          leafId: leaves[0],
          rotation: utils.game.getRandomItem(ROTATIONS),
          clue: '',
        },
        B: {
          leafId: leaves[1],
          rotation: utils.game.getRandomItem(ROTATIONS),
          clue: '',
        },
        C: {
          leafId: leaves[2],
          rotation: utils.game.getRandomItem(ROTATIONS),
          clue: '',
        },
        D: {
          leafId: leaves[3],
          rotation: utils.game.getRandomItem(ROTATIONS),
          clue: '',
        },
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
        cloverId: p.id,
        playerId: player.id,
        score: 0,
        leaves: {
          A: {
            leafId: '',
            rotation: 0,
            tries: 0,
          },
          B: {
            leafId: '',
            rotation: 0,
            tries: 0,
          },
          C: {
            leafId: '',
            rotation: 0,
            tries: 0,
          },
          D: {
            leafId: '',
            rotation: 0,
            tries: 0,
          },
        },
      };

      return acc;
    }, {});
  });
};

export const buildRanking = (players: Players, activeCloverId: PlayerId) => {
  // Gained Points: [First try, second try, granted by other players]
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.id !== activeCloverId) {
      const guesses: Guess = player.guesses[activeCloverId].leaves;

      Object.values(guesses).forEach((guess: LeafGuess) => {
        const score = guess.score ?? 0;
        const pointSlotIndex = score > 1 ? 0 : 1;

        scores.add(player.id, score, pointSlotIndex);
        scores.add(activeCloverId, score > 1 ? 1 : 0, 2);
      });
    }
  });

  return scores.rank(players);
};
