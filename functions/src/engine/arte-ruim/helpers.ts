// Interfaces
import { PlainObject, Players } from '../../utils/interfaces';
import { ArteRuimCard, ArteRuimCardsDatabase, ArteRuimDrawing, FirebaseStoreData } from './interfaces';
// Constants
import { ARTE_RUIM_PHASES, MAX_ROUNDS, DECK_ORDER_BY_LEVEL, GAME_OVER_SCORE_THRESHOLD } from './constants';
// Helpers
import * as gameUtils from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  currentRound: number,
  isGameOver?: boolean
): string => {
  const { RULES, SETUP, DRAW, EVALUATION, GALLERY, GAME_OVER } = ARTE_RUIM_PHASES;
  const order = [RULES, SETUP, DRAW, EVALUATION, GALLERY];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === GALLERY) {
    return currentRound >= MAX_ROUNDS ? GAME_OVER : DRAW;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return DRAW;
};

/**
 * Determine if a player has passed max points and it should be game over
 * @param players
 * @returns
 */
export const determineGameOver = (players: Players) => {
  return Object.values(players).some((player) => player.score >= GAME_OVER_SCORE_THRESHOLD);
};

/**
 * Filters used cards off the deck
 * @param fullDeck
 * @param usedCardsIds
 * @returns
 */
export const filterAvailableCards = (
  fullDeck: ArteRuimCardsDatabase,
  usedCardsIds: string[]
): ArteRuimCard[] => {
  return Object.values(fullDeck).filter((entry) => !usedCardsIds.includes(entry.id));
};

/**
 * Builds the deck as evenly as possible with cards needed per level
 * @param fullDeckData
 * @param perLevel
 * @returns
 */
export const buildDeck = (
  deckData: ArteRuimCard[],
  perLevel: PlainObject,
  perRound: number
): ArteRuimCard[] => {
  // Split in levels
  const cardsPerLevel = deckData.reduce(
    (acc, entry: any) => {
      acc[entry.level].push(entry);
      return acc;
    },
    {
      1: [],
      2: [],
      3: [],
    }
  );

  // Shuffle decks and verify if number of cards will be sufficient
  const willLevelNeedExtraCards = {};
  Object.keys(cardsPerLevel).forEach((level) => {
    cardsPerLevel[level] = gameUtils.shuffle(cardsPerLevel[level]);
    willLevelNeedExtraCards[level] = cardsPerLevel[level] < perLevel[level];
  });

  const getAvailableDeck = (deck: ArteRuimCard[], level: number, decks) => {
    let activeDeck = deck;
    let activeLevel = level;
    while (activeDeck.length === 0) {
      activeLevel = decks[level - 1].length ? level - 1 : 3;
      activeDeck = decks[activeLevel];
    }
    return activeDeck;
  };

  const distributedCards = [3, 2, 1].map((level) => {
    let cards = cardsPerLevel[level];
    const newDeck = new Array(perLevel[level]).fill(0).map(() => {
      if (!cards.length) {
        cards = getAvailableDeck(cards, level, cardsPerLevel);
      }
      return cards.pop();
    });
    return newDeck;
  });

  const deck: ArteRuimCard[] = [];

  DECK_ORDER_BY_LEVEL.forEach((deckLevel) => {
    const distributedCardsIndex = Math.abs(deckLevel - 3);
    for (let i = 0; i < perRound; i++) {
      deck.push(distributedCards[distributedCardsIndex].pop());
    }
  });

  return deck;
};

/**
 * Determine the number of cards in a round
 * @param players
 * @returns
 */
export const determineNumberOfCards = (playerCount: number): number => {
  if (playerCount < 5) {
    return 7;
  }
  return playerCount + 2;
};

/**
 * Deal cards for the current round
 * @param players - it modifies players
 * @param store - it modifies store
 */
export const dealCards = (players: Players, store: FirebaseStoreData) => {
  const playersArray = Object.values(players);
  const numberOfCards = determineNumberOfCards(playersArray.length);

  store.currentCards = new Array(numberOfCards).fill(0).map((i, index) => {
    const currentPlayerId = playersArray?.[index]?.id ?? null;
    const card = {
      ...store.deck.pop(),
      drawing: null,
      successRate: i,
      playerId: currentPlayerId,
    };

    if (currentPlayerId) {
      players[currentPlayerId].currentCard = card;
    }

    return card;
  });
};

