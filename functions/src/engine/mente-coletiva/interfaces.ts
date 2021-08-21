import { Meta, Payload, PlayerId, Players, Round } from '../../utils/interfaces';

export interface Question {
  id: string;
  number: number;
  prefix: string;
  suffix: string;
}

export interface AllQuestions {
  [key: string]: Question;
}

export interface PastQuestions {
  id: string;
  answers: string[];
}

export type Deck = Question[];

export interface MenteColetivaStore {
  language: string;
  deck: Deck;
  gameOrder: PlayerId[];
  pastQuestions: PastQuestions[];
  currentQuestion?: Question;
  [key: string]: any;
}

export interface MenteColetivaState {
  phase: string;
  round: Round;
  activePlayer?: PlayerId;
  [key: string]: any;
}

export interface MenteColetivaInitialState {
  meta: Meta;
  players: Players;
  store: MenteColetivaStore;
  state: MenteColetivaState;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | MenteColetivaState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | MenteColetivaStore;

export interface MenteColetivaSubmitAction extends Payload {
  action: 'SUBMIT_QUESTION' | 'SUBMIT_ANSWERS' | 'NEXT_ANSWERS' | 'ADD_ANSWER';
  [key: string]: any;
}

export interface AnswerEntry {
  id: string;
  playerId: PlayerId;
  answer: string;
  isLocked: boolean;
}
