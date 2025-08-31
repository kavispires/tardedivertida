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
  SchoolLocation,
  Student,
} from './types';

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
        rumours: resourceData.rumors,
        socialGroups: resourceData.socialGroups,
        gossiperId: gossiper.id,
        bestFriendId: options.includeBestFriend ? bestFriend.id : utils.firestore.deleteValue(),
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

  // Give 3 options of social group to choose from
  players[gossiperPlayerId].socialGroupOptions = utils.game.getRandomItems(
    Object.keys(state.socialGroups ?? {}),
    3,
  );

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
  // Unready players
  utils.players.unReadyPlayers(players);

  const detectivePlayerId = state.detectivePlayerId || '';
  const detective = players[detectivePlayerId];

  // Update students that can be intimidated: are not rumored and not already intimidated and not on the same location as the detective
  let totalPossibleIntimidations = 0;
  const students: Dictionary<Student> = state.students ?? {};
  Object.values(students).forEach((student) => {
    student.canBeIntimidated =
      !student.rumored && !student.intimidated && student.locationId !== detective.locationId;
    if (student.canBeIntimidated) {
      totalPossibleIntimidations++;
    }
  });

  // Set the number of required intimidations (0-2)
  const intimidations = Math.min(2, totalPossibleIntimidations);

  return {
    update: {
      state: {
        phase: FOFOCA_QUENTE_PHASES.INTIMIDATION,
        players,
        students,
        intimidations,
      },
    },
  };
};

export const prepareRumorPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const detectivePlayerId = state.detectivePlayerId || '';
  const detective = players[detectivePlayerId];

  // const gossiperPlayerId = state.gossiperPlayerId || '';
  // const gossiper = players[gossiperPlayerId];

  const students: Dictionary<Student> = state.students ?? {};
  Object.values(students).forEach((student) => {
    student.canBeRumored = false;
    student.canBeRumored =
      !student.rumored && student.locationId !== detective.locationId && student.id !== state.gossiperId;
  });

  const rumorOptions = utils.game.getRandomItems(state.rumors ?? [], 3);

  return {
    update: {
      state: {
        phase: FOFOCA_QUENTE_PHASES.INTIMIDATION,
        players,
        students,
        rumorOptions,
      },
    },
  };
};
