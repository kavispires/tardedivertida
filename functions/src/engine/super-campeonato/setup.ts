// Constants
import {
  CHALLENGES_PER_GAME,
  CHALLENGES_PER_ROUND,
  CONTENDERS_PER_PLAYER,
  SUPER_CAMPEONATO_PHASES,
  TOTAL_ROUNDS,
} from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import * as utils from '../../utils';
import { getMostVotedChallenge, getTableContenders } from './helpers';

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
  // Get 10 challenges
  const deck = utils.game.getRandomItems(resourceData.challenges, CHALLENGES_PER_GAME);

  // Give contenders to each player
  const contendersDeck = utils.game.shuffle(resourceData.contenders);
  utils.players.dealItemsToPlayers(players, contendersDeck, CONTENDERS_PER_PLAYER, 'contenders');

  // Get extra contenders to the table in cases there are less than 8 players
  const tableContenders = getTableContenders(contendersDeck, players, store.language);

  // Save
  return {
    update: {
      players,
      store: {
        deck,
        deckIndex: 0,
        tableContenders,
      },
      state: {
        phase: SUPER_CAMPEONATO_PHASES.SETUP,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
      },
    },
  };
};

export const prepareChallengeSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Get the two challenges
  const challenges = [store.deck[store.deckIndex], store.deck[store.deckIndex + 1]];

  // Save
  return {
    update: {
      store: {
        deckIndex: store.deckIndex + CHALLENGES_PER_ROUND,
      },
      state: {
        phase: SUPER_CAMPEONATO_PHASES.CHALLENGE_SELECTION,
        round: utils.helpers.increaseRound(state.round),
        challenges,
      },
      players,
    },
  };
};

export const prepareContenderSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const challenge = getMostVotedChallenge(players, state.challenges);

  // Save
  return {
    update: {
      store: {
        deckIndex: store.deckIndex + CHALLENGES_PER_ROUND,
      },
      state: {
        phase: SUPER_CAMPEONATO_PHASES.CONTENDER_SELECTION,
        challenges: utils.firebase.deleteValue(),
        challenge,
      },
      players,
    },
  };
};
