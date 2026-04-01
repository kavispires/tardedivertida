// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';

/**
 * Card entry showing player and their played cards
 */
export type CardEntry = {
  /**
   * ID of the player
   */
  playerId: UID;
  /**
   * Array of card IDs played by the player
   */
  cards: string[];
};

/**
 * Gallery entry showing cards and clue from a round
 */
export type FinalGalleryEntry = {
  /**
   * Array of card IDs used
   */
  cards: UID[];
  /**
   * The clue given for these cards
   */
  clue: string;
  /**
   * ID of the player who played these cards
   */
  playerId: UID;
  /**
   * Whether this player was the leader
   */
  isLeader: boolean;
};

/**
 * Payload for submitting a secret clue
 */
export type SubmitSecretCluePayload = {
  /**
   * The clue text
   */
  clue: string;
};

/**
 * Payload for playing a card
 */
export type SubmitPlayCardPayload = {
  /**
   * ID of the card being played
   */
  cardId: string;
};

/**
 * Payload for submitting defense time
 */
export type SubmitDefensePayload = {
  /**
   * Time spent on defense
   */
  defenseTime: number;
};

/**
 * Payload for submitting a vote
 */
export type SubmitVotePayload = {
  /**
   * ID of the player being voted for
   */
  vote: UID;
};

/**
 * State for the secret clue phase where the leader writes a clue
 */
export type PhaseSecretClueState = {
  /**
   * ID of the impostor player
   */
  impostorId: UID;
  /**
   * ID of the leader player
   */
  leaderId: UID;
  /**
   * Order of player turns
   */
  turnOrder: GameOrder;
};

/**
 * State for the card play phase where players play cards
 */
export type PhaseCardPlayState = {
  /**
   * The clue given by the leader
   */
  clue: string;
  /**
   * ID of the current player taking their turn
   */
  currentPlayerId: UID;
  /**
   * ID of the impostor player
   */
  impostorId: UID;
  /**
   * ID of the leader player
   */
  leaderId: UID;
  /**
   * Current index in the phase order
   */
  phaseIndex: number;
  /**
   * Order of players for this phase
   */
  phaseOrder: GameOrder;
  /**
   * Cards played on the table
   */
  table: CardEntry[];
  /**
   * Order of player turns
   */
  turnOrder: GameOrder;
};

/**
 * State for the defense phase where players explain their choices
 */
export type PhaseDefenseState = {
  /**
   * The clue given by the leader
   */
  clue: string;
  /**
   * ID of the current player defending
   */
  currentPlayerId: UID;
  /**
   * ID of the impostor player
   */
  impostorId: UID;
  /**
   * ID of the leader player
   */
  leaderId: UID;
  /**
   * Current index in the phase
   */
  phaseIndex: number;
  /**
   * Cards played on the table
   */
  table: CardEntry[];
  /**
   * Order of player turns
   */
  turnOrder: GameOrder;
};

/**
 * State for the voting phase where players vote for the impostor
 */
export type PhaseVotingState = {
  /**
   * The clue given by the leader
   */
  clue: string;
  /**
   * ID of the impostor player
   */
  impostorId: UID;
  /**
   * ID of the leader player
   */
  leaderId: UID;
  /**
   * Cards played on the table
   */
  table: CardEntry[];
  /**
   * Order of player turns
   */
  turnOrder: GameOrder;
};

/**
 * State for the reveal phase showing voting results
 */
export type PhaseRevealState = {
  /**
   * The clue given by the leader
   */
  clue: string;
  /**
   * ID of the impostor player
   */
  impostorId: UID;
  /**
   * ID of the leader player
   */
  leaderId: UID;
  /**
   * Cards played on the table
   */
  table: CardEntry[];
  /**
   * Order of player turns
   */
  turnOrder: GameOrder;
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
  /**
   * Number of votes the impostor received
   */
  impostorVotes: number;
};

/**
 * State for the game over phase showing final results
 */
export type PhaseGameOverState = {
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Gallery of all clues and cards used throughout the game
   */
  gallery: FinalGalleryEntry[];
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
};
