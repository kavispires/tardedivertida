// Types
import { NumberDictionary, PlainObject, PlayerId, Players, Round } from '../../utils/types';
import { AllWords, ImageCard, PlayerCard } from './types';
import { TextCard } from '../../utils/tdr';
// Constants
import { GALERIA_DE_SONHOS_PHASES, WORD_DECK_TOTAL } from './constants';
// Utils
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, WORD_SELECTION, DREAMS_SELECTION, CARD_PLAY, RESOLUTION, GAME_OVER } =
    GALERIA_DE_SONHOS_PHASES;
  const order = [RULES, SETUP, WORD_SELECTION, DREAMS_SELECTION, CARD_PLAY, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return triggerLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : WORD_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return WORD_SELECTION;
};

const replaceTableCards = (
  table: ImageCard[],
  newEntries: ImageCard[],
  startingIndex: number
): ImageCard[] => {
  for (let i = 0; i < newEntries.length; i++) {
    table[i + startingIndex] = newEntries[i];
  }
  return table;
};

export const buildTable = (
  deck: ImageCard[],
  table: ImageCard[],
  currentRound: number
): [ImageCard[], ImageCard[]] => {
  if (currentRound === 1) {
    // Add 15 cards to table
    const newTable = deck.splice(0, 15);
    return [deck, newTable];
  }

  const newImages = deck.splice(0, 5);
  const startingIndexByRound = [0, 0, 10, 5, 0];
  const newTable = replaceTableCards(table, newImages, startingIndexByRound[currentRound]);
  const newCleanTable = newTable.map((card) => {
    delete card.matchedPlayers;
    card.used = false;
    return card;
  });
  return [deck, newCleanTable];
};

export const buildDeck = (allWords: AllWords): TextCard[] => {
  return utils.game.getRandomItems(Object.values(allWords), WORD_DECK_TOTAL);
};

export const getRoundWords = (wordsDeck: TextCard[]): [TextCard[], TextCard[]] => {
  const selectedWords = wordsDeck.splice(0, 2);
  return [wordsDeck, selectedWords];
};

export const buildRanking = (players: Players, playerInNightmareId?: PlayerId) => {
  // Gained points: super sparks, sparks, nightmare
  const newScores = utils.helpers.buildNewScoreObject(players, [0, 0, 0]);

  Object.values(players).forEach((player) => {
    let scoringCardsCount = 0;

    const cards: PlayerCard[] = Object.values(player.cards);
    cards.forEach((card: PlayerCard) => {
      if (card.score === 3) {
        newScores[player.id].gainedPoints[0] += 3;
        players[player.id].score += 3;
        newScores[player.id].newScore += 3;
        scoringCardsCount += 1;
      } else if (card.score === 2) {
        newScores[player.id].gainedPoints[1] += 2;
        players[player.id].score += 2;
        newScores[player.id].newScore += 2;
        scoringCardsCount += 1;
      }
    });

    // Fallen player penalty
    const shouldLosePoints = player.id === playerInNightmareId && player.fallen;
    if (scoringCardsCount > 0 && shouldLosePoints) {
      newScores[player.id].gainedPoints[2] -= scoringCardsCount;
      newScores[player.id].newScore -= scoringCardsCount;
      players[player.id].score -= scoringCardsCount;
    }
  });

  return Object.values(newScores).sort((a, b) => (a.newScore > b.newScore ? 1 : -1));
};

export const getPlayersWithMaxDreams = (players: Players) => {
  // Count selected cards per player
  const cardCount = Object.values(players).reduce((acc: NumberDictionary, player: PlainObject) => {
    acc[player.id] = Object.keys(player.cards).length;
    return acc;
  }, {});

  // Check if anybody is having a nightmare (in the dark) (uniquely most cards)
  const maxDreamCount = Math.max(...Object.values(cardCount));

  return Object.entries(cardCount).reduce((acc: PlayerId[], [playerId, quantity]: [PlayerId, number]) => {
    if (quantity === maxDreamCount) {
      acc.push(playerId);
    }
    return acc;
  }, []);
};

export const getMostVotedCards = (table: ImageCard[], word: TextCard): ImageCard[] => {
  const mostNumberOfMatches = Math.max(...table.map((entry) => entry?.matchedPlayers?.length ?? 0));

  return table
    .filter((entry) => entry?.matchedPlayers?.length === mostNumberOfMatches)
    .map((entry) => ({ ...entry, text: word.text }));
};
