import type { GroupQuestionCardData } from '../../types/tdr';
import type { MENTE_COLETIVA_ACTIONS } from './constants';

export type MenteColetivaOptions = {
  shortPasture: boolean;
};

export interface ResourceData {
  allQuestions: {
    [key: string]: GroupQuestionCardData;
  };
}

export interface AllQuestions {
  [key: string]: GroupQuestionCardData;
}

export interface PastQuestions {
  id: string;
  answers: string[];
}

export type Deck = GroupQuestionCardData[];

export type GalleryEntry = {
  question: GroupQuestionCardData;
  answers: {
    playerIds: UID[];
    answer: string;
  }[];
};

export interface MenteColetivaStore extends DefaultStore {
  deck: Deck;
  gameOrder: UID[];
  pastQuestions: PastQuestions[];
  currentQuestion?: GroupQuestionCardData;
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
  [key: string]: AnyOrUnknownPlaceholder;
}
