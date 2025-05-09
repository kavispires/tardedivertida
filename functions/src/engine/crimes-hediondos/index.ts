// Constants
import { GAME_NAMES } from '../../utils/constants';
import { CRIMES_HEDIONDOS_ACTIONS, CRIMES_HEDIONDOS_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  CrimesHediondosInitialState,
  CrimesHediondosOptions,
  CrimesHediondosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
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
  language: Language,
  version: string,
  options: CrimesHediondosOptions,
): CrimesHediondosInitialState => {
  return utils.helpers.getDefaultInitialState<CrimesHediondosInitialState>({
    gameId,
    gameName: GAME_NAMES.CRIMES_HEDIONDOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: CRIMES_HEDIONDOS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      scenes: {},
    },
    options,
    onCreate: () => {
      const players: Players = {};
      if (options.withBots) {
        utils.players.addBots(players, language, 2);
      }
      return {
        players,
      };
    },
  });
};

/**
 * Exposes min and max player count
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> CRIME_SELECTION
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.CRIME_SELECTION) {
    const newPhase = await prepareCrimeSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> SCENE_MARKING
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.SCENE_MARKING) {
    const newPhase = await prepareSceneMarkingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // SCENE_MARKING -> GUESSING
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === CRIMES_HEDIONDOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions
 * May trigger next phase
 */
export const submitAction = async (data: CrimesHediondosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case CRIMES_HEDIONDOS_ACTIONS.SUBMIT_CRIME:
      utils.firebase.validateSubmitActionProperties(
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
      utils.firebase.validateSubmitActionProperties(data, ['sceneIndex'], 'submit scene mark');
      return handleSubmitMark(gameName, gameId, playerId, data.sceneIndex);
    case CRIMES_HEDIONDOS_ACTIONS.SUBMIT_GUESSES:
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit guess');
      return handleSubmitGuesses(gameName, gameId, playerId, data.guesses);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
