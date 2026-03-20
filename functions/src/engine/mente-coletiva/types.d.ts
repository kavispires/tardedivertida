import type { GroupQuestionCard } from '../../types/tdr';
import type { MENTE_COLETIVA_ACHIEVEMENTS, MENTE_COLETIVA_ACTIONS } from './constants';

export type MenteColetivaOptions = {
  shortPasture: boolean;
};

export interface ResourceData {
  allQuestions: {
    [key: string]: GroupQuestionCard;
  };
}

export interface AllQuestions {
  [key: string]: GroupQuestionCard;
}

export interface PastQuestions {
  id: string;
  answers: string[];
}

export type Deck = GroupQuestionCard[];

export type GalleryEntry = {
  question: GroupQuestionCard;
  answers: {
    playerIds: UID[];
    answer: string;
  }[];
};

export interface MenteColetivaStore extends DefaultStore {
  deck: Deck;
  gameOrder: UID[];
  pastQuestions: PastQuestions[];
  currentQuestion?: GroupQuestionCard;
  gallery?: GalleryEntry[];
}

export interface MenteColetivaState extends DefaultState {
  gameOrder?: UID[];
  roundType?: string;
  activePlayerId?: UID;
}

export interface MenteColetivaInitialState extends InitialState {
  store: MenteColetivaStore;
  state: MenteColetivaState;
}

export interface AnswerEntry {
  id: string;
  playerId: UID;
  answer: string;
  parsedAnswer: string;
  isLocked: boolean;
  score: number;
}

export interface AnswerGroupEntry {
  answer: string;
  parsedAnswer: string;
  score: number;
  entries: AnswerEntry[];
}

export type ExtendedPlayerAnswerEntry = {
  answer: string;
  parsedAnswer: string;
  isLocked: boolean;
  score: number;
};

export interface MenteColetivaSubmitAction extends Payload {
  action: keyof typeof MENTE_COLETIVA_ACTIONS;
}

export type MenteColetivaAchievement = keyof typeof MENTE_COLETIVA_ACHIEVEMENTS;

export type FirebaseStateData = FirebaseFirestore.DocumentData | MenteColetivaState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | MenteColetivaStore;

export type SheepAnimation = {
  animateRight?: boolean;
  animateLeft?: boolean;
};

export interface PastureChangeEntry extends SheepAnimation {
  id: UID;
  name: string;
  avatarId: string;
  level: number;
  [key: string]: any;
}
