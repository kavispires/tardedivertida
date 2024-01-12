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

/**
 * Generic HttpsCallable function with payload
 */
type FirebaseResponse<TData = any> = {
  data: TData;
};

type DateMilliseconds = number;
type GameCode = string;
type GameId = string;
type GameName = string;
type GameOrder = PlayerId[];
type ImageCard = string;
type Language = 'en' | 'pt';
type GameLanguage = Language;
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
type AvatarId = string;
type Dictionary<T> = Record<CardId, T>;
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

type GamePlayer<TPlayer = PlainObject> = {
  id: PlayerId;
  name: PlayerName;
  avatarId: PlayerAvatarId;
  updatedAt: DateMilliseconds;
  ready: boolean;
  [key: string]: any;
} & TPlayer;

interface GamePlayers<TPlayer = any> {
  [key: string]: GamePlayer<TPlayer>;
}

type AchievementKey = string;

interface Redirect {
  redirectAt: DateMilliseconds;
  gameId: GameId;
  gameName: GameName;
}

interface GameState<TState = PlainObject, TPlayer = PlainObject> extends TState {
  phase: string;
  updatedAt?: DateMilliseconds;
  round: GameRound;
  players: GamePlayers<TPlayer>;
  redirect?: Redirect;
  [key: string]: any;
}

type SessionProps = {
  gameId: GameId;
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

type CanvasLine = number[];
type CanvasSetLine = React.Dispatch<React.SetStateAction<CanvasLine[]>>;
type GenericComponent = (...args: any) => any;
type GenericFunction = (...args: any) => void;
type BooleanFunction = (...args: any) => boolean;
type ButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

type PhaseProps<TState = PlainObject, TPlayer = PlainObject> = {
  state: GameState<TState, TPlayer>;
  players: GamePlayers<TPlayer>;
  info: GameInfo;
  meta: GameMeta;
};

type AnnouncementProps = {
  announcement: JSX.Element;
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
  | 'headShake'
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

interface Achievement {
  type: string;
  playerId: PlayerId;
  value: Primitive;
}

interface AchievementInfo {
  icon: string;
  title: DualLanguageValue;
  description?: DualLanguageValue;
}

type AchievementReference = Record<string, AchievementInfo>;

interface GroupProgress {
  correct: number;
  mistakes: number;
  outcome: Outcome;
  attempts: Outcome[];
  score: number;
  goal: number;
}
