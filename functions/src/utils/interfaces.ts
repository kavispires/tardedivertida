export type GameId = string;
export type GameName = string;
export type GameCode = string;
export type DateMilliseconds = number;
export type PlayerName = string;

export interface PlainObject {
  [key: string]: any;
}

export interface FirebaseContext {
  [key: string]: any;
}

export interface CreateGamePayload {
  gameCode: GameCode;
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

export interface LockGamePayload {
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

export interface ArteRuimStore {
  usedCards: string[];
  previousDrawings: any[];
  currentCards: string[];
  currentDrawings: DrawingEntry[];
  currentVoting: any;
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
