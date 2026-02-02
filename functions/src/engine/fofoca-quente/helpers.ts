import utils from '../../utils';
// Constants
import { FOFOCA_QUENTE_PHASES } from './constants';
import type { Student } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  nextPhase?: keyof typeof FOFOCA_QUENTE_PHASES,
): string => {
  const {
    LOBBY,
    SETUP,
    ROLES_SELECTION,
    BOARD_SETUP,
    INTIMIDATION,
    RUMOR,
    RESPONSE,
    INVESTIGATION,
    SCHOOL,
    RESOLUTION,
    GAME_OVER,
  } = FOFOCA_QUENTE_PHASES;
  const order = [
    LOBBY,
    SETUP,
    ROLES_SELECTION,
    BOARD_SETUP,
    INTIMIDATION,
    RUMOR,
    RESPONSE,
    INVESTIGATION,
    SCHOOL,
    RESOLUTION,
    GAME_OVER,
  ];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : nextPhase || INTIMIDATION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return INTIMIDATION;
};

export const determineStudentsThatCanBeRumored = (
  students: Dictionary<Student>,
  detectiveLocationId: string,
  motivationId: string,
) => {
  return Object.values(students).forEach((student) => {
    // To be rumored:
    // - Cannot be where the detective is
    // - Cannot be already intimidated
    // - Cannot be rumored
    // - Follow rules from the motivations (if any)
    if (student.locationId === detectiveLocationId || student.intimidated || student.rumored) {
      student.canBeIntimidated = false;
      return;
    }

    // Motivation tsm-1: not on the 8 locations around detective
    if (motivationId === 'tsm-1') {
      // TODO
    }

    // Motivation tsm-2: all victims must be from the same gender

    // Motivation tsm-3: no intimidation special rules

    // Motivation tsm-4: no intimidation special rules

    student.canBeIntimidated = true;
  });
};
