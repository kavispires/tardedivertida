export interface AllWords {
  [key: string]: TextCard;
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
  deck: TextCard[];
  turnOrder: PlayerId[];
  gameOrder: PlayerId[];
  usedWords: UsedWords;
  currentWords: TextCard[];
  currentSuggestions: PlainObject[];
  currentWord?: any;
  guess?: any;
  validSuggestions?: any;
  outcome?: any;
}

export interface UeSoIssoState extends DefaultState {
  gameOrder: PlayerId[];
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
