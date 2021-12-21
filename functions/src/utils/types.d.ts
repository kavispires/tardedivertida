export type GameId = string;
export type GameName = string;
export type GameCode = string;
export type DateMilliseconds = number;
export type Language = string;
export type PlayerId = string;
export type PlayerName = string;
export type PlayerAvatarId = string;
export type Primitive = string | number | boolean | symbol | null;
export type ImageCard = string;
export type GameOrder = PlayerId[];
export type TurnOrder = PlayerId[];

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

export interface Engine {
  getInitialState: any;
  getNextPhase: any;
  playerCount: PlayerCount;
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
}

export interface PlayerCount {
  MIN: number;
  MAX: number;
}

export interface DefaultState {
  phase: string;
  round: Round;
  updatedAt: DateMilliseconds;
  gameEndedAt?: DateMilliseconds;
}

export interface DefaultStore {
  language: Language;
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
  playerCount: PlayerCount;
  initialPhase: string;
  totalRounds: number;
  store: PlainObject;
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

export interface EspiaoEntreNosAdminPayload extends Payload {
  action: string | any;
  [key: string]: any;
}

// // ONDA_TELEPATICA
// export interface OndaTelepaticaCard {
//   id: string;
//   left: string;
//   right: string;
//   target: number;
//   needle: number;
//   clue: string;
//   rival: number;
// }

// export interface OndaTelepaticaCards {
//   [key: string]: UsedWord;
// }

// export interface OndaTelepaticaStore {
//   teams: PlainObject;
//   usedCards: OndaTelepaticaCards;
//   currentCard: string[];
//   [key: string]: any;
// }

// export interface OndaTelepaticaState {
//   phase: string;
//   round: number;
//   teams: PlainObject;
//   psychic?: PlayerName;
//   rivalPsychic?: PlayerName;
//   [key: string]: any;
// }

// export interface OndaTelepaticaInitialState {
//   meta: Meta;
//   players: Players;
//   store: OndaTelepaticaStore;
//   state: OndaTelepaticaState;
// }

// export interface OndaTelepaticaSubmitSidesPayload extends Payload {
//   cardId: string;
// }

// export interface OndaTelepaticaSubmitCluePayload extends Payload {
//   clue: string;
// }

// export interface OndaTelepaticaSubmitGuessPayload extends Payload {
//   guess: number;
// }

// export interface OndaTelepaticaSubmitRivalGuessPayload extends Payload {
//   rivalGuess: number;
// }
