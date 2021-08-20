import { Meta, Payload, PlainObject, PlayerId, PlayerName, Players, Round } from '../../utils/interfaces';

export interface Word {
  id: string;
  text: string;
}

export interface AllWords {
  [key: string]: Word;
}

export interface UsedWord {
  id: string;
  text: string;
  playerName?: PlayerName | null;
  uniqueSuggestions?: string[] | [];
  commonSuggestions?: string[] | [];
  votes: 0;
}

export interface UsedWords {
  [key: string]: UsedWord;
}

export interface UeSoIssoStore {
  language: string;
  deck: Word[];
  turnOrder: PlayerId[];
  gameOrder: PlayerId[];
  usedWords: UsedWords;
  currentWords: Word[];
  currentSuggestions: PlainObject[];
  [key: string]: any;
}

export interface UeSoIssoState {
  phase: string;
  round: Round;
  guesser?: PlayerId;
  [key: string]: any;
}

export interface UeSoIssoInitialState {
  meta: Meta;
  players: Players;
  store: UeSoIssoStore;
  state: UeSoIssoState;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | UeSoIssoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | UeSoIssoStore;

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

export interface UeSoIssoSubmitAction extends Payload {
  action: 'SUBMIT_VOTES' | 'SUBMIT_SUGGESTIONS' | 'SUBMIT_VALIDATION' | 'SUBMIT_OUTCOME';
  [key: string]: any;
}

export interface UeSoIssoUpdateAction extends Payload {
  action: 'VALIDATE_SUGGESTION' | 'SEND_GUESS';
  [key: string]: any;
}
