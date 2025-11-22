// Constants
import { PLANEJAMENTO_URBANO_ACHIEVEMENTS, PLANEJAMENTO_URBANO_PHASES } from './constants';
// Utils
import utils from '../../utils';
import type { FirebaseStoreData, PlanejamentoUrbanoAchievement } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { LOBBY, SETUP, PLANNING, PLACING, RESOLUTION, GAME_OVER } = PLANEJAMENTO_URBANO_PHASES;
  const order = [LOBBY, SETUP, PLANNING, PLACING, RESOLUTION];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : PLANNING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return PLANNING;
};

export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<PlanejamentoUrbanoAchievement>[] = [];

  // Most Stops: stopped the game the most
  const { most: mostConeA } = utils.achievements.getMostAndLeastOf(store, 'coneA');
  if (mostConeA) {
    achievements.push({
      type: PLANEJAMENTO_URBANO_ACHIEVEMENTS.MOST_CONE_A_LEFT,
      playerId: mostConeA.playerId,
      value: mostConeA.value,
    });
  }

  const { most: mostConeB } = utils.achievements.getMostAndLeastOf(store, 'coneB');
  if (mostConeB) {
    achievements.push({
      type: PLANEJAMENTO_URBANO_ACHIEVEMENTS.MOST_CONE_B_LEFT,
      playerId: mostConeB.playerId,
      value: mostConeB.value,
    });
  }

  const { most: mostConeC } = utils.achievements.getMostAndLeastOf(store, 'coneC');
  if (mostConeC) {
    achievements.push({
      type: PLANEJAMENTO_URBANO_ACHIEVEMENTS.MOST_CONE_C_LEFT,
      playerId: mostConeC.playerId,
      value: mostConeC.value,
    });
  }

  const { most: mostConeD } = utils.achievements.getMostAndLeastOf(store, 'coneD');
  if (mostConeD) {
    achievements.push({
      type: PLANEJAMENTO_URBANO_ACHIEVEMENTS.MOST_CONE_D_LEFT,
      playerId: mostConeD.playerId,
      value: mostConeD.value,
    });
  }

  const { most: mostArchitectMatches } = utils.achievements.getMostAndLeastOf(store, 'architectMatches');
  if (mostArchitectMatches) {
    achievements.push({
      type: PLANEJAMENTO_URBANO_ACHIEVEMENTS.MOST_ARCHITECT_MATCHES,
      playerId: mostArchitectMatches.playerId,
      value: mostArchitectMatches.value,
    });
  }

  const { most: mostPlayersMatches } = utils.achievements.getMostAndLeastOf(store, 'playersMatches');
  if (mostPlayersMatches) {
    achievements.push({
      type: PLANEJAMENTO_URBANO_ACHIEVEMENTS.MOST_OTHER_PLAYERS_MATCHES,
      playerId: mostPlayersMatches.playerId,
      value: mostPlayersMatches.value,
    });
  }

  const { most: mostSoloMatches } = utils.achievements.getMostAndLeastOf(store, 'soloMatches');
  if (mostSoloMatches) {
    achievements.push({
      type: PLANEJAMENTO_URBANO_ACHIEVEMENTS.MOST_SOLO_GUESSES,
      playerId: mostSoloMatches.playerId,
      value: mostSoloMatches.value,
    });
  }

  return achievements;
};
