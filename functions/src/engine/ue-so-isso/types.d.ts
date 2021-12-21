import {
  DefaultState,
  DefaultStore,
  InitialState,
  Payload,
  PlainObject,
  PlayerId,
  PlayerName,
} from '../../utils/types';

interface Word {
  id: string;
  text: string;
}

interface AllWords {
  [key: string]: Word;
}

interface UsedWord {
  id: string;
  text: string;
  playerName?: PlayerName | null;
  uniqueSuggestions?: string[] | [];
  commonSuggestions?: string[] | [];
  votes: 0;
}

interface UsedWords {
  [key: string]: UsedWord;
}

interface UeSoIssoStore extends DefaultStore {
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

interface UeSoIssoState extends DefaultState {
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

interface UeSoIssoInitialState extends InitialState {
  store: UeSoIssoStore;
  state: UeSoIssoState;
}

interface SubmitSuggestionsPayload extends Payload {
  suggestions: string[];
}

interface CurrentSuggestions {
  [key: string]: string[];
}

interface SubmitSuggestionsValidationPayload extends Payload {
  validSuggestions: PlainObject[];
}

interface ConfirmGuessPayload extends Payload {
  guess: string;
}

interface UeSoIssoSubmitAction extends Payload {
  action:
    | 'SUBMIT_VOTES'
    | 'SUBMIT_SUGGESTIONS'
    | 'SUBMIT_VALIDATION'
    | 'SUBMIT_OUTCOME'
    | 'VALIDATE_SUGGESTION'
    | 'SEND_GUESS';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | UeSoIssoState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | UeSoIssoStore;
