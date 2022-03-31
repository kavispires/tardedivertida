export type GameId = string;
export type GameName = string;
export type GameCode = string;
export type DateMilliseconds = number;
export type Language = 'en' | 'pt';
export type PlayerId = string;
export type PlayerName = string;
export type PlayerAvatarId = string;
export type Primitive = string | number | boolean | symbol | null;
export type CardId = string;
export type ImageCardId = string;
export type GameOrder = PlayerId[];
export type TurnOrder = PlayerId[];
export type DualLanguageValue = {
  en: string;
  pt: string;
};

// COMMON INTERFACES

export interface PlainObject {
  [key: string]: any;
}

export type BooleanDictionary = {
  [key: string]: boolean;
};

export type NumberDictionary = {
  [key: string]: number;
};

export type StringDictionary = {
  [key: string]: string;
};

export type ObjectDictionary = {
  [key: string]: PlainObject;
};

export interface FirebaseContext {
  [key: string]: any;
}

export interface CreateGamePayload {
  gameCode: GameCode;
  language: string;
  options?: PlainObject;
}

export interface LoadGamePayload {
  gameId: GameId;
}

export interface Engine {
  getInitialState: any;
  getNextPhase: any;
  playerCounts: PlayerCounts;
  submitAction: any;
}

export interface AddPlayerPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
  playerAvatarId: PlayerAvatarId;
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
  options?: BooleanDictionary;
}

export interface PlayerCounts {
  MIN: number;
  MAX: number;
}

export interface DefaultState {
  phase: string;
  round: Round;
  updatedAt: DateMilliseconds;
  lastRound?: boolean;
  gameEndedAt?: DateMilliseconds;
}

export interface DefaultStore {
  language: Language;
  options?: BooleanDictionary;
  [key: string]: any;
}

export interface InitialState {
  meta: Meta;
  players: Players;
  store: any;
  state: any;
}

export interface InitialStateArgs {
  gameId: GameId;
  gameName: GameName;
  uid: string;
  language: string;
  playerCounts: PlayerCounts;
  initialPhase: string;
  totalRounds: number;
  store: PlainObject;
  options?: PlainObject;
}

export interface Round {
  current: number;
  total: number;
}

export interface Player {
  id: PlayerId;
  avatarId: PlayerAvatarId;
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

export interface Team {
  members: PlayerId[];
  name: string;
  score: number;
}

export interface Teams {
  [key: string]: Team;
}

export interface Payload {
  gameId: GameId;
  gameName: GameName;
  playerId: PlayerId;
  [key: string]: any;
}

export interface ExtendedPayload {
  gameId: GameId;
  gameName: GameName;
  [key: string]: any;
}

export interface SubmitGuessPayload extends Payload {
  guess: string | number;
}

export interface SubmitVotesPayload extends Payload {
  votes: PlainObject;
}

export interface SubmitVotePayload extends Payload {
  vote: string;
}

export interface StateAndStoreReferences {
  sessionRef: FirebaseFirestore.CollectionReference;
  stateDoc: FirebaseFirestore.DocumentSnapshot;
  storeDoc: FirebaseFirestore.DocumentSnapshot;
  state: FirebaseFirestore.DocumentData | PlainObject;
  store: FirebaseFirestore.DocumentData | PlainObject;
}

export interface SetPayload {
  players?: PlainObject | Players;
  state?: PlainObject;
  store?: PlainObject;
}

export interface UpdatePayload {
  players?: PlainObject | Players;
  state?: PlainObject;
  store?: PlainObject;
  meta?: PlainObject;
}

export interface SaveGamePayload {
  set?: SetPayload;
  update?: UpdatePayload;
}

export interface UpdatePlayerArgs {
  collectionName: GameName;
  gameId: GameId;
  playerId: PlayerId;
  actionText: string;
  shouldReady: boolean;
  change: PlainObject;
  nextPhaseFunction?: any;
}

export interface UpdateStoreArgs {
  collectionName: GameName;
  gameId: GameId;
  playerId: PlayerId;
  actionText: string;
  change: PlainObject;
  nextPhaseFunction?: any;
}

export interface UpdateStateArgs {
  collectionName: GameName;
  gameId: GameId;
  playerId: PlayerId;
  actionText: string;
  change: PlainObject;
  nextPhaseFunction?: any;
}

export interface UsedWord {
  id: string;
  playerName?: PlayerName | null;
  uniqueSuggestions?: string[] | [];
  commonSuggestions?: string[] | [];
  votes: 0;
}

interface NewScores {
  [key: string]: {
    playerId: PlayerId;
    name: PlayerName;
    previousScore: number;
    gainedPoints: number[];
    newScore: number;
  };
}

interface RankingEntry {
  playerId: PlayerId;
  name: PlayerName;
  previousScore: number;
  gainedPoints: number[];
  newScore: number;
}
