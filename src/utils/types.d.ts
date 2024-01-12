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

interface GameUserEntry {
  gameId: GameId;
  startedAt: number;
  endedAt: number;
  playerCount: number;
  placement: number;
  win?: boolean;
  last?: boolean;
  achievements: AchievementKey[];
}

interface GameUserStatistics {
  gameName: GameName;
  // Total game plays count
  plays: number;
  // Boolean if the game is winnable
  isWinnable: boolean;
  // Total number of wins
  win: number;
  // Total number of times in last place
  last: number;
  // Total number of unique achievements
  achievements: Record<AchievementKey, number>;
  // Total game play duration
  totalPlayDuration: number;
  // The latest game played
  latestPlay: GameUserEntry;
  // The game with the shortest duration
  shortestPlay: GameUserEntry;
  // The game with the longest duration
  longestPlay: GameUserEntry;
  // The first game played with the earliest startedAt
  firstPlay: GameUserEntry;
  // The game rating
  rating: number;
  // Average Player Count
  averagePlayerCount: number;
}

type AvatarId = string;
type AchievementKey = string;

interface Me {
  id: string;
  isAdmin: boolean;
  names: string[];
  language?: Language;
  // Top 3 avatars
  avatars: AvatarId[];
  gender?: string;
  statistics: {
    // Total game plays count
    plays: number;
    // Total different games
    uniqueGamesPlayed: number;
    // Total games with end goal / are winnable
    winnableGames: number;
    // Total number of wins
    win: number;
    // Total number of times in last place
    last: number;
    // Total number of unique achievements
    achievements: number;
    // Total game play duration
    totalPlayDuration: number;
    // The latest game played
    latestPlay: GameUserEntry;
    // The game with the shortest duration
    shortestPlay: GameUserEntry;
    // The game with the longest duration
    longestPlay: GameUserEntry;
    // The first game played with the earliest startedAt
    firstPlay: GameUserEntry;
    // game with the most entries
    mostPlayedGame: GameName;
    // game with the fewest entries
    leastPlayedGame: GameName;
    // Game with the highest rating
    favoriteGame: GameName;
    // Game with the lowest rating
    leastFavoriteGame: GameName;
    // Game with most wins
    bestAtGame: GameName;
    // Game with most last
    worstAtGame: GameName;
    // Average Player Count
    averagePlayerCount: number;
  };
  games: Record<GameName, GameUserStatistics>;
  blurredImages?: Record<ImageCardId, true>;
  // The latest games statistics
  today: {
    plays: number;
    win: number;
    last: number;
    achievements: number;
    duration: number;
    games: GameUserEntry[];
  };
  daily: {
    total: number;
    longestStreak: number;
    streak: number;
    todaysChallenge?: {
      id: string; // Format YYYY-MM-DD
      number: number;
      victory: boolean;
      hearts: number;
      letters: string[];
    };
  };
}

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
  available: boolean;
  options?: {
    label: string;
    key: string;
    on: string;
    off: string;
    description?: string;
    disabled?: boolean;
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
