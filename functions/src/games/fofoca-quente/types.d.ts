// Types
import type { TeenageRumorData, TeenageStudentData, TeenageMotivationData } from '../../types/tdr';
import type { FOFOCA_QUENTE_ACHIEVEMENTS, FOFOCA_QUENTE_PHASES, FOFOCA_QUENTE_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `fofoca-quente` session.
 */
export type FofocaQuenteOptions = {
  /**
   * Whether the beginner variant is enabled.
   */
  beginnerGame?: boolean;
  /**
   * Whether the gossiper's best-friend role is included.
   */
  includeBestFriend?: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Student resources available for building the school.
   */
  teenagers: TeenageStudentData[];
  /**
   * Rumor resources available for the investigation.
   */
  rumors: TeenageRumorData[];
  /**
   * Motivation resources available for the gossiper.
   */
  motivations: TeenageMotivationData[];
  /**
   * The social groups represented in this school setup.
   */
  socialGroups: Dictionary<SocialGroup>;
  /**
   * Location resources available for game setup.
   */
  locations: SchoolLocationBase[];
  /**
   * Staff members available for the school or assigned to a location.
   */
  staff: Dictionary<StaffMember>;
};

/**
 * Achievement identifiers supported by `fofoca-quente`.
 */
export type FofocaQuenteAchievement = keyof typeof FOFOCA_QUENTE_ACHIEVEMENTS;

/**
 * Server-side data retained between phases of a `fofoca-quente` session.
 */
export interface FofocaQuenteStore extends DefaultStore<FofocaQuenteOptions> {
  /**
   * Rumor resources available for the investigation.
   */
  rumors?: TeenageRumorData[];
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `fofoca-quente` session.
 */
export interface FofocaQuenteState extends DefaultState {
  /**
   * The current phase identifier used by the game engine.
   */
  phase: keyof typeof FOFOCA_QUENTE_PHASES | string;
  /**
   * The school locations and their current occupants.
   */
  schoolBoard?: SchoolLocation[];
  /**
   * The students available in the school or occupying a location.
   */
  students?: Dictionary<Student>;
  /**
   * Staff members available for the school or assigned to a location.
   */
  staff?: Dictionary<StaffMember>;
  /**
   * Motivation resources available for the gossiper.
   */
  motivations?: TeenageMotivationData[];
  /**
   * The social groups represented in this school setup.
   */
  socialGroups?: string[];
  /**
   * Identifier of the player controlling the detective.
   */
  detectivePlayerId?: UID;
  /**
   * The detective's current position on the school board.
   */
  detectivePosition?: number;
  /**
   * School-board positions the detective may move to next.
   */
  detectivePossibleMovements?: number[];
  /**
   * Identifier of the student selected as the gossiper.
   */
  gossiperId?: UID;
  /**
   * Identifier of the player controlling the gossiper.
   */
  gossiperPlayerId?: UID;
  /**
   * Identifier of the gossiper's selected motivation.
   */
  motiveId?: UID;
  /**
   * Identifier of the student assigned as the gossiper's best friend.
   */
  bestFriendId?: UID;
  /**
   * The social group associated with the gossiper.
   */
  associatedSocialGroup?: string;
  /**
   * Whether the gossiper may skip spreading a rumor.
   */
  maySkipRumor?: boolean;
  /**
   * The history of rumors assigned to students.
   */
  rumorTracker?: RumorTrackerEntry[];
  // Intimidation phase
  /**
   * The maximum number of intimidations allowed.
   */
  maxIntimidations?: number;
  // Rumor phase
  /**
   * Rumor choices available for the current action.
   */
  possibleRumors?: TeenageRumorData[];
  // Response phase
}

/**
 * The initial metadata, server-side store, and public state for a `fofoca-quente` session.
 */
export interface FofocaQuenteInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: FofocaQuenteStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: FofocaQuenteState;
}

/**
 * Player action payload accepted by the `fofoca-quente` engine.
 */
export interface FofocaQuenteSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof FOFOCA_QUENTE_ACTIONS;
}

/**
 * Firestore document data used when reading the `fofoca-quente` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & FofocaQuenteState;
/**
 * Firestore document data used when reading the `fofoca-quente` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & FofocaQuenteStore;

/**
 * A school staff member with their location and movement-related information.
 */
export type StaffMember = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: string;
  /**
   * The localized display name of this entry.
   */
  name: DualLanguageValue;
  /**
   * The localized description explaining this entry.
   */
  description: DualLanguageValue;
  /**
   * Identifier of the location associated with this entry.
   */
  locationId: string;
  /**
   * Identifiers of locations affected alongside this staff member's location.
   */
  adjacentLocations?: string[];
};

/**
 * A school student's fixed role and mutable intimidation, rumor, and movement state.
 */
export type Student = TeenageStudentData & {
  /**
   * Unique identifier of this game entry.
   */
  id: UID;
  // Fixed properties
  /**
   * Whether this student is the hidden gossiper.
   */
  isGossiper: boolean;
  /**
   * Whether this student is the gossiper's best friend.
   */
  isBestFriend: boolean;
  /**
   * Whether this student may give a false answer.
   */
  canLie: boolean;
  // Changeable properties
  /**
   * Identifier of the location associated with this entry.
   */
  locationId: string;
  /**
   * Whether the gossiper may intimidate this student.
   */
  canBeIntimidated: boolean;
  /**
   * Whether this student is currently intimidated.
   */
  intimidated: boolean;
  /**
   * Whether this student can receive a rumor.
   */
  canBeRumored: boolean;
  /**
   * Whether this student has received a rumor.
   */
  rumored?: boolean;
  /**
   * The rumor position assigned to this student or location.
   */
  rumorSlot?: number;
  /**
   * Whether this student must be moved before play can continue.
   */
  mustBeMoved?: boolean;
};

/**
 * The identifier and localized name of a school-board location.
 */
export type SchoolLocationBase = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The localized display name of this entry.
   */
  name: DualLanguageValue;
};

/**
 * A school-board location containing students, optional staff, and a rumor slot.
 */
export type SchoolLocation = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The localized display name of this entry.
   */
  name: DualLanguageValue;
  /**
   * Staff members available for the school or assigned to a location.
   */
  staff?: UID;
  /**
   * The students available in the school or occupying a location.
   */
  students: UID[];
  /**
   * The rumor position assigned to this student or location.
   */
  rumorSlot?: number;
};

/**
 * A school social group with its localized name and display colors.
 */
export type SocialGroup = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The localized display name of this entry.
   */
  name: DualLanguageValue;
  /**
   * Primary and accent display colors associated with the social group.
   */
  colors: {
    /**
     * The social group's primary display color.
     */
    primary: string;
    /**
     * The social group's accent display color.
     */
    accent: string;
  };
};

/**
 * A rumor assignment linking a student, rumor slot, and localized rumor text.
 */
export type RumorTrackerEntry = {
  /**
   * The rumor position assigned to this student or location.
   */
  rumorSlot: number;
  /**
   * Identifier of the student associated with this rumor.
   */
  studentId: string;
  /**
   * The localized text of the assigned rumor.
   */
  rumorText: DualLanguageValue;
};
