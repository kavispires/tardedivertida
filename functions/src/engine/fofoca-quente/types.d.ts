import type { TeenageRumor, TeenageStudent, TeenageMotivation } from '../../types/tdr';
import type { FOFOCA_QUENTE_ACHIEVEMENTS, FOFOCA_QUENTE_PHASES, FOFOCA_QUENTE_ACTIONS } from './constants';

export type FofocaQuenteOptions = {
  /**
   *
   */
  beginnerGame?: boolean;
  /**
   *
   */
  includeBestFriend?: boolean;
};

export type ResourceData = {
  teenagers: TeenageStudent[];
  rumors: TeenageRumor[];
  motivations: TeenageMotivation[];
  socialGroups: Dictionary<SocialGroup>;
  locations: SchoolLocationBase[];
  staff: Dictionary<StaffMember>;
};

export type FofocaQuenteAchievement = keyof typeof FOFOCA_QUENTE_ACHIEVEMENTS;

export interface FofocaQuenteStore extends DefaultStore<FofocaQuenteOptions> {
  rumors?: TeenageRumor[];
  [key: string]: any;
}

export interface FofocaQuenteState extends DefaultState {
  phase: keyof typeof FOFOCA_QUENTE_PHASES | string;
  schoolBoard?: SchoolLocation[];
  students?: Dictionary<Student>;
  staff?: Dictionary<StaffMember>;
  motivations?: TeenageMotivation[];
  socialGroups?: string[];
  detectivePlayerId?: PlayerId;
  detectivePosition?: number;
  detectivePossibleMovements?: number[];
  gossiperId?: CardId;
  gossiperPlayerId?: PlayerId;
  motiveId?: CardId;
  bestFriendId?: CardId;
  associatedSocialGroup?: string;
  maySkipRumor?: boolean;
  rumorTracker?: RumorTrackerEntry[];
  // Intimidation phase
  maxIntimidations?: number;
  // Rumor phase
  possibleRumors?: TeenageRumor[];
  // Response phase
}

export interface FofocaQuenteInitialState extends InitialState {
  store: FofocaQuenteStore;
  state: FofocaQuenteState;
}

export interface FofocaQuenteSubmitAction extends Payload {
  action: keyof typeof FOFOCA_QUENTE_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & FofocaQuenteState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & FofocaQuenteStore;

export type StaffMember = {
  id: string;
  type: string;
  name: DualLanguageValue;
  description: DualLanguageValue;
  locationId: string;
  adjacentLocations?: string[];
};

export type Student = TeenageStudent & {
  id: CardId;
  // Fixed properties
  isGossiper: boolean;
  isBestFriend: boolean;
  canLie: boolean;
  // Changeable properties
  locationId: string;
  canBeIntimidated: boolean;
  intimidated: boolean;
  canBeRumored: boolean;
  rumored?: boolean;
  rumorSlot?: number;
  mustBeMoved?: boolean;
};

export type SchoolLocationBase = {
  id: string;
  name: DualLanguageValue;
};

export type SchoolLocation = {
  id: string;
  name: DualLanguageValue;
  staff?: CardId;
  students: CardId[];
  rumorSlot?: number;
};

export type SocialGroup = {
  id: string;
  name: DualLanguageValue;
  colors: {
    primary: string;
    accent: string;
  };
};

export type RumorTrackerEntry = {
  rumorSlot: number;
  studentId: string;
  rumorText: DualLanguageValue;
};
