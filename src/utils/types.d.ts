type PlainObject = {
  [key: string]: any;
};

type DateMilliseconds = number;
type GameCode = string;
type GameId = string;
type GameLanguage = string;
type GameName = string;
type GameOrder = PlayerId[];
type ImageCard = string;
type Language = 'en' | 'pt';
type PlayerAvatarId = string;
type PlayerId = string;
type PlayerName = string;
type Primitive = string | number | boolean | symbol | null;
type TurnOrder = PlayerId[];

interface Player {
  id: PlayerId;
  name: PlayerName;
  avatarId: PlayerAvatarId;
  updatedAt: DateMilliseconds;
  ready: boolean;
  [key: string]: any;
}

interface Players {
  [key: string]: Player;
}

interface State {
  phase?: string;
  updatedAt?: DateMilliseconds;
  [key: string]: any;
}

type GameSession = {
  gameId: GameId;
};

interface GameInfo {
  gameCode: GameCode;
  gameName: GameName;
  title: {
    pt: string;
    en: string;
  };
  summary: {
    pt: string;
    en: string;
  };
  rules: {
    pt: string[];
    en: string[];
  };
  recommended: string;
  min: number;
  max: number;
  tags: string[];
  available: {
    pt: boolean;
    en: boolean;
  };
}

interface GameState {
  phase: string;
  round: {
    current: number;
    total: number;
  };
  [key: string]: any;
}

interface GamePlayers {
  [key: string]: Player;
}

type CanvasLine = number[];
type CanvasSetLine = React.Dispatch<React.SetStateAction<CanvasLine[]>>;
type GenericFunction = (...args: any) => void;
