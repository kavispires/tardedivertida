import { OUTCOME, UE_SO_ISSO_ACHIEVEMENTS, UE_SO_ISSO_ACTIONS } from './constants';

export type UeSoIssoGameOptions = {
  /**
   * Use only 3 cards instead of 5 for the word selection
   */
  fewerCards: boolean;
  /**
   * Add bot that write suggestions to eliminate common clues
   */
  withBot: boolean;
  /**
   * UI option to time clue writing
   */
  withTimer: boolean;
  /**
   * UI option to display hints (timing answering)
   */
  withHints: boolean;
};

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

type Outcome = keyof typeof OUTCOME;

export interface PlayerSuggestion {
  suggestion: string;
  playerId: PlayerId;
  invalid: boolean;
}

export interface PastSuggestion extends TextCard {
  suggestions: PlayerSuggestion[];
  guesserId: PlayerId;
  outcome: Outcome;
}

export interface UeSoIssoStore extends DefaultStore {
  deck?: TextCard[];
  turnOrder?: PlayerId[];
  gameOrder?: PlayerId[];
  usedWords?: UsedWords;
  currentWords?: TextCard[];
  currentSuggestions?: PlainObject[];
  currentWord?: any;
  guess?: any;
  validSuggestions?: any;
  outcome?: any;
}

export interface UeSoIssoState extends DefaultState {
  gameOrder?: PlayerId[];
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

export type UeSoIssoAchievement = keyof typeof UE_SO_ISSO_ACHIEVEMENTS;

export interface UeSoIssoInitialState extends InitialState {
  store: UeSoIssoStore;
  state: UeSoIssoState;
}

export interface SubmitSuggestionsPayload extends Payload {
  suggestions: string[];
}

export type CurrentSuggestions = Record<string, string[]>;

export interface SubmitSuggestionsValidationPayload extends Payload {
  validSuggestions: PlayerSuggestion[];
}

export interface ConfirmGuessPayload extends Payload {
  guess: string;
}

export interface UeSoIssoSubmitAction extends Payload {
  action: keyof typeof UE_SO_ISSO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | UeSoIssoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | UeSoIssoStore;
