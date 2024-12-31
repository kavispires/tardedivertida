// Singular
type CardId = string;
type ImageCardId = string;
type AvatarId = string;
type DateMilliseconds = number;
type GameCode = string;
type GameId = string;
type GameName = string;
type PlayerId = string;
type PlayerName = string;
type ColorScheme = 'light' | 'dark' | string;

// Composed
type Primitive = string | number | boolean | symbol | null;

/**
 * Represents a dictionary object with keys of type CardId and values of type T.
 */
type Dictionary<T> = Record<CardId, T>;

/**
 * Represents a plain object with dynamic keys and any values.
 */
type PlainObject = {
  [key: string]: any;
};

type BooleanDictionary = Dictionary<boolean>;

type NumberDictionary = Dictionary<number>;

type StringDictionary = Dictionary<string>;

type ObjectDictionary = Dictionary<PlainObject>;

type ArrayDictionary<T = string> = {
  [key: string]: T[];
};

// Function compositions
type GenericComponent = (...args: any) => any;
type GenericFunction = (...args: any) => void;
type BooleanFunction = (...args: any) => boolean;
type ButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

// Language
type Language = 'en' | 'pt';
type GameLanguage = Language;
type DualLanguageValue = {
  en: string;
  pt: string;
};

// Player compositions
type GameOrder = PlayerId[];
type TurnOrder = PlayerId[];

// Firebase

/**
 * Generic HttpsCallable function with payload
 */
type FirebaseResponse<TData = any> = {
  data: TData;
};

/**
 * Represents the context for Firebase operations.
 */
type FirebaseContext = {
  [key: string]: any;
};

// Canvas

/**
 * Represents a line on a canvas.
 */
type CanvasLine = number[];

/**
 * Type definition for the CanvasSetLine function.
 * It is a React dispatch function that sets the state of an array of CanvasLine objects.
 * @param {React.SetStateAction<CanvasLine[]>} newState - The new state value for the array of CanvasLine objects.
 */
type CanvasSetLine = React.Dispatch<React.SetStateAction<CanvasLine[]>>;

// TD Specific

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

/**
 * Represents the progress of a group.
 */
type GroupProgress = {
  correct: number;
  mistakes: number;
  outcome: Outcome;
  attempts: Outcome[];
  score: number;
  goal: number;
};

/**
 * Represents a game redirect object.
 */
type Redirect = {
  redirectAt: DateMilliseconds;
  gameId: GameId;
  gameName: GameName;
};

type ElementProps<TElement = HTMLDivElement> = React.HTMLAttributes<TElement>;

type ElementPropsWithChildren<TElement = HTMLDivElement> = {
  children: React.ReactNode;
} & React.HTMLAttributes<TElement>;

type ResponseError = {
  message: string;
} | null;
