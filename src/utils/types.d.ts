type PlainObject = {
  [key: string]: any;
};
type FirebaseContext = {
  [key: string]: any;
};

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
type DualLanguageValue = {
  en: string;
  pt: string;
};
type Color =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'pink'
  | 'purple'
  | 'teal'
  | 'orange'
  | 'fur'
  | 'navy'
  | 'light-green'
  | 'hot-pink'
  | 'brown'
  | 'forest'
  | 'violet'
  | 'cream'
  | 'none'
  | 'lime'
  | 'black'
  | 'white'
  | 'grey';

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

interface GameState {
  phase: string;
  updatedAt?: DateMilliseconds;
  round: GameRound;
  [key: string]: any;
}

type SessionProps = {
  gameId: GameId;
};

interface GameInfo {
  gameCode: GameCode;
  gameName: GameName;
  version: string;
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
  playerCount: {
    recommended: string;
    min: number;
    max: number;
  };
  tags: string[];
  available: {
    pt: boolean;
    en: boolean;
  };
  options?: {
    label: string;
    key: string;
  }[];
}

type GameRound = {
  current: number;
  total: number;
};

interface GamePlayers {
  [key: string]: Player;
}

type CanvasLine = number[];
type CanvasSetLine = React.Dispatch<React.SetStateAction<CanvasLine[]>>;
type GenericFunction = (...args: any) => void;
type BooleanFunction = (...args: any) => boolean;

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

type GameRanking = {
  playerId: string;
  previousScore: number;
  gainedPoints: number | number[];
  newScore: number;
  [key: string]: any;
}[];
