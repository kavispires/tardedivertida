// Types
import type { TeenageMotivation, TeenageRumor, TeenageStudent } from 'types/tdr';
// Internal
import type { FOFOCA_QUENTE_PHASES } from './constants';

export type FofocaQuentePhase = keyof typeof FOFOCA_QUENTE_PHASES;

export type SubmitPlayersRoles = {
  gossiperPlayerId: PlayerId;
  detectivePlayerId: PlayerId;
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
};

export type SchoolLocation = {
  id: string;
  name: DualLanguageValue;
  staff?: CardId;
  students: CardId[];
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
  motivations: TeenageMotivation[];
  socialGroups: Dictionary<SocialGroup>;
  detectivePlayerId: PlayerId;
  gossiperPlayerId: PlayerId;
  gossiperId: CardId;
  motiveId: CardId;
  bestFriendId?: CardId;
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
  possibleRumors?: TeenageRumor[];
  // detectivePosition?: number;
  // detectivePossibleMovements?: number[];
  // associatedSocialGroup?: string;
};
