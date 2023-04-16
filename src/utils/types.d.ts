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
type CardId = string;
type ImageCardId = string;
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

interface Me {
  id: string;
  isAdmin: boolean;
  names: string[];
  avatars: AvatarId[];
  gender?: string;
  statistics: {
    gamesPlayed: number;
    uniqueGamesPlayed: number;
    winnableGames: number;
    win: number;
    last: number;
    achievements: number;
    lastPlay: number;
    totalPlayDuration: number;
  };
  games: Record<GameName, GameUserEntry[]>;
  blurredImages?: Record<ImageCardId, true>;
}
interface Player {
  id: PlayerId;
  name: PlayerName;
  avatarId: PlayerAvatarId;
  updatedAt: DateMilliseconds;
  ready: boolean;
  [key: string]: any;
}

type GamePlayer = Player | PlainObject;

interface GameState {
  phase: string;
  updatedAt?: DateMilliseconds;
  round: GameRound;
  [key: string]: any;
}

type SessionProps = {
  gameId: GameId;
};

type GameInfo = {
  gameCode: GameCode;
  gameName: GameName;
  version: string;
  title: DualLanguageValue;
  popularName: DualLanguageValue;
  basedOn: string;
  summary: DualLanguageValue;
  appearance: {
    clouds: string;
    color: string;
    backgroundColor?: string;
  };
  rules: {
    pt: string[];
    en: string[];
  };
  playerCount: {
    best?: number;
    recommended: number[];
    min: number;
    max: number;
  };
  duration?: {
    base: number;
    perPlayer: number;
  };
  tags: string[];
  available: {
    pt: boolean;
    en: boolean;
  };
  options?: {
    label: string;
    key: string;
    on: string;
    off: string;
    description?: string;
  }[];
  mobileFriendly?: boolean;
};

type GameTag = {
  label: DualLanguageValue;
  color: string;
  index: number;
  group: 'dynamics' | 'turns' | 'skills' | 'actions' | 'emotions' | 'features' | 'other';
};

type GameMeta = {
  createdAt: DateMilliseconds;
  createdBy: string;
  gameId: GameId;
  gameName: GameName;
  isComplete: boolean;
  isLocked: boolean;
  language: GameLanguage;
  max: number;
  min: number;
  options?: BooleanDictionary;
  replay: number;
};

type GameRound = {
  current: number;
  total: number;
  forceLastRound: boolean;
};

interface GamePlayers {
  [key: string]: Player;
}

type CanvasLine = number[];
type CanvasSetLine = React.Dispatch<React.SetStateAction<CanvasLine[]>>;
type GenericComponent = (...args: any) => any;
type GenericFunction = (...args: any) => void;
type BooleanFunction = (...args: any) => boolean;
type ButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

type PhaseProps = {
  players: GamePlayers;
  state: GameState;
  info: GameInfo;
  meta: GameMeta;
};

