// Constants
import { LEAF_SIZE, ROTATIONS, TREVO_DA_SORTE_PHASES } from './constants';
// Helpers
import * as utils from '../../utils';
import { Clover, Leaf, LeafId } from './types';
import { getRandomItems } from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @returns phase
 */
export const determineNextPhase = (currentPhase: string): string => {
  const { RULES, SETUP, WORD_SELECTION, CLOVER_WRITING, CLOVER_GUESSING, RESULTS, GAME_OVER } =
    TREVO_DA_SORTE_PHASES;
  const order = [RULES, SETUP, WORD_SELECTION, CLOVER_WRITING, CLOVER_GUESSING, RESULTS, GAME_OVER];

  // if (currentPhase === CLOVER_GUESSING) {
  //   return triggerLastRound || roundsToEndGame <= 0 ? GAME_OVER : WORD_SELECTION;
  // }

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
    const leaves = selectedChunks.reduce((acc: Record<LeafId, Leaf>, entry) => {
      const leafId: LeafId = entry.map((card) => card.id.split('-')[1]).join('-');
      const leaf: Leaf = {
        id: leafId,
        cards: entry,
        rotation: utils.game.getRandomItem(ROTATIONS),
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
      guess: {
        A: null,
        B: null,
        C: null,
        D: null,
      },
      tries: 0,
    };

    player.clover = clover;
  });
};
