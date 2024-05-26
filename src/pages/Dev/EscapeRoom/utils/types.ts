import { CSSProperties } from 'react';

type UID = string;

type CardType =
  | 'mission'
  | 'complete'
  | 'item'
  | 'voice'
  | 'audio'
  | 'image-card'
  | 'text'
  | 'glyph'
  | 'random-list'
  | 'ordered-list'
  | 'unordered-list'
  | 'building-block';

export type EpisodeLevel = 'basic' | 'intermediate' | 'advanced';

type ItemId = string;

type ERDefaultCard = {
  /**
   * The unique identifier of the card.
   * Usually used to verify the end game played cards condition.
   */
  id: UID;
  /**
   * The type of the card.
   * To render the correct component.
   */
  type: CardType;
  /**
   * The header of the card
   */
  header: {
    /**
     * The title of the header in both languages.
     */
    title: DualLanguageValue;
    /**
     * Illustrative small icon in the header.
     */
    iconId?: ItemId;
  };
  /**
   * TODO: Migrate extra fields to metadata
   */
  metadata?: {
    /**
     * The level of the card to determine the difficulty.
     */
    level: EpisodeLevel;
    /**
     * Flag indicating if the card may or may not be in the game to trigger or not events.
     */
    conditional?: boolean;
    /**
     * Indicating if a card is a filler card that is not used in the mission.
     */
    filler?: boolean;
    /**
     * Additional class name to be added to the card.
     */
    className?: string;
    /**
     * CSS props property usually, transform, filter, or opacity.
     */
    style?: CSSProperties;
    /**
     * When played, adds this keyword to the result.
     */
    keyword?: string;
    /**
     * When in episode, it requires this keyword to be played.
     */
    requiredKeyword?: string;
    /**
     * Value indicating the complexity of the card.
     */
    complexity?: number;
  };
  /**
   * TODO: migrate to content?
   */
  conditions?: ERCondition[];
};

export type ERBuildingBlock = ERDefaultCard & {
  type: 'building-block';
  content: {
    targetType: CardType;
    blocks: PlainObject;
  };
};

export type ERCondition = {
  requiredKeyword: UID;
  iconId?: ItemId;
  target: DualLanguageValue;
  consequence: DualLanguageValue;
  level: EpisodeLevel;
};

export type Message = {
  text: DualLanguageValue;
  iconId?: ItemId;
  style?: CSSProperties;
};

export type ERMissionCard = ERDefaultCard & {
  type: 'mission';
  content: {
    number: number;
    title: DualLanguageValue;
    paragraphs: DualLanguageValue[];
  };
  conditions?: ERCondition[];
};

export type ERCompleteCard = ERDefaultCard & {
  type: 'complete';
};

export type ERCFinishEpisodeCard = ERDefaultCard & {
  type: 'finish';
};

export type ERTextCard = ERDefaultCard & {
  type: 'text';
  content: {
    text: DualLanguageValue;
  };
};

export type EROrderedListCard = ERDefaultCard & {
  type: 'ordered-list';
  content: {
    title?: DualLanguageValue;
    list: DualLanguageValue[];
  };
};

export type ERUnorderedListCard = ERDefaultCard & {
  type: 'unordered-list';
  content: {
    title?: DualLanguageValue;
    list: DualLanguageValue[];
  };
};

export type ERItemCard = ERDefaultCard & {
  type: 'item';
  content: {
    /**
     * The item id for the Item Sprite
     */
    itemId: ItemId;
    /**
     * Descriptive text of the item, usually its name
     */
    caption?: DualLanguageValue;
    /**
     * The text that complements the item
     */
    message?: Message;
  };
};

export type ERGlyphCard = ERDefaultCard & {
  type: 'glyph';
  content: {
    /**
     * The item id for the Item Sprite
     */
    glyphId: ItemId;
    /**
     * Descriptive text of the glyph, usually its name
     */
    caption?: DualLanguageValue;
    /**
     * The text that complements the item
     */
    message?: Message;
  };
};

export type ERVoiceCard = ERDefaultCard & {
  type: 'voice';
  content: {
    /**
     * The text that would be spoken by the voice card.
     */
    speaker?: DualLanguageValue;
    /**
     * The text that would be spoken by the voice card.
     */
    speech: DualLanguageValue;
    /**
     * Any additional text to be displayed under the speech.
     */
    text?: DualLanguageValue;
  };
};

export type ERImageCard = ERDefaultCard & {
  type: 'image-card';
  /**
   * The image id for the Image Card.
   */
  image: string;
  /**
   * Descriptive text of the item, usually its name
   */
  caption?: DualLanguageValue;
  /**
   * Any additional text to be displayed under the image.
   */
  text?: DualLanguageValue;
  /**
   * The text that comes before icon image
   */
  prefix?: DualLanguageValue;
  /**
   * The text explaining a requirement to share or play the card
   */
  requirement?: DualLanguageValue;
};

export type EscapeRoomCard =
  | ERMissionCard
  | ERCompleteCard
  | ERCFinishEpisodeCard
  | ERTextCard
  | ERBuildingBlock
  | EROrderedListCard
  | ERUnorderedListCard
  | ERItemCard
  | ERVoiceCard
  | ERImageCard
  | ERGlyphCard;

export type ScoringCondition = {
  keyword: string;
  description: DualLanguageValue;
};

export type EscapeRoomEpisode = {
  title: DualLanguageValue;
  level: EpisodeLevel;
  cards: EscapeRoomCard[];
  winningCondition: {
    includes: ScoringCondition[];
    ordered: ScoringCondition[];
    bonuses: ScoringCondition[];
    excludes: ScoringCondition[];
  };
};
