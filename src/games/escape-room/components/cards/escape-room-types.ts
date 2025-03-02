type UID = string;

/**
 * Usually composed by `er-<type>-<number>`
 * TODO: TBD
 */
type ERCardId = string;

export interface EscapeRoomEpisode {
  /**
   * The unique id of the escape room episode
   */
  id: UID;
  /**
   * The language of the episode
   */
  language: Language;
  /**
   * The title of the room/episode
   */
  title: string;
  /**
   * The total number of missions in the episode
   * This is not how many missions are under mission, since that object composes all variants of the mission
   */
  total: number;
  /**
   * A episode can have up to 3 levels
   */
  difficulty: 'basic' | 'medium' | 'complex';
  /**
   * The missions
   * Each escape room has different missions, when setting up an episode the host will select if they want a short or long game that determines the number of missions
   */
  missions: Record<UID, Mission[]>;
  /**
   * All cards used in all missions
   */
  cards: Record<string, EscapeRoomCardType>;
  /**
   * Last time the mission was updated
   */
  updatedAt: number;
  /**
   * Flag indicating the episode is ready to be played
   */
  ready: boolean;
}

export interface Mission {
  /**
   * The unique id of the mission (composed by cardId + number + variant)
   */
  id: UID;
  /**
   * The number of the mission (an episode must have at least 1 mission and the numbers are must be sequential from 1 to n)
   */
  number: number;
  /**
   * The card id of the mission
   */
  missionId: CardId;
  /**
   * The name of the mission
   */
  name?: string;
  /**
   * All cards present in this episode
   */
  cardsIds: ERCardId[];
  /**
   * The cards that represent the solution
   */
  solution: {
    /**
     * The cards that represent the solution
     */
    cardsIds: ERCardId[];
    /**
     * Determine if the cards in the solution must be played in order
     */
    type: 'ordered' | 'all' | 'any';
    /**
     * The message displayed when the solution is played
     */
    message: string;
    /**
     * Each mission must have 9 filler cards
     */
    fillersIds: ERCardId[];
  };
}

export const CARD_TYPES = {
  /**
   * The basic card type that give the directives for the players
   */
  MISSION: 'mission',
  /**
   * Card that should be played when the mission is completed
   */
  COMPLETE_MISSION: 'complete-mission',
  /**
   * All other cards in the game that display content
   */
  CONTENT: 'content',
} as const;

export type ERDefaultCard = {
  /**
   * The unique id of the card (usually room prefix + number)
   */
  id: ERCardId;
  /**
   * The type of card which determines its content
   */
  type: (typeof CARD_TYPES)[keyof typeof CARD_TYPES];
  /**
   * Quick description of the card
   */
  doc: string;
  /**
   * Overall style variant (TBD)
   */
  background?: 'default' | string;
  /**
   * All cards should be playable except for missions and some edge cases
   */
  unplayable?: boolean;
  /**
   * Flag indicating the card is a filler card
   * Each room should distribute equal number of cards among the players
   * So these are use to fill the gap
   */
  filler?: boolean;
  /**
   * Content alignment
   */
  align?: 'top' | 'center' | 'bottom';
  /**
   * Content that varies depending on the card type
   */
  content: EscapeRoomCardContentType[];
};

export const CARD_CONTENT_TYPES = {
  TITLE: 'title',
  TEXT_BOX: 'text-box',
  LABEL: 'label',
  SVG_ICON: 'svg-icon',
  MISSION: 'mission',
  COMPLETE_MISSION: 'complete-mission',
  SPRITE: 'sprite',
  SPRITE_GRID: 'sprite-grid',
  SPRITE_SEQUENCE: 'sprite-sequence',
  SPRITE_SHUFFLE: 'sprite-shuffle',
  SPRITE_WHEEL: 'sprite-wheel',
  IMAGE_CARD_COVER: 'image-card-cover',
  IMAGE_CARD: 'image-card',
  IMAGE_CARD_SEQUENCE: 'image-card-sequence',
  VOICE: 'voice',
  AUDIO: 'audio',
  CALENDAR: 'calendar',
  CODEX: 'codex',
  DIGIT: 'digit',
  NUMBER: 'number',
  LETTER: 'letter',
  // CLOCK: 'clock',
  // BATTERY: 'battery',
  // SPEECH_BUBBLE: 'speech-bubble',
  // SURFACE: 'surface', // menu, paper, note, panel
  // PAPER_FRAGMENT: 'paper-fragment',
} as const;

