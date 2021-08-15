import { Meta, Payload, PlainObject, PlayerId, Players, Round } from '../../utils/interfaces';

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

// TODO: CHECK

export interface SubmitSuggestionsPayload extends Payload {
  suggestions: string[];
}

export interface CurrentSuggestions {
  [key: string]: string[];
}

export interface SubmitSuggestionsValidationPayload extends Payload {
  validSuggestions: PlainObject[];
}

export interface ConfirmGuessPayload extends Payload {
  guess: string;
}

export interface MenteColetivaSubmitAction extends Payload {
  action: 'SUBMIT_VOTES' | 'SUBMIT_SUGGESTIONS' | 'SUBMIT_VALIDATION' | 'SUBMIT_OUTCOME';
  [key: string]: any;
}

export interface MenteColetivaUpdateAction extends Payload {
  action: 'VALIDATE_SUGGESTION' | 'SEND_GUESS';
  [key: string]: any;
}
