// Types
import { CaptchaCard, FirebaseStateData, FirebaseStoreData, ResourceData, Robot } from './types';
// Constants
import {
  MAX_ROUNDS,
  MIN_ROUND_CARDS,
  NAO_SOU_ROBO_PHASES,
  OUTCOME,
  ROBOT_GOAL,
  ROUND_TYPES,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Utils
import utils from '../../utils';
import { calculateResults, distributeCards, getAchievements } from './helpers';
// import { saveData } from './data';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, store, {
    robot: 0,
    aloneCorrect: 0,
    aloneIncorrect: 0,
  });

  // Distribute images and starting hands
  distributeCards(store, players, resourceData.images);

  // Get robot cards
  const botDeck = resourceData.botCards;
  // Build word pool
  const pool = utils.game.makeArray(MAX_ROUNDS).reduce((acc, _, i) => {
    const roundType = ROUND_TYPES[i % ROUND_TYPES.length];
    if (['words', 'adjectives', 'emojis'].includes(roundType)) {
      acc[i + 1] = {
        round: i + 1,
        roundType,
        values: resourceData[roundType].pop(),
      };
    }

    if (roundType === 'glyphs') {
      const values: number[] = [];
      values.push(resourceData.glyphs.pop() as number);
      values.push(resourceData.glyphs.pop() as number);
      values.push(resourceData.glyphs.pop() as number);
      acc[i + 1] = {
        round: i + 1,
        roundType,
        values,
      };
    }

    return acc;
  }, {});

  utils.players.addPropertiesToPlayers(players, { suspicion: [], beat: [] });

  const robot: Robot = {
    points: 0,
    goal: ROBOT_GOAL,
    state: 0,
    beat: 0,
  };

  // Save
  return {
    update: {
      store: {
        ...store,
        achievements,
        botDeck,
        pool,
        gallery: [],
      },
      state: {
        phase: NAO_SOU_ROBO_PHASES.SETUP,
        players,
        robot,
        outcome: OUTCOME.CONTINUE,
      },
    },
  };
};

export const prepareCardSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['guess', 'cardId']);

  // Deal one card per player
  utils.deck.deal(store, players, 1);

  const round = utils.helpers.increaseRound(state.round);

  const captcha = store.pool[round.current];

  return {
    update: {
      store: store,
      state: {
        phase: NAO_SOU_ROBO_PHASES.CARD_SELECTION,
        round,
        players,
        captcha,
      },
      storeCleanup: ['result', 'ranking'],
    },
  };
};

export const prepareAreYouARobotPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const playerCards: CaptchaCard[] = utils.players.getListOfPlayers(players).map((player) => {
    utils.deck.discard(store, players, player.id, player.cardId);
    return {
      id: player.cardId,
      players: [],
      bot: false,
      playerId: player.id,
    };
  });
  const robotCardsNeeded = Math.max(MIN_ROUND_CARDS - playerCards.length, 1);
  const botCards: CaptchaCard[] = [];
  utils.game.makeArray(robotCardsNeeded).forEach(() => {
    const cardId = store.botDeck.pop() as ImageCardId;
    botCards.push({
      id: cardId,
      players: [],
      bot: true,
    });
  });

  const options = utils.helpers.buildObjectFromList([...playerCards, ...botCards]);

  return {
    update: {
      store: {
        ...store,
      },
      state: {
        phase: NAO_SOU_ROBO_PHASES.ARE_YOU_A_ROBOT,
        players,
        options,
        robot: {
          ...state.robot,
        },
        selectionCount: utils.players.getPlayerCount(players),
      },
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const { ranking, robot, result, outcome } = calculateResults(
    players,
    state.robot,
    state.options,
    state.captcha,
    store
  );

  const gallery = store.gallery ?? [];
  gallery.push(result);

  return {
    update: {
      store: {
        ...store,
        gallery,
      },
      state: {
        phase: NAO_SOU_ROBO_PHASES.RESULTS,
        players,
        ranking,
        robot,
        outcome,
        result,
      },
      stateCleanup: ['options', 'captcha'],
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.NAO_SOU_ROBO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = store.gallery;

  // Save data (words, adjectives, imageCards)
  // await saveData(state.language, gallery);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: NAO_SOU_ROBO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        gallery,
        outcome: state.outcome,
      },
    },
  };
};
