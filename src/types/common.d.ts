/**
 * Unique identifier string used throughout the application for entities like games, players, and resources
 */
type UID = string;

/**
 * Timestamp in milliseconds since Unix epoch
 */
type DateMilliseconds = number;

/**
 * Supported languages in the application
 */
type Language = 'en' | 'pt';

/**
 * Basic primitive types in JavaScript
 */
type Primitive = string | number | boolean | symbol | null;

/**
 * Array of UIDs representing the order of games
 */
type GameOrder = UID[];

/**
 * Array of UIDs representing the turn order of players
 */
type TurnOrder = UID[];

/**
 * Object containing translations in both supported languages
 */
type DualLanguageValue = {
  /**
   * English translation
   */
  en: string;
  /**
   * Portuguese translation
   */
  pt: string;
};

/**
 * Represents a dictionary object with keys of type UID and values of type T.
 */
type Dictionary<T> = Record<UID, T>;

/**
 * Represents a plain object with dynamic keys and any values.
 */
type PlainObject = {
  [key: string]: any;
};

/**
 * Represents a plain object with dynamic keys and any values.
 */
type UnknownObject = {
  [key: string]: any;
};

// Function compositions

/**
 * Generic component type that accepts any arguments and returns any value
 */
type GenericComponent = (...args: any) => any;

/**
 * Generic function type that accepts any arguments and returns void
 * @deprecated Use more specific function types instead
 */
type GenericFunction = (...args: any) => void;

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
/**
 * Color scheme options for the application theme
 */
type ColorScheme = 'light' | 'dark' | string;

/**
 * Available color options used throughout the application for theming and styling
 */
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
  gameId: string;
  gameName: string;
};

/**
 * Standard HTML element props for React components
 */
type ElementProps<TElement = HTMLDivElement> = React.HTMLAttributes<TElement>;

/**
 * HTML element props with required children for React components
 */
type ElementPropsWithChildren<TElement = HTMLDivElement> = {
  children: React.ReactNode;
} & React.HTMLAttributes<TElement>;

/**
 * Error response type that can either contain an error message or be null
 */
type ResponseError = {
  message: string;
} | null;

/**
 * Utility type that flattens the TypeScript type representation for better readability in IDE tooltips
 */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