type AnnouncementProps = {
  announcement: JSX.Element;
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

/**
 * Animation types
 * For examples check: https://animate.style/
 */
type AnimationType =
  | 'backInDown'
  | 'backInLeft'
  | 'backInRight'
  | 'backInUp'
  | 'backOutDown'
  | 'backOutLeft'
  | 'backOutRight'
  | 'backOutUp'
  | 'bounce'
  | 'bounceIn'
  | 'bounceInDown'
  | 'bounceInLeft'
  | 'bounceInRight'
  | 'bounceInUp'
  | 'bounceOut'
  | 'bounceOutDown'
  | 'bounceOutLeft'
  | 'bounceOutRight'
  | 'bounceOutUp'
  | 'fadeIn'
  | 'fadeInDown'
  | 'fadeInDownBig'
  | 'fadeInLeft'
  | 'fadeInLeftBig'
  | 'fadeInRight'
  | 'fadeInRightBig'
  | 'fadeInUp'
  | 'fadeInUpBig'
  | 'fadeInTopLeft'
  | 'fadeInTopRight'
  | 'fadeInBottomLeft'
  | 'fadeInBottomRight'
  | 'fadeOut'
  | 'fadeOutDown'
  | 'fadeOutDownBig'
  | 'fadeOutLeft'
  | 'fadeOutLeftBig'
  | 'fadeOutRight'
  | 'fadeOutRightBig'
  | 'fadeOutUp'
  | 'fadeOutUpBig'
  | 'fadeOutTopLeft'
  | 'fadeOutTopRight'
  | 'fadeOutBottomLeft'
  | 'fadeOutBottomRight'
  | 'flash'
  | 'flip'
  | 'flipInX'
  | 'flipInY'
  | 'flipOutX'
  | 'flipOutY'
  | 'heartBeat'
  | 'hinge'
  | 'jackInTheBox'
  | 'jello'
  | 'lightSpeedInLeft'
  | 'lightSpeedInRight'
  | 'lightSpeedOutLeft'
  | 'lightSpeedOutRight'
  | 'pulse'
  | 'rollIn'
  | 'rollOut'
  | 'rotateIn'
  | 'rotateInDownLeft'
  | 'rotateInDownRight'
  | 'rotateInUpLeft'
  | 'rotateInUpRight'
  | 'rotateOut'
  | 'rotateOutDownLeft'
  | 'rotateOutDownRight'
  | 'rotateOutUpLeft'
  | 'rotateOutUpRight'
  | 'rubberBand'
  | 'shakeX'
  | 'shakeY'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideOutDown'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'slideOutUp'
  | 'swing'
  | 'tada'
  | 'wobble'
  | 'zoomIn'
  | 'zoomInDown'
  | 'zoomInLeft'
  | 'zoomInRight'
  | 'zoomInUp'
  | 'zoomOut'
  | 'zoomOutDown'
  | 'zoomOutLeft'
  | 'zoomOutRight'
  | 'zoomOutUp';

type TextCard = {
  id: CardId;
  text: string;
};

interface Achievement {
  type: string;
  playerId: PlayerId;
  value: Primitive;
}

interface AchievementReference {
  [key: string]: {
    Icon: ReactNode;
    title: DualLanguageValue;
    description?: DualLanguageValue;
  };
}

type ArteRuimCard = {
  id: CardId;
  text: string;
  level: number;
};

type ArteRuimGroup = {
  id: string;
  theme: string;
  cards: Record<CardId, string>;
};

type ArteRuimPair = {
  id: string;
  values: [string, string];
};

type ContenderCard = {
  id: CardId;
  name: DualLanguageValue;
  exclusivity?: Language;
};

type CrimeTile = {
  id: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  values: DualLanguageValue[];
  type: string;
  specific?: string | null;
  tags?: Record<number | string, string[]>;
};

type GroupQuestionCard = {
  id: CardId;
  prefix: string;
  number: number;
  suffix: string;
};

type NamingPromptCard = {
  id: CardId;
  text: string;
  set: string;
  level: number;
};

type OpposingIdeaCard = {
  id: CardId;
  left: string;
  right: string;
};

type SpyLocation = {
  id: CardId;
  name: string;
  roles: string[];
};

type TestimonyQuestionCard = {
  id: CardId;
  question: string;
};

type ThemeCard = {
  id: CardId;
  text: string;
  description?: string;
};

type Topic = {
  id: CardId;
  text: string;
  custom?: boolean;
};

type DatingCandidateCard = {
  id: CardId;
  text: string;
  type: 'fun-fact' | 'interest' | 'need';
};

type DatingCandidateImageCard = {
  id: CardId;
  name: DualLanguageValue;
  type: 'head' | 'body';
};

type DilemmaCard = {
  id: CardId;
  prompt: string;
  left: string;
  right: string;
  nsfw?: boolean;
};

type QuantitativeQuestionCard = {
  id: CardId;
  question: string;
  scale?: boolean;
};

type MovieCard = {
  id: CardId;
  prefix: string;
  suffix: string;
};

type MovieReview = {
  id: CardId;
  text: string;
  type: 'good' | 'bad';
};