/**
 * Card to describe a mission
 * It has blocks of text with title, subtitle and paragraphs
 */
export type EscapeRoomMissionCardType = ERDefaultCard & {
  type: typeof CARD_TYPES.MISSION;
  number: number;
  name: string;
  content: EscapeRoomCardContentType[];
};

/**
 * Card to be played when the mission is completed
 * It only has a simple and default title, no customizations
 */
export type EscapeRoomCompleteMissionCardType = ERDefaultCard & {
  type: typeof CARD_TYPES.COMPLETE_MISSION;
  // TODO: It should be null but typescript is complaining
  content: null[];
};

/**
 * Card with various content types
 */
export type EscapeRoomContentCardType = ERDefaultCard & {
  type: typeof CARD_TYPES.CONTENT;
  content: EscapeRoomCardContentType[];
};

/**
 * Basic internal types
 */
export type Size = 'small' | 'medium' | 'large';
export type Align = 'left' | 'center' | 'right';
export type Direction = 'horizontal' | 'vertical';
export type BoxVariant = 'contained' | 'boxed' | 'button';
export type ImageCardScale = 1 | 2 | 3;
export type SpriteLibraries = 'items' | 'warehouse-goods' | 'glyphs' | 'alien-signs' | 'emojis';
export type SpriteEntry = {
  library: SpriteLibraries;
  spriteId: string;
  scale?: number;
  rotate?: number;
};

/**
 * Renders a title
 */
export type TitleContent = {
  type: typeof CARD_CONTENT_TYPES.TITLE;
  text: string;
  variant?: BoxVariant;
  size?: Size;
  align?: Align;
};

/**
 * Renders a larger text, used for single word or short phase
 */
export type LabelContent = {
  type: typeof CARD_CONTENT_TYPES.LABEL;
  label: string;
  variant?: BoxVariant;
  size?: Size;
  align?: Align;
};

/**
 * Renders a container with text, paragraph
 */
export type TextBoxContent = {
  type: typeof CARD_CONTENT_TYPES.TEXT_BOX;
  text: string;
  variant?: BoxVariant;
  size?: Size;
  align?: Align;
};

/**
 * Renders a icon from the Escape Room sprite internal library
 */
export type SGVIconContent = {
  type: typeof CARD_CONTENT_TYPES.SVG_ICON;
  iconId: string;
  align?: Align;
};

/**
 * Renders a sprite from the TD libraries
 */
export type SpriteContent = {
  type: typeof CARD_CONTENT_TYPES.SPRITE;
  size?: Size;
} & SpriteEntry;

/**
 * Renders a collection of sprites in a random (predictable) order.
 * Max of 24 sprites
 */
export type SpriteShuffleContent = {
  type: typeof CARD_CONTENT_TYPES.SPRITE_SHUFFLE;
  library: SpriteLibraries;
  spriteIds: string[];
};

/**
 * Renders a grid of sprites.
 * Max of 12 sprites
 */
export type SpriteGridContent = {
  type: typeof CARD_CONTENT_TYPES.SPRITE_GRID;
  library: SpriteLibraries;
  spriteIds: (string | null)[];
  scale?: number[];
  rotate?: number[];
};

/**
 * Renders a sequence of sprites.
 * Max of 10 sprites (5 recommended)
 */
export type SpriteSequenceContent = {
  type: typeof CARD_CONTENT_TYPES.SPRITE_SEQUENCE;
  library: SpriteLibraries;
  spriteIds: string[];
  direction?: Direction;
};

