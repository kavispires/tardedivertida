// Types
import type { TextCard } from '../../types/tdr';
import type { AllWords, FirebaseStoreData, GaleriaDeSonhosAchievement, ImageCard, PlayerCard } from './types';
// Constants
import { GALERIA_DE_SONHOS_ACHIEVEMENTS, GALERIA_DE_SONHOS_PHASES, WORD_DECK_TOTAL } from './constants';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, WORD_SELECTION, DREAMS_SELECTION, CARD_PLAY, RESOLUTION, GAME_OVER } =
    GALERIA_DE_SONHOS_PHASES;
  const order = [RULES, SETUP, WORD_SELECTION, DREAMS_SELECTION, CARD_PLAY, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
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
  startingIndex: number,
): ImageCard[] => {
  for (let i = 0; i < newEntries.length; i++) {
    table[i + startingIndex] = newEntries[i];
  }
  return table;
};

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
    // biome-ignore lint/performance/noDelete: firebase does not accept undefined values
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
  const selectedWords = wordsDeck.splice(0, 3);
  return [wordsDeck, selectedWords];
};

export const buildRanking = (players: Players, store: FirebaseStoreData, playerInNightmareId?: PlayerId) => {
  const listOfPlayers = utils.players.getListOfPlayers(players);
  // Gained points: super sparks, sparks, nightmare
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  listOfPlayers.forEach((player) => {
    let scoringCardsCount = 0;
    let noMatch = 0;

    const cards: PlayerCard[] = Object.values(player.cards);
    // Achievement: dreamCount
    utils.achievements.increase(store, player.id, 'dreamCount', cards.length);
    cards.forEach((card: PlayerCard) => {
      if (card.score === 3) {
        scores.add(player.id, 3, 0);
        scoringCardsCount += 1;
        // Achievement: matches, pairs
        utils.achievements.increase(store, player.id, 'matches', 1);
        utils.achievements.increase(store, player.id, 'pairs', 1);
      } else if (card.score === 2) {
        scores.add(player.id, 2, 1);
        scoringCardsCount += 1;
        // Achievement: matches
        utils.achievements.increase(store, player.id, 'matches', card.matchedPlayers.length - 1);
      } else {
        noMatch += 1;
      }
    });

    // Achievement: noMatches
    utils.achievements.increase(store, player.id, 'noMatches', noMatch);
    // Achievement: zeroMatches
    if (noMatch === cards.length) {
      utils.achievements.increase(store, player.id, 'zeroMatches', 1);
    }
    // Achievement: fullMatches
    if (noMatch === 0) {
      utils.achievements.increase(store, player.id, 'fullMatches', 1);
    }
    // Achievement: nightmare
    if (player.id === playerInNightmareId) {
      utils.achievements.increase(store, player.id, 'nightmare', 1);
    }
    // Achievement: falls
    if (player.fallen) {
      utils.achievements.increase(store, player.id, 'falls', 1);
    }

    // Fallen player penalty
    const shouldLosePoints = player.id === playerInNightmareId && player.fallen;
    if (scoringCardsCount > 0 && shouldLosePoints) {
      scores.subtract(player.id, scoringCardsCount, 2);
    }
  });
  return scores.rank(players);
};

export const getPlayersWithMaxDreams = (players: Players) => {
  // Count selected cards per player
  const cardCount = utils.players
    .getListOfPlayers(players)
    .reduce((acc: NumberDictionary, player: PlainObject) => {
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
  const cardMatches: Collection<PlayerId[]> = {};

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
      .reduce((acc: Collection<PlayerCard>, cardId: CardId) => {
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

    bot.cards = mostMatchedCards.reduce((acc: Collection<PlayerCard>, cardId: CardId) => {
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

    bot.cards = selectedTable.reduce((acc: Collection<PlayerCard>, card: ImageCard) => {
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

/**
 * Get achievements:
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<GaleriaDeSonhosAchievement>[] = [];

  // Most Matches: Matched with the most number of players
  const { most, least } = utils.achievements.getMostAndLeastOf(store, 'matches');
  if (most) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.MOST_MATCHES,
      playerId: most.playerId,
      value: most.value,
    });
  }

  // Fewest Matches: Matched with the fewest number of players
  if (least) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.FEWEST_MATCHES,
      playerId: least.playerId,
      value: least.value,
    });
  }

  // Full Matches: Matched all their cards most times
  const { most: fullMatches } = utils.achievements.getMostAndLeastOf(store, 'fullMatches');
  if (fullMatches) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.MOST_FULL_MATCHES,
      playerId: fullMatches.playerId,
      value: fullMatches.value,
    });
  }

  // Most visits: visited the most number of cards
  const { most: mostDreamCount, least: fewestDreamCount } = utils.achievements.getMostAndLeastOf(
    store,
    'dreamCount',
  );
  if (mostDreamCount) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.MOST_VISITS,
      playerId: mostDreamCount.playerId,
      value: mostDreamCount.value,
    });
  }

  // Least Adventurous: visited the fewest number of cards
  if (fewestDreamCount) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.LEAST_ADVENTUROUS,
      playerId: fewestDreamCount.playerId,
      value: fewestDreamCount.value,
    });
  }

  // Most Adventurous: was in a nightmare the most times
  const { most: nightmare } = utils.achievements.getMostAndLeastOf(store, 'nightmare');
  if (nightmare) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.MOST_ADVENTUROUS,
      playerId: nightmare.playerId,
      value: nightmare.value,
    });
  }

  // Most Pairs: found only another player most times
  const { most: pairs } = utils.achievements.getMostAndLeastOf(store, 'pairs');
  if (pairs) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.MOST_PAIRS,
      playerId: pairs.playerId,
      value: pairs.value,
    });
  }

  // Most Out of the Box: Got the most no matches
  const { most: outOfTheBox } = utils.achievements.getMostAndLeastOf(store, 'noMatches');
  if (outOfTheBox) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.MOST_OUT_OF_THE_BOX,
      playerId: outOfTheBox.playerId,
      value: outOfTheBox.value,
    });
  }

  // Most Zero matches
  const { most: lonely } = utils.achievements.getMostAndLeastOf(store, 'zeroMatches');
  if (lonely) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.MOST_LONELY,
      playerId: lonely.playerId,
      value: lonely.value,
    });
  }

  // Poorest choices: has fallen the most
  const { most: falls, least: smart } = utils.achievements.getMostAndLeastOf(store, 'falls');
  if (falls) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.POOREST_CHOICES,
      playerId: falls.playerId,
      value: falls.value,
    });
  }

  // Smartest choices: has fallen the least times
  if (smart) {
    achievements.push({
      type: GALERIA_DE_SONHOS_ACHIEVEMENTS.SMARTEST_CHOICES,
      playerId: smart.playerId,
      value: smart.value,
    });
  }

  return achievements;
};
