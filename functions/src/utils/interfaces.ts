export type GameId = string;
export type GameName = string;
export type GameCode = string;
export type DateMilliseconds = number;
export type PlayerName = string;

// COMMON INTERFACES

export interface PlainObject {
  [key: string]: any;
}

export interface FirebaseContext {
  [key: string]: any;
}

export interface CreateGamePayload {
  gameCode: GameCode;
  language: string;
}

export interface LoadGamePayload {
  gameId: GameId;
}

export interface AddPlayerPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
  playerAvatarId: string;
}

export interface BasicGamePayload {
  gameId: GameId;
  gameName: GameName;
}

export interface Meta {
  gameId: GameId;
  gameName: GameName;
  createdAt: DateMilliseconds;
  createdBy: string;
  min: number;
  max: number;
  isLocked: boolean;
  isComplete: boolean;
  language: string;
}

export interface Player {
  avatarId: string;
  name: PlayerName;
  ready: boolean;
  score: number;
  updatedAt?: DateMilliseconds;
  [key: string]: any;
}

export interface Players {
  [key: string]: Player;
}

export interface MakeMeReadyPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
}

// ARTE RUIM INTERFACES

export interface UsedCard {
  id: string;
  playerName: PlayerName | null;
  drawing: string | null;
  successRate: number;
  [key: string]: any;
}

export interface ArteRuimStore {
  usedCards: UsedCard[];
  currentCards: string[];
  pastDrawings: UsedCard[];
  [key: string]: any;
}

export interface ArteRuimState {
  phase: string;
  round: number;
  [key: string]: any;
}

export interface ArteRuimInitialState {
  meta: Meta;
  players: Players;
  store: ArteRuimStore;
  state: ArteRuimState;
}

export interface DrawingEntry {
  cardId: string | number;
  drawing: string;
  playerName: string;
}

export interface SubmitDrawingPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
  drawing: string;
  cardId: string;
}

export interface SubmitVotingPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
  votes: PlainObject;
}

// UE SO ISSO

export interface UsedWord {
  id: string;
  playerName?: PlayerName | null;
  uniqueSuggestions?: string[] | [];
  commonSuggestions?: string[] | [];
  votes: 0;
}

export interface UsedWords {
  [key: string]: UsedWord;
}

export interface UeSoIssoStore {
  turnOrder: string[];
  usedWords: UsedWords;
  currentWords: string[];
  currentSuggestions: PlainObject[];
  [key: string]: any;
}

export interface UeSoIssoState {
  phase: string;
  round: number;
  guesser?: PlayerName;
  [key: string]: any;
}

export interface UeSoIssoInitialState {
  meta: Meta;
  players: Players;
  store: UeSoIssoStore;
  state: UeSoIssoState;
}

export interface SubmitSuggestionsPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
  suggestions: string[];
}

export interface CurrentSuggestions {
  [key: string]: string[];
}

export interface SubmitSuggestionsValidationPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
  validSuggestions: PlainObject[];
}

export interface ConfirmGuessPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
  guess: string;
}
