type GameId = string;
type GameName = string;
type GameCode = string;
type DateMilliseconds = number;
type Language = 'en' | 'pt';
type PlayerId = string;
type PlayerName = string;
type PlayerAvatarId = string;
type Primitive = string | number | boolean | symbol | null;
type CardId = string;
type ImageCardId = string;
type GameOrder = PlayerId[];
type TurnOrder = PlayerId[];
type DualLanguageValue = {
  en: string;
  pt: string;
};

// COMMON INTERFACES

interface PlainObject {
  [key: string]: any;
}

type BooleanDictionary = {
  [key: string]: boolean;
};

type NumberDictionary = {
  [key: string]: number;
};

type StringDictionary = {
  [key: string]: string;
};

type ObjectDictionary = {
  [key: string]: PlainObject;
};

interface FirebaseContext {
  [key: string]: any;
}

interface CreateGamePayload {
  gameCode: GameCode;
  language: string;
  options?: PlainObject;
}

interface LoadGamePayload {
  gameId: GameId;
}

interface Engine {
  getInitialState: any;
  getNextPhase: any;
  playerCounts: PlayerCounts;
  submitAction: any;
}

interface AddPlayerPayload {
  gameId: GameId;
  gameName: GameName;
  playerName: PlayerName;
  playerAvatarId: PlayerAvatarId;
}

interface BasicGamePayload {
  gameId: GameId;
  gameName: GameName;
}

interface Meta {
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

interface PlayerCounts {
  MIN: number;
  MAX: number;
}

interface DefaultState {
  phase: string;
  round: Round;
  updatedAt: DateMilliseconds;
  lastRound?: boolean;
  gameEndedAt?: DateMilliseconds;
}

interface DefaultStore {
  language: Language;
  options?: BooleanDictionary;
  [key: string]: any;
}

interface InitialState {
  meta: Meta;
  players: Players;
  store: any;
  state: any;
}

interface InitialStateArgs {
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

interface Round {
  current: number;
  total: number;
}

interface Player {
  id: PlayerId;
  avatarId: PlayerAvatarId;
  name: PlayerName;
  ready: boolean;
  score: number;
  updatedAt?: DateMilliseconds;
  team?: string;
  [key: string]: any;
}

interface Players {
  [key: string]: Player;
}

interface Team {
  members: PlayerId[];
  name: string;
  score: number;
}

interface Teams {
  [key: string]: Team;
}

interface Payload {
  gameId: GameId;
  gameName: GameName;
  playerId: PlayerId;
  [key: string]: any;
}

interface ExtendedPayload {
  gameId: GameId;
  gameName: GameName;
  [key: string]: any;
}

interface SubmitGuessPayload extends Payload {
  guess: string | number;
}

interface SubmitVotesPayload extends Payload {
  votes: PlainObject;
}

interface SubmitVotePayload extends Payload {
  vote: string;
}

interface StateAndStoreReferences {
  sessionRef: FirebaseFirestore.CollectionReference;
  stateDoc: FirebaseFirestore.DocumentSnapshot;
  storeDoc: FirebaseFirestore.DocumentSnapshot;
  state: FirebaseFirestore.DocumentData | PlainObject;
  store: FirebaseFirestore.DocumentData | PlainObject;
}

interface SetPayload {
  players?: PlainObject | Players;
  state?: PlainObject;
  store?: PlainObject;
}

interface UpdatePayload {
  players?: PlainObject | Players;
  state?: PlainObject;
  store?: PlainObject;
  meta?: PlainObject;
}

interface SaveGamePayload {
  set?: SetPayload;
  update?: UpdatePayload;
}

interface UpdatePlayerArgs {
  collectionName: GameName;
  gameId: GameId;
  playerId: PlayerId;
  actionText: string;
  shouldReady: boolean;
  change: PlainObject;
  nextPhaseFunction?: any;
}

interface UpdateStoreArgs {
  collectionName: GameName;
  gameId: GameId;
  playerId: PlayerId;
  actionText: string;
  change: PlainObject;
  nextPhaseFunction?: any;
}

interface UpdateStateArgs {
  collectionName: GameName;
  gameId: GameId;
  playerId: PlayerId;
  actionText: string;
  change: PlainObject;
  nextPhaseFunction?: any;
}

interface UsedWord {
  id: string;
  playerName?: PlayerName | null;
  uniqueSuggestions?: string[] | [];
  commonSuggestions?: string[] | [];
  votes: 0;
}

interface NewScore {
  playerId: PlayerId;
  name: PlayerName;
  previousScore: number;
  gainedPoints: number[];
  newScore: number;
}

interface NewScores {
  [key: string]: NewScore;
}

interface RankingEntry {
  playerId: PlayerId;
  name: PlayerName;
  previousScore: number;
  gainedPoints: number[];
  newScore: number;
}