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
  replay: number;
}

export interface Player {
  avatarId: string;
  name: PlayerName;
  ready: boolean;
  score: number;
  updatedAt?: DateMilliseconds;
  team?: string;
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

export interface Team {
  members: PlayerName[];
  name: string;
  score: number;
}

export interface Teams {
  [key: string]: Team;
}

export interface Payload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
}

// ARTE_RUIM

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

export interface SubmitDrawingPayload extends Payload {
  drawing: string;
  cardId: string;
}

export interface SubmitVotingPayload extends Payload {
  votes: PlainObject;
}

// ESPIAO_ENTRE_NOS

export type LocationId = string;

export interface LocationCard {
  id: LocationId;
  name: string;
  roles: string[];
  spy: PlayerName | null;
  [key: string]: any;
}

export interface EspiaoEntreStore {
  usedLocations: LocationId[];
  currentLocation?: LocationCard | PlainObject;
  [key: string]: any;
}

export interface EspiaoEntreNosState {
  phase: string;
  round: number;
  spy?: PlayerName;
  location?: LocationCard;
  [key: string]: any;
}

export interface EspiaoEntreNosInitialState {
  meta: Meta;
  players: Players;
  store: EspiaoEntreStore;
  state: EspiaoEntreNosState;
}

// ONDA_TELEPATICA
export interface OndaTelepaticaCard {
  id: string;
  left: string;
  right: string;
  target: number;
  needle: number;
  clue: string;
  rival: number;
}

export interface OndaTelepaticaCards {
  [key: string]: UsedWord;
}

export interface OndaTelepaticaStore {
  teams: PlainObject;
  usedCards: OndaTelepaticaCards;
  currentCard: string[];
  [key: string]: any;
}

export interface OndaTelepaticaState {
  phase: string;
  round: number;
  teams: PlainObject;
  psychic?: PlayerName;
  rivalPsychic?: PlayerName;
  [key: string]: any;
}

export interface OndaTelepaticaInitialState {
  meta: Meta;
  players: Players;
  store: OndaTelepaticaStore;
  state: OndaTelepaticaState;
}

export interface OndaTelepaticaSubmitSidesPayload extends Payload {
  cardId: string;
}

export interface OndaTelepaticaSubmitCluePayload extends Payload {
  clue: string;
}

export interface OndaTelepaticaSubmitGuessPayload extends Payload {
  guess: number;
}

export interface OndaTelepaticaSubmitRivalGuessPayload extends Payload {
  rivalGuess: number;
}

// UE_SO_ISSO

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
  currentWords: PlainObject[];
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
