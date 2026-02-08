// Utils
import { random } from 'lodash';
import utils from '../../utils';
// Internal
import { FOFOCA_QUENTE_PHASES, MAX_ROUNDS, STARTING_STUDENT_POSITIONS, TOTAL_MOTIVATIONS } from './constants';
import type {
  FirebaseStateData,
  FirebaseStoreData,
  FofocaQuenteOptions,
  ResourceData,
  RumorTrackerEntry,
  SchoolLocation,
  Student,
} from './types';
import { determineStudentsThatCanBeRumored } from './helpers';
import type { TeenageRumor } from '../../types/tdr';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const options: FofocaQuenteOptions = store.options;
  const achievements = utils.achievements.setup(players, {});

  // Build school board
  const schoolBoard: SchoolLocation[] = resourceData.locations.map((location) => ({
    ...location,
    students: [],
  }));

  // Place staff members
  const staff = resourceData.staff;
  Object.values(staff).forEach((staffMember) => {
    const location = schoolBoard.find((location) => location.id === staffMember.locationId);
    if (location) {
      location.staff = staffMember.id;
    }
  });

  // Build students deck and place students on the board
  const students = resourceData.teenagers.reduce((acc: Dictionary<Student>, student, index) => {
    const locationId = schoolBoard[STARTING_STUDENT_POSITIONS[index]].id;
    acc[student.id] = {
      ...student,
      isGossiper: false,
      isBestFriend: false,
      canLie: false,
      canBeIntimidated: false,
      intimidated: false,
      canBeRumored: true,
      locationId,
    };

    schoolBoard[STARTING_STUDENT_POSITIONS[index]].students.push(student.id);

    return acc;
  }, {});

  const [gossiper, bestFriend] = utils.game.getRandomItems(Object.values(students), 2);

  // Set gossiper
  students[gossiper.id].isGossiper = true;
  students[gossiper.id].canLie = true;

  // Set best friend if playing with best friend
  if (options.includeBestFriend) {
    students[bestFriend.id].isBestFriend = true;
    students[bestFriend.id].canLie = true;
  }

  // Get motivations
  const motivations = utils.game.getRandomItems(
    resourceData.motivations.filter((motivation) => (options.beginnerGame ? motivation.beginner : true)),
    TOTAL_MOTIVATIONS,
  );

  // Save
  return {
    update: {
      store: {
        achievements,
        rumors: resourceData.rumors,
      },
      state: {
        phase: FOFOCA_QUENTE_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: MAX_ROUNDS,
          forceLastRound: false,
        },
        schoolBoard,
        students,
        staff,
        motivations,
        gossiperMotivationIndex: random(0, TOTAL_MOTIVATIONS - 1),
        socialGroups: resourceData.socialGroups,
        gossiperId: gossiper.id,
        bestFriendId: options.includeBestFriend ? bestFriend.id : utils.firestore.deleteValue(),
        maySkipRumor: true,
        rumorTracker: [],
      },
    },
  };
};

export const prepareGossiperSelectionPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  return {
    update: {
      state: {
        phase: FOFOCA_QUENTE_PHASES.ROLES_SELECTION,
        players,
      },
    },
  };
};

export const prepareBoardSetupPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const gossiperPlayerId = state.gossiperPlayerId || '';
  const detectivePlayerId = state.detectivePlayerId || '';

  // Give 3 options of social group to choose from
  players[gossiperPlayerId].socialGroupOptions = utils.game.getRandomItems(
    Object.keys(state.socialGroups ?? {}),
    3,
  );

  players[detectivePlayerId].locationIndexes = [];

  utils.players.unReadyPlayers(players);

  return {
    update: {
      state: {
        phase: FOFOCA_QUENTE_PHASES.BOARD_SETUP,
        players,
        surveillanceToken: null,
      },
    },
  };
};

export const prepareIntimidationPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const detectivePlayerId = state.detectivePlayerId || '';
  const detective = players[detectivePlayerId];

  // Update students that can be intimidated: are not rumored and not already intimidated and not on the same location as the detective
  let totalPossibleIntimidations = 0;
  const students: Dictionary<Student> = state.students ?? {};
  Object.values(students).forEach((student) => {
    student.canBeIntimidated =
      !student.rumored &&
      !student.intimidated &&
      student.locationId !== `location-${detective.locationIndexes.at(-1)}`;
    if (student.canBeIntimidated) {
      totalPossibleIntimidations++;
    }
  });

  // Set the number of required intimidations (0-2)
  const maxIntimidations = Math.min(2, totalPossibleIntimidations);

  // Unready player to has the action
  utils.players.unReadyPlayers(players, detectivePlayerId);

  return {
    update: {
      state: {
        phase: FOFOCA_QUENTE_PHASES.INTIMIDATION,
        players,
        students,
        maxIntimidations,
        intimidatedStudentsIds: [],
      },
    },
  };
};

