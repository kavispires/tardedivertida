// Types
import type {
  CrimesHediondosInitialState,
  CrimesHediondosOptions,
  CrimesHediondosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { CRIMES_HEDIONDOS_ACTIONS, CRIMES_HEDIONDOS_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Mechanics
import { addBots } from '../../mechanics/players';
import { getDefaultInitialState } from '../../mechanics/session';
// Internal
import { handleSubmitCrime, handleSubmitMark, handleSubmitGuesses } from './actions';
import { getData } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareCrimeSelectionPhase,
  prepareSceneMarkingPhase,
  prepareGuessingPhase,
  prepareGameOverPhase,
  prepareRevealPhase,
  prepareSetupPhase,
} from './setup';

/**
 * Gets the initial state for a new game session
 * @param gameId - The game session ID
 * @param uid - The user ID of the game creator
 * @param language - The language code
 * @param version - The game version
 * @param options - Optional game configuration options
 */
export const getInitialState = (
  gameId: UID,
  uid: string,
  language: Language,
  version: string,
  options: CrimesHediondosOptions,
): CrimesHediondosInitialState => {
  return getDefaultInitialState<CrimesHediondosInitialState>({
    gameId,
    gameName: GAME_NAMES.CRIMES_HEDIONDOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: TOTAL_ROUNDS,
    store: {
      scenes: {},
    },
    options,
    onCreate: () => {
      const players: Players = {};
      if (options.withBots) {
        addBots(players, language, 2);
      }
      return {
        players,
      };
    },
  });
};

/**
 * Gets the player count requirements for the game
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

/**
 * Handles phase progression and prepares the next game phase
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 */
export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> CRIME_SELECTION
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.CRIME_SELECTION) {
    const newPhase = await prepareCrimeSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> SCENE_MARKING
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.SCENE_MARKING) {
    const newPhase = await prepareSceneMarkingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // SCENE_MARKING -> GUESSING
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: CrimesHediondosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case CRIMES_HEDIONDOS_ACTIONS.SUBMIT_CRIME:
      validateSubmitActionProperties(
        data,
        [
          'weaponId',
          'evidenceId',
          'causeOfDeathIndex',
          'reasonForEvidenceIndex',
          'locationIndex',
          'victimIndex',
        ],
        'submit crime',
      );
      return handleSubmitCrime(gameName, gameId, playerId, {
        weaponId: data.weaponId,
        evidenceId: data.evidenceId,
        victimId: data.victimId,
        locationId: data.locationId,
        causeOfDeathIndex: data.causeOfDeathIndex,
        reasonForEvidenceIndex: data.reasonForEvidenceIndex,
        victimIndex: data.victimIndex,
        locationIndex: data.locationIndex,
      });
    case CRIMES_HEDIONDOS_ACTIONS.SUBMIT_MARK:
      validateSubmitActionProperties(data, ['sceneIndex'], 'submit scene mark');
      return handleSubmitMark(gameName, gameId, playerId, data.sceneIndex);
    case CRIMES_HEDIONDOS_ACTIONS.SUBMIT_GUESSES:
      validateSubmitActionProperties(data, ['guesses'], 'submit guess');
      return handleSubmitGuesses(gameName, gameId, playerId, data.guesses);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
