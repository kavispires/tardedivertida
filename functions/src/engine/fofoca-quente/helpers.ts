import utils from '../../utils';
// Constants
import { FOFOCA_QUENTE_PHASES } from './constants';
import type { SchoolLocation, Student } from './types';

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
  schoolBoard: SchoolLocation[],
  detectiveLocationIndexes: number[],
  gossiperId: string,
  motivationId: string,
) => {
  const detectiveLocationId = `location-${detectiveLocationIndexes.at(-1)}`;
  // Previously rumored students
  const previouslyRumoredStudents = Object.values(students)
    .filter((student) => student.rumored)
    .sort((student) => student.rumorSlot ?? 0);

  return Object.values(students).forEach((student) => {
    student.canBeRumored = false;
    // To be rumored:
    // - Cannot be where the detective is
    // - Cannot be already rumored
    // - Cannot be the gossiper
    // - Follow rules from the motivations (if any)
    if (student.locationId === detectiveLocationId || student.rumored || student.id === gossiperId) {
      student.canBeRumored = false;
      return;
    }

    // Motivation tsm-1: not on the 8 locations around detective
    if (motivationId === 'tsm-1') {
      const detectiveNeighboringLocationIds = getNeighboringLocationIds(detectiveLocationId);
      student.canBeRumored = !detectiveNeighboringLocationIds.includes(student.locationId);
      return;
    }

    // Motivation tsm-2: all victims must be from the same gender
    if (motivationId === 'tsm-2') {
      student.canBeRumored =
        previouslyRumoredStudents.length === 0 || student.gender === previouslyRumoredStudents[0].gender;
      return;
    }

    // Motivation tsm-3: cannot rumor intimidated students
    if (motivationId === 'tsm-3') {
      student.canBeRumored = !student.intimidated;
      return;
    }

    // Motivation tsm-4: all different social groups
    if (motivationId === 'tsm-4') {
      const rumoredSocialGroups = previouslyRumoredStudents.map((s) => s.socialGroupId);
      student.canBeRumored = !rumoredSocialGroups.includes(student.socialGroupId);
      return;
    }

    // Motivation tsm-5: only students alone
    if (motivationId === 'tsm-5') {
      student.canBeRumored =
        schoolBoard
          .find((location) => location.id === student.locationId)
          ?.students.filter((sId) => sId !== student.id).length === 0;
      return;
    }

    // Motivation tsm-6: not in the four central locations
    if (motivationId === 'tsm-6') {
      const centralLocationIds = ['location-5', 'location-6', 'location-9', 'location-10'];
      student.canBeRumored = !centralLocationIds.includes(student.locationId);
      return;
    }

    // Motivation tsm-7: each victim must be from a different social group than the last
    if (motivationId === 'tsm-7') {
      if (previouslyRumoredStudents.length === 0) {
        student.canBeRumored = true;
      } else {
        const lastRumoredStudent = previouslyRumoredStudents[previouslyRumoredStudents.length - 1];
        student.canBeRumored = student.socialGroupId !== lastRumoredStudent.socialGroupId;
      }
      return;
    }

    // Motivation tsm-8: at least 3 on the same social group
    if (motivationId === 'tsm-8') {
      // If less than 3 rumored students, can rumor anyone
      if (previouslyRumoredStudents.length < 3) {
        student.canBeRumored = true;
        return;
      }

      const rumoredSocialGroupsCount: Dictionary<number> = {};
      previouslyRumoredStudents.forEach((s) => {
        rumoredSocialGroupsCount[s.socialGroupId] = (rumoredSocialGroupsCount[s.socialGroupId] || 0) + 1;
      });

      // If already met the goal of 3 on the same group, can rumor anyone
      const hasGroupWithAtLeast3 = Object.values(rumoredSocialGroupsCount).some((count) => count >= 3);
      // If already has a group with at least 3, can rumor anyone
      if (hasGroupWithAtLeast3) {
        student.canBeRumored = true;
        return;
      }

      // If there are 3 different groups selected with 3 rumors, can rumor only within those grous
      if (previouslyRumoredStudents.length === 3 && Object.keys(rumoredSocialGroupsCount).length === 3) {
        const groupsWithRumors = Object.keys(rumoredSocialGroupsCount);
        student.canBeRumored = groupsWithRumors.includes(student.socialGroupId);
        return;
      }

      // If there are 3 different groups and 4 rumored students, can only rumor from the group with most rumors
      if (previouslyRumoredStudents.length === 4 && Object.keys(rumoredSocialGroupsCount).length >= 3) {
        const maxCount = Math.max(...Object.values(rumoredSocialGroupsCount));
        const groupsWithMaxCount = Object.entries(rumoredSocialGroupsCount)
          .filter(([, count]) => count === maxCount)
          .map(([groupId]) => groupId);
        student.canBeRumored = groupsWithMaxCount.includes(student.socialGroupId);
        return;
      }

      // TODO: verify, but seems to be the default case is cannot be rumored
      student.canBeRumored = false;
    }

    // Motivation tsm-9: not adjacent to the last rumored student
    if (motivationId === 'tsm-9') {
      const lastRumoredStudent = previouslyRumoredStudents[previouslyRumoredStudents.length - 1];
      const neighboringLocationIds = getNeighboringLocationIds(lastRumoredStudent.locationId);
      student.canBeRumored = !neighboringLocationIds.includes(student.locationId);
      return;
    }

    // Motivation tsm-10: all victims cannot have more than 2 different ages
    if (motivationId === 'tsm-10') {
      const rumoredAges = Array.from(new Set(previouslyRumoredStudents.map((s) => s.age)));
      if (rumoredAges.length < 2) {
        student.canBeRumored = true;
      } else {
        student.canBeRumored = rumoredAges.includes(student.age);
      }
      return;
    }

    // Motivation tsm-11: must have victims from all 3 different builds
    if (motivationId === 'tsm-11') {
      const rumoredBuilds = Array.from(new Set(previouslyRumoredStudents.map((s) => s.build)));
      if (rumoredBuilds.length < 3) {
        student.canBeRumored = true;
      } else {
        student.canBeRumored = rumoredBuilds.includes(student.build);
      }
      return;
    }

    // Motivation tsm-12: only rumor victims in the same location as staff
    if (motivationId === 'tsm-12') {
      const location = schoolBoard.find((loc) => loc.id === student.locationId);
      student.canBeRumored = location?.staff !== undefined;
      return;
    }

    student.canBeIntimidated = true;
  });
};

const getNeighboringLocationIds = (locationId: string): string[] => {
  // Given than the school board is a 4x4 grid, starting with id `location-0`, determine the neighboring locations of a given location
  const locationIndex = Number.parseInt(locationId.split('-')[1], 10);
  const neighboringIndices = [
    locationIndex - 4, // above
    locationIndex + 4, // below
    locationIndex - 1, // left
    locationIndex + 1, // right
    locationIndex - 5, // above left
    locationIndex - 3, // above right
    locationIndex + 3, // below left
    locationIndex + 5, // below right
  ].filter(
    (index) =>
      index >= 0 &&
      index < 16 &&
      !(index % 4 === 0 && (locationIndex + 1) % 4 === 0) &&
      !(locationIndex % 4 === 0 && index % 4 === 3),
  ); // filter out invalid indices

  return neighboringIndices.map((index) => `location-${index}`);
};
