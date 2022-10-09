// Types
import type { AllWords, ImageCard, PlayerCard } from './types';
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
  const listOfPlayers = utils.players.getListOfPlayers(players);
  // Gained points: super sparks, sparks, nightmare
  const newScores = utils.helpers.buildNewScoreObject(listOfPlayers, [0, 0, 0]);

  listOfPlayers.forEach((player) => {
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

/**
 * Simulate player cards for bots based on other players choices:
 * - 1 card with the most matches (between all players)
 * - 1 card for each player
 * - 4 random cards
 * @param players
 * @table
 */
export const simulateBotCards = (players: Players, table: ImageCard[]) => {
  const playersCount = utils.players.getListOfPlayers(players).length;
  const cardMatches: Record<CardId, PlayerId[]> = {};

  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.keys(player.cards).forEach((cardId) => {
      if (cardMatches[cardId] === undefined) {
        cardMatches[cardId] = [];
      }
      cardMatches[cardId].push(player.id);
    });
  });

  let mostMatchCount = 1;
  let mostMatchedCards: CardId[] = [];
  const singleMatchedCards: Record<PlayerId, CardId> = {};
  Object.keys(cardMatches).forEach((cardId) => {
    const entry = cardMatches[cardId];
    const count = entry.length;
    // One single card per player
    if (count === 1 && singleMatchedCards[entry[0]] === undefined) {
      singleMatchedCards[entry[0]] = cardId;
    }

    if (count > mostMatchCount) {
      mostMatchCount = count;
      mostMatchedCards = [cardId];
    } else if (count === mostMatchCount) {
      mostMatchedCards.push(cardId);
    }
  });

  const bots = utils.players.getListOfBots(players);

  // METHOD BOT A: matches with one card only selected by each player (N)
  const singleMatchedCardIds = Object.values(singleMatchedCards);
  if (bots[0] && singleMatchedCardIds.length > 1) {
    const bot = bots[0];

    bot.cards = utils.game
      .getRandomItems(singleMatchedCardIds, Math.min(singleMatchedCardIds.length, playersCount))
      .reduce((acc: Record<CardId, PlayerCard>, cardId: CardId) => {
        const entry: PlayerCard = {
          cardId,
          used: false,
          matchedPlayers: [],
          score: 0,
        };

        acc[cardId] = entry;

        return acc;
      }, {});
  }

  // METHOD BOT B: matches with the most matched cards (?)
  if (bots[1] && mostMatchedCards.length >= 1) {
    const bot = bots[1];

    bot.cards = mostMatchedCards.reduce((acc: Record<CardId, PlayerCard>, cardId: CardId) => {
      const entry: PlayerCard = {
        cardId,
        used: false,
        matchedPlayers: [],
        score: 0,
      };

      acc[cardId] = entry;

      return acc;
    }, {});
  }

  // METHOD BOT C: Randomly selects 4 cards
  if (bots[2]) {
    const bot = bots[2];

    const selectedTable = utils.game.getRandomItems(table, 4);

    bot.cards = selectedTable.reduce((acc: Record<CardId, PlayerCard>, card: ImageCard) => {
      const entry: PlayerCard = {
        cardId: card.id,
        used: false,
        matchedPlayers: [],
        score: 0,
      };

      acc[card.id] = entry;

      return acc;
    }, {});
  }
};