export const prepareRumorPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const detectivePlayerId = state.detectivePlayerId || '';
  const detective = players[detectivePlayerId];

  const students: Dictionary<Student> = state.students ?? {};
  const motivations = state.motivations || [];

  determineStudentsThatCanBeRumored(
    students ?? {},
    state.schoolBoard ?? [],
    detective.locationIndexes ?? [],
    state.gossiperId || '',
    motivations[state.gossiperMotivationIndex || 0].id,
  );

  const possibleRumors = utils.game.getRandomItems(store.rumors ?? [], 3);

  // Unready player to has the action
  utils.players.unReadyPlayers(players, detectivePlayerId);

  utils.players.removePropertiesFromPlayers(players, ['skipRumor']);

  return {
    update: {
      state: {
        phase: FOFOCA_QUENTE_PHASES.RUMOR,
        players,
        students,
        possibleRumors,
      },
      stateCleanup: ['maxIntimidations'],
    },
  };
};

export const prepareResponsePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const detectivePlayerId = state.detectivePlayerId || '';
  const detective = players[detectivePlayerId];
  const gossiperPlayerId = state.gossiperPlayerId || '';
  const gossiper = players[gossiperPlayerId];

  const students: Dictionary<Student> = state.students ?? {};
  const schoolBoard: SchoolLocation[] = state.schoolBoard || [];

  // Unready player to has the action
  utils.players.unReadyPlayers(players, gossiperPlayerId);

  const rumorTracker: RumorTrackerEntry[] = state.rumorTracker || [];
  let maySkipRumor = state.maySkipRumor || false;

  if (gossiper.skipRumor) {
    if (maySkipRumor === false) {
      // TODO: If it's the second skip, game over
    } else {
      maySkipRumor = false;
    }
  } else {
    const possibleRumors: TeenageRumor[] = state.possibleRumors || [];
    const rumoredStudentId: string = gossiper.rumoredStudentId || '';
    const rumoredStudent = students[rumoredStudentId];

    if (!rumoredStudent || !possibleRumors[gossiper.rumorIndex || 0]) {
      throw new Error('Invalid rumored student or rumor index');
    }

    const selectedRumor = possibleRumors[gossiper.rumorIndex || 0];

    // Create record
    rumorTracker.push({
      rumorSlot: rumorTracker.length,
      studentId: rumoredStudentId,
      rumorText: selectedRumor?.text || { en: 'Error', pt: 'Erro' },
    });
    // Remove rumor from the rumor deck in store
    store.rumors = store.rumors?.filter((rumor) => rumor.id !== selectedRumor.id);

    if (!students[rumoredStudentId]) {
      throw new Error('Rumored student not found');
    }
    // Update student as rumored
    students[rumoredStudentId].rumored = true;
    students[rumoredStudentId].rumorSlot = rumorTracker.length - 1;

    const rumoredLocation = schoolBoard.find((location) => location.students.includes(rumoredStudentId));

    if (!rumoredLocation) {
      throw new Error('Rumored student location not found');
    }
    // If other students are in the same location they must be moved
    Object.values(students).forEach((student) => {
      if (!student.rumored) {
        if (student.locationId === rumoredLocation.id) {
          // Student must be moved
          student.mustBeMoved = true;
        }
      }
    });

    // Move the detective where the rumor happened
    detective.locationIndexes.push(Number(rumoredLocation.id.split('-')[1]));

    // Update the location's rumorSlot
    schoolBoard[detective.locationIndexes.at(-1)].rumorSlot = rumorTracker.length - 1;
  }

  utils.players.removePropertiesFromPlayers(players, ['rumoredStudentId', 'rumorIndex']);

  return {
    update: {
      store: {
        rumors: store.rumors,
      },
      state: {
        phase: FOFOCA_QUENTE_PHASES.RESPONSE,
        players,
        rumorTracker,
        maySkipRumor,
        students,
        schoolBoard,
      },
      stateCleanup: ['possibleRumors'],
    },
  };
};
