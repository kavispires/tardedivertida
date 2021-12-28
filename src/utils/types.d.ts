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

type GamePlayer = Player | PlainObject;

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

type GameRound = {
  current: number;
  total: number;
};

interface GameState {
  phase: string;
  round: GameRound;
  [key: string]: any;
}

interface GamePlayers {
  [key: string]: Player;
}

type CanvasLine = number[];
type CanvasSetLine = React.Dispatch<React.SetStateAction<CanvasLine[]>>;
type GenericFunction = (...args: any) => void;

type PhaseProps = {
  players: GamePlayers;
  state: GameState;
  info: GameInfo;
};

type GameTeam = {
  name?: string;
  score: number;
  members: PlayerId[];
};

type GameTeams = {
  [key: string]: GameTeam;
};