/**
 * Renders a wheel of sprites.
 * Max of 12 sprites
 */
export type SpriteWheelContent = {
  type: typeof CARD_CONTENT_TYPES.SPRITE_WHEEL;
  library: SpriteLibraries;
  /**
   * Max: 12
   */
  spriteIds: (string | null)[];
  colors: (string | null)[];
  pointer?: number;
};

/**
 * Renders a background image.
 * This replaces the background image
 */
export type ImageCardCoverContent = {
  type: typeof CARD_CONTENT_TYPES.IMAGE_CARD_COVER;
  cardId: string;
};

/**
 * Renders an image card
 */
export type ImageCardContent = {
  type: typeof CARD_CONTENT_TYPES.IMAGE_CARD;
  cardId: string;
  /**
   * Value 1-3
   * The images are roughly 1/5 of the card width and default at scale 1
   */
  scale?: ImageCardScale;
  align?: Align;
};

/**
 * Renders a sequence of image cards
 */
export type ImageCardSequenceContent = {
  type: typeof CARD_CONTENT_TYPES.IMAGE_CARD_SEQUENCE;
  cardIds: string[];
  scale?: ImageCardScale;
  align?: Align;
};

/**
 * Renders a browser voice button.
 * It may have a illustrative iconId from the ER illustrative icon sprites
 */
export type VoiceContent = {
  type: typeof CARD_CONTENT_TYPES.VOICE;
  text: string;
  iconId?: string;
  speaker?: SpriteEntry;
};

/**
 * Renders a playable audio file.
 * It may have a illustrative iconId from the ER illustrative icon sprites
 */
export type AudioContent = {
  type: typeof CARD_CONTENT_TYPES.AUDIO;
  url: string;
  iconId?: string;
  device?: SpriteEntry;
};

/**
 * Renders a calendar with some das highlighted in given color
 */
export type CalendarContent = {
  type: typeof CARD_CONTENT_TYPES.CALENDAR;
  /**
   * 0-6 (Sunday-Saturday)
   */
  startAt?: number;
  /**
   * 28, 29, 30, 31 (default: 30)
   */
  totalDays?: number;
  /**
   * What days should be highlighted
   */
  highlights: number[];
  /**
   * The color of the highlights
   */
  highlightsColor?: string;
};

/**
 * Renders a 2xN table of entries, usually indicating that values on the left correspond to the right
 */
export type CodexContent = {
  type: typeof CARD_CONTENT_TYPES.CODEX;
  /**
   * The 2xN table of entries
   */
  table: (SpriteEntry | string)[];
};

/**
 * Renders a single digit (0-9)
 */
export type DigitContent = {
  type: typeof CARD_CONTENT_TYPES.DIGIT;
  value: number;
  size?: Size;
  align?: Align;
};

/**
 * Renders a single letter (A-Z)
 */
export type LetterContent = {
  type: typeof CARD_CONTENT_TYPES.LETTER;
  letter: string;
  size?: Size;
  align?: Align;
};

/**
 * TODO: I don't know if this is needed
 */
export type NumberContent = {
  type: typeof CARD_CONTENT_TYPES.NUMBER;
  value: number;
  size?: Size;
  align?: Align;
};

export type EscapeRoomCardType =
  | EscapeRoomMissionCardType
  | EscapeRoomCompleteMissionCardType
  | EscapeRoomContentCardType;

export type EscapeRoomCardContentType =
  | TitleContent
  | TextBoxContent
  | LabelContent
  | SGVIconContent
  | SpriteContent
  | SpriteGridContent
  | SpriteShuffleContent
  | SpriteSequenceContent
  | SpriteWheelContent
  | ImageCardCoverContent
  | ImageCardContent
  | ImageCardSequenceContent
  | VoiceContent
  | AudioContent
  | CalendarContent
  | CodexContent
  | DigitContent
  | LetterContent
  | NumberContent;
