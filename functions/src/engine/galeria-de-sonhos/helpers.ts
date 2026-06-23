// Types
import type { TextCardData } from '../../types/tdr';
import type { AllWords, FirebaseStoreData, ImageCard, PlayerCard } from './types';
import { sampleSize } from 'lodash';
// Constants
import { GALERIA_DE_SONHOS_PHASES, WORD_DECK_TOTAL } from './constants';
// Utils
import utils from '../../utils';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, WORD_SELECTION, DREAMS_SELECTION, CARD_PLAY, RESOLUTION, GAME_OVER } =
    GALERIA_DE_SONHOS_PHASES;
  const order = [SETUP, WORD_SELECTION, DREAMS_SELECTION, CARD_PLAY, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : WORD_SELECTION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

const replaceTableCards = (
  table: ImageCard[],
  newEntries: ImageCard[],
  startingIndex: number,
): ImageCard[] => {
  for (let i = 0; i < newEntries.length; i++) {
    table[i + startingIndex] = newEntries[i];
  }
  return table;
};

/**
 * Builds the table by adding new cards and replacing old ones based on the round
 * @param deck - The deck of image cards
 * @param table - The current table of image cards
 * @param currentRound - The current round number
 */
export const buildTable = (
  deck: ImageCard[],
  table: ImageCard[],
  currentRound: number,
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

/**
 * Builds a deck from all available words by sampling
 * @param allWords - The dictionary of all available words
 */
export const buildDeck = (allWords: AllWords): TextCardData[] => {
  return sampleSize(Object.values(allWords), WORD_DECK_TOTAL);
};

/**
 * Gets words for the current round by drawing from the deck
 * @param wordsDeck - The deck of word cards
 */
export const getRoundWords = (wordsDeck: TextCardData[]): [TextCardData[], TextCardData[]] => {
  const selectedWords = wordsDeck.splice(0, 3);
  return [wordsDeck, selectedWords];
};

/**
 * Builds player rankings based on card matches and nightmare penalties
 * @param players - The collection of players in the game
 * @param store - The Firebase store data for tracking achievements
 * @param playerInNightmareId - Optional ID of the player having a nightmare
 */
export const buildRanking = (players: Players, store: FirebaseStoreData, playerInNightmareId?: UID) => {
  const listOfPlayers = utils.players.getListOfPlayers(players);
  // Gained points: super sparks, sparks, nightmare
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  listOfPlayers.forEach((player) => {
    let scoringCardsCount = 0;
    let noMatch = 0;

    const cards: PlayerCard[] = Object.values(player.cards);
    // Achievement: dreamCount
    increaseAchievement(store.achievements, player.id, 'dreamCount', cards.length);
    cards.forEach((card: PlayerCard) => {
      if (card.score === 3) {
        scores.add(player.id, 3, 0);
        scoringCardsCount += 1;
        // Achievement: matches, pairs
        increaseAchievement(store.achievements, player.id, 'matches', 1);
        increaseAchievement(store.achievements, player.id, 'pairs', 1);
      } else if (card.score === 2) {
        scores.add(player.id, 2, 1);
        scoringCardsCount += 1;
        // Achievement: matches
        increaseAchievement(store.achievements, player.id, 'matches', card.matchedPlayers.length - 1);
      } else {
        noMatch += 1;
      }
    });

    // Achievement: noMatches
    increaseAchievement(store.achievements, player.id, 'noMatches', noMatch);
    // Achievement: zeroMatches
    if (noMatch === cards.length) {
      increaseAchievement(store.achievements, player.id, 'zeroMatches', 1);
    }
    // Achievement: fullMatches
    if (noMatch === 0) {
      increaseAchievement(store.achievements, player.id, 'fullMatches', 1);
    }
    // Achievement: nightmare
    if (player.id === playerInNightmareId) {
      increaseAchievement(store.achievements, player.id, 'nightmare', 1);
    }
    // Achievement: falls
    if (player.fallen) {
      increaseAchievement(store.achievements, player.id, 'falls', 1);
    }

    // Fallen player penalty
    const shouldLosePoints = player.id === playerInNightmareId && player.fallen;
    if (scoringCardsCount > 0 && shouldLosePoints) {
      scores.subtract(player.id, scoringCardsCount, 2);
    }
  });
  return scores.rank(players);
};

/**
 * Gets the IDs of players who have the maximum number of dream cards
 * @param players - The collection of players in the game
 */
export const getPlayersWithMaxDreams = (players: Players) => {
  // Count selected cards per player
  const cardCount = utils.players
    .getListOfPlayers(players)
    .reduce((acc: Dictionary<number>, player: PlainObject) => {
      acc[player.id] = Object.keys(player.cards).length;
      return acc;
    }, {});

  // Check if anybody is having a nightmare (in the dark) (uniquely most cards)
  const maxDreamCount = Math.max(...Object.values(cardCount));

  return Object.entries(cardCount).reduce((acc: UID[], [playerId, quantity]: [UID, number]) => {
    if (quantity === maxDreamCount) {
      acc.push(playerId);
    }
    return acc;
  }, []);
};

/**
 * Gets the most voted cards for a given word
 * @param table - The array of image cards on the table
 * @param word - The word card being matched
 */
export const getMostVotedCards = (table: ImageCard[], word: TextCardData): ImageCard[] => {
  const mostNumberOfMatches = Math.max(...table.map((entry) => entry?.matchedPlayers?.length ?? 0));

  return table
    .filter((entry) => entry?.matchedPlayers?.length === mostNumberOfMatches)
    .map((entry) => ({ ...entry, text: word.text }));
};

/**
 * Simulates bot card selections based on player choices and matching patterns
 * @param players - The collection of players in the game
 * @param table - The array of image cards on the table
 */
export const simulateBotCards = (players: Players, table: ImageCard[]) => {
  const playersCount = utils.players.getListOfPlayers(players).length;
  const cardMatches: Dictionary<UID[]> = {};

  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.keys(player.cards).forEach((cardId) => {
      if (cardMatches[cardId] === undefined) {
        cardMatches[cardId] = [];
      }
      cardMatches[cardId].push(player.id);
    });
  });

  let mostMatchCount = 1;
  let mostMatchedCards: UID[] = [];
  const singleMatchedCards: Record<UID, UID> = {};
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

    bot.cards = utils.helpers;
    sampleSize(singleMatchedCardIds, Math.min(singleMatchedCardIds.length, playersCount)).reduce(
      (acc: Dictionary<PlayerCard>, cardId: UID) => {
        const entry: PlayerCard = {
          cardId,
          used: false,
          matchedPlayers: [],
          score: 0,
        };

        acc[cardId] = entry;

        return acc;
      },
      {},
    );
  }

  // METHOD BOT B: matches with the most matched cards (?)
  if (bots[1] && mostMatchedCards.length >= 1) {
    const bot = bots[1];

    bot.cards = mostMatchedCards.reduce((acc: Dictionary<PlayerCard>, cardId: UID) => {
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

    const selectedTable = sampleSize(table, 4);

    bot.cards = selectedTable.reduce((acc: Dictionary<PlayerCard>, card: ImageCard) => {
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
