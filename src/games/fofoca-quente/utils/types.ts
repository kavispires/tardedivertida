// Types
import type { TeenageMotivationData, TeenageRumorData, TeenageStudentData } from 'types/tdr';
// Internal
import type { FOFOCA_QUENTE_PHASES } from './constants';

export type FofocaQuentePhase = keyof typeof FOFOCA_QUENTE_PHASES;

export type SubmitPlayersRoles = {
  gossiperPlayerId: UID;
  detectivePlayerId: UID;
};

export type SubmitAssociatedSocialGroupPayload = {
  associatedSocialGroupId: string;
};

export type SubmitDetectiveLocationPayload = {
  locationIndex: number;
  shouldReady: boolean;
};

export type SubmitIntimidationPayload = {
  intimidatedStudentId: string;
  shouldGoToTheNextPhase: boolean;
  intimidatedStudentsIds?: string[];
};

export type SubmitRumorPayload = {
  rumoredStudentId?: string;
  rumorIndex?: number;
  skipRumor: boolean;
};

export type StaffMember = {
  id: string;
  type: string;
  name: DualLanguageValue;
  description: DualLanguageValue;
  locationId: string;
};

export type Student = TeenageStudentData & {
  id: UID;
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
};

export type SchoolLocation = {
  id: string;
  name: DualLanguageValue;
  staff?: UID;
  students: UID[];
  rumorScene?: number;
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

export type FofocaQuenteDefaultState = {
  phase: FofocaQuentePhase;
  schoolBoard: SchoolLocation[];
  students: Dictionary<Student>;
  staff: Dictionary<StaffMember>;
  motivations: TeenageMotivationData[];
  socialGroups: Dictionary<SocialGroup>;
  detectivePlayerId: UID;
  gossiperPlayerId: UID;
  gossiperId: UID;
  motiveId: UID;
  bestFriendId?: UID;
  gossiperMotivationIndex: number;
  maySkipRumor: boolean;
  rumorTracker: RumorTrackerEntry[];
  /**
   * Number of intimidations to be done during the intimidation phase
   */
  maxIntimidations?: number;
  /**
   * Available rumors during the rumor phase
   */
  possibleRumors?: TeenageRumorData[];
  // detectivePosition?: number;
  // detectivePossibleMovements?: number[];
  // associatedSocialGroup?: string;
};
