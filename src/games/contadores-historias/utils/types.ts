// Types
import type { Achievement, GameRanking } from 'types/game';

export type TableEntry = {
  /**
   * ID of the player who played this card
   */
  playerId: UID;
  /**
   * ID of the card played
   */
  cardId: string;
  /**
   * IDs of players who voted for this card
   */
  votes?: UID[];
};

export type SubmitStoryPayload = {
  /**
   * The story/prompt created by the storyteller
   */
  story: string;
  /**
   * ID of the card selected by the storyteller
   */
  cardId: string;
};

export type PlayCardPayload = {
  /**
   * ID of the card to play
   */
  cardId: string;
};

export type SubmitVotePayload = {
  /**
   * ID of the card being voted for
   */
  vote: string;
};

export type Outcome = 'EVERYBODY_GOT' | 'NOBODY_GOT' | 'NORMAL';

export type GalleryEntry = {
  /**
   * ID of the card used
   */
  cardId: string;
  /**
   * Language of the story
   */
  language: Language;
  /**
   * The story/prompt that was created
   */
  story: string;
};

export type PhaseStoryState = {
  /**
   * Order of players for the game
   */
  gameOrder: GameOrder;
  /**
   * ID of the current storyteller
   */
  storytellerId: UID;
  /**
   * ID of the next storyteller
   */
  nextStorytellerId: UID;
};

export type PhaseCardPlayState = {
  /**
   * Order of players for the game
   */
  gameOrder: GameOrder;
  /**
   * ID of the current storyteller
   */
  storytellerId: UID;
  /**
   * ID of the next storyteller
   */
  nextStorytellerId: UID;
  /**
   * Story/prompt created by the storyteller
   */
  story: string;
};

export type PhaseVotingState = {
  /**
   * Order of players for the game
   */
  gameOrder: GameOrder;
  /**
   * ID of the current storyteller
   */
  storytellerId: UID;
  /**
   * ID of the next storyteller
   */
  nextStorytellerId: UID;
  /**
   * Story/prompt created by the storyteller
   */
  story: string;
  /**
   * Table with player cards and votes
   */
  table: TableEntry[];
};

export type PhaseResolutionState = {
  /**
   * Order of players for the game
   */
  gameOrder: GameOrder;
  /**
   * ID of the current storyteller
   */
  storytellerId: UID;
  /**
   * ID of the next storyteller
   */
  nextStorytellerId: UID;
  /**
   * Story/prompt created by the storyteller
   */
  story: string;
  /**
   * Table with player cards and votes
   */
  table: TableEntry[];
  /**
   * Outcome of the round
   */
  outcome: Outcome;
  /**
   * Ranking of players for this round
   */
  ranking: GameRanking;
};

export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * IDs of the winning players
   */
  winners: UID[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Gallery of all stories and cards from the game
   */
  gallery: GalleryEntry[];
};
