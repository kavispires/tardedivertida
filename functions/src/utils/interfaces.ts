export interface BasicObject {
  [key: string]: any;
}

export interface Meta {
  id: string;
  game: string;
  createdAt: number;
  createdBy: string;
  min: number;
  max: number;
}

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

export interface Player {
  avatarId: string;
  name: string;
  ready: boolean;
  score: number;
}

export interface Players {
  [key: string]: Player;
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

export interface ArteRuimStore {
  usedCards: string[];
  previousDrawings: any;
  [key: string]: any;
}

export interface ArteRuimState {
  phase: string;
  [key: string]: any;
}

export interface ArteRuimInitialState {
  meta: Meta;
  info: ArteRuimInfo;
  store: ArteRuimStore;
  state: ArteRuimState;
}
