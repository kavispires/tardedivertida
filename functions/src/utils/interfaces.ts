export interface PlainObject {
  [key: string]: any;
}

export interface Meta {
  gameId: string;
  gameName: string;
  createdAt: number;
  createdBy: string;
  min: number;
  max: number;
  isLocked: boolean;
}

export interface Player {
  avatarId: string;
  name: string;
  ready: boolean;
  score: number;
  updatedAt?: number;
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

// FROM THIS LINE DOWN I HAS TO BE REVIEWED
export interface InfoPlayer {
  avatarId: string;
  name: string;
  [key: string]: any;
}

export interface StatePlayer {
  name: string;
  ready: boolean;
  score: number;
  [key: string]: any;
}

export interface InfoPlayers {
  [key: string]: InfoPlayer;
}

export interface StatePlayers {
  [key: string]: StatePlayer;
}

export interface ArteRuimInfo {
  players: InfoPlayers;
  isLocked: boolean;
  round: number;
  [key: string]: any;
}