/**
 * Build gallery
 * @param drawings
 * @param players
 * @returns
 */
export const buildGallery = (drawings: ArteRuimDrawing[], players: Players) =>
  drawings.map((drawingEntry) => {
    const correctAnswer = `${drawingEntry.id}`;
    const artist = drawingEntry.playerId;

    const newGalleryEntry = {
      id: drawingEntry.id,
      drawing: drawingEntry.drawing,
      artist: drawingEntry.playerId,
      level: drawingEntry.level,
      text: drawingEntry.text,
      playersSay: {},
      playersPoints: {},
    };

    const playersSay = {};
    const playersPoints = {};

    Object.entries(<PlainObject>players).forEach(([playerId, pObject]) => {
      if (artist === playerId) return;

      if (artist) {
        // Calculate what players say
        const currentVote = pObject.votes[correctAnswer];
        if (playersSay[currentVote] === undefined) {
          playersSay[currentVote] = [];
        }
        playersSay[currentVote].push(playerId);
        // Calculate player points
        if (playersPoints[playerId] === undefined) {
          playersPoints[playerId] = 0;
        }
        if (playersPoints?.[artist] === undefined) {
          playersPoints[artist] = 0;
        }

        if (currentVote === correctAnswer) {
          playersPoints[playerId] += 2;
          playersPoints[artist] += 1;
        }
      }
    });
    newGalleryEntry.playersSay = playersSay;
    newGalleryEntry.playersPoints = playersPoints;
    return newGalleryEntry;
  });

/**
 * Build round ranking
 * @param players - it modifies players
 * @param gallery
 * @returns
 */
export const buildRanking = (players: Players, gallery: PlainObject) => {
  // Format <player>: [<old score>, <addition points>, <new score>]
  const newScores: PlainObject = {};

  // Build score object
  Object.values(players).forEach((player) => {
    newScores[player.id] = [player.score, 0, player.score];
  });

  gallery.forEach((window) => {
    Object.entries(window.playersPoints).forEach(([playerId, value]) => {
      const points = Number(value ?? 0);
      newScores[playerId][1] += points;
      newScores[playerId][2] += points;

      players[playerId].score += points;
    });
  });

  const ranking = Object.entries(newScores)
    .map(([playerId, scores]) => {
      return {
        playerId,
        name: players[playerId].name,
        previousScore: scores[0],
        gainedPoints: scores[1],
        newScore: scores[2],
      };
    })
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));

  return ranking;
};

/**
 * Builds list of past drawings
 * @param players
 * @param gallery
 * @returns
 */
export const getNewPastDrawings = (players: Players, gallery) => {
  const playerCount = Object.keys(players).length;
  // Remove currentCard from players and add it to past drawings in the store
  return Object.values(players).map((playerData) => {
    const card = playerData.currentCard;
    // Get playersSay from gallery and calculate success rate
    const galleryEntry = gallery.find((e) => e.id === card.id);
    const correctAnswers = galleryEntry.playersSay?.[card.id]?.length ?? 0;

    card.successRate = Math.round((100 * correctAnswers) / (playerCount - 1)) / 100;
    return card;
  });
};

/**
 * Creates a dictionary with used card ids
 * @param drawings
 * @returns
 */
export const buildUsedCardsIdsDict = (drawings: ArteRuimDrawing[]) => {
  return drawings.reduce((acc, drawing) => {
    acc[drawing.id] = true;
    return acc;
  }, {});
};

export const buildPastDrawingsDict = (drawings, publicDrawings) => {
  const newDrawings = { ...publicDrawings };

  drawings.forEach((drawing) => {
    if (newDrawings[drawing.id] === undefined) {
      newDrawings[drawing.id] = {
        id: drawing.id,
        level: drawing.level,
        text: drawing.text,
        entries: [],
      };
    }

    newDrawings[drawing.id].entries.push(
      JSON.stringify({
        playerId: drawing.playerId,
        createdAt: Date.now(),
        drawing: drawing.drawing,
        successRate: drawing.successRate,
      })
    );
  });

  return newDrawings;
};
