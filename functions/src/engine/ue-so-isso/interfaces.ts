import {
  DefaultState,
  DefaultStore,
  InitialState,
  Payload,
  PlainObject,
  PlayerId,
  PlayerName,
} from '../../utils/interfaces';

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

export interface UeSoIssoStore extends DefaultStore {
  deck: Word[];
  turnOrder: PlayerId[];
  gameOrder: PlayerId[];
  usedWords: UsedWords;
  currentWords: Word[];
  currentSuggestions: PlainObject[];
  currentWord?: any;
  guess?: any;
  validSuggestions?: any;
  outcome?: any;
}

export interface UeSoIssoState extends DefaultState {
  gameOrder;
  guesserId?: PlayerId;
  controllerId?: PlayerId;
  groupScore?: any;
  words?: any;
  guess?: any;
  secretWord?: any;
  suggestions?: any;
  validSuggestions?: any;
  group?: any;

  [key: string]: any;
}

export interface UeSoIssoInitialState extends InitialState {
  store: UeSoIssoStore;
  state: UeSoIssoState;
}

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
  action:
    | 'SUBMIT_VOTES'
    | 'SUBMIT_SUGGESTIONS'
    | 'SUBMIT_VALIDATION'
    | 'SUBMIT_OUTCOME'
    | 'VALIDATE_SUGGESTION'
    | 'SEND_GUESS';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | UeSoIssoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | UeSoIssoStore;
