// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { CRIMES_HEDIONDOS_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import { GameId, Language, Players } from '../../utils/types';
// Utils
import * as utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { CrimesHediondosInitialState, CrimesHediondosSubmitAction } from './types';
import {
  prepareCrimeSelectionPhase,
  prepareSceneMarkingPhase,
  prepareGuessingPhase,
  prepareGameOverPhase,
  prepareRevealPhase,
  prepareSetupPhase,
} from './setup';
import { getData } from './data';
import { handleSubmitCrime, handleSubmitMark, handleSubmitGuesses } from './actions';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (
  gameId: GameId,
  uid: string,
  language: Language
): CrimesHediondosInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.CRIMES_HEDIONDOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: CRIMES_HEDIONDOS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      language,
      scenes: [],
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    'prepare next phase'
  );

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // SETUP -> CRIME_SELECTION
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.CRIME_SELECTION) {
    const newPhase = await prepareCrimeSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // * -> SCENE_MARKING
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.SCENE_MARKING) {
    const newPhase = await prepareSceneMarkingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // SCENE_MARKING -> GUESSING
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions
 * May trigger next phase
 */
export const submitAction = async (data: CrimesHediondosSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_CRIME':
      utils.firebase.validateSubmitActionProperties(
        data,
        ['weaponId', 'evidenceId', 'causeOfDeath', 'reasonForEvidence', 'locationTile', 'locationIndex'],
        'submit crime'
      );
      return handleSubmitCrime(collectionName, gameId, playerId, data);
    case 'SUBMIT_MARK':
      utils.firebase.validateSubmitActionProperties(data, ['sceneIndex'], 'submit scene mark');
      return handleSubmitMark(collectionName, gameId, playerId, data.sceneId, data.sceneIndex);
    case 'SUBMIT_GUESSES':
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit guess');
      return handleSubmitGuesses(collectionName, gameId, playerId, data.guesses);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
