// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';
import type { ItemData, SuspectCardData } from 'types/tdr';

/**
 * Payload for submitting movie genre selection
 */
export type SubmitMovieGenrePayload = {
  /**
   * Selected genre ID
   */
  genre: string;
  /**
   * Chosen movie title
   */
  movieTitle: string;
  /**
   * Array of selected prop IDs
   */
  propsIds: string[];
};

/**
 * Payload for submitting actor selection
 */
export type SubmitMovieActorPayload = {
  /**
   * ID of the selected actor
   */
  actorId: string;
};

/**
 * Movie genre option for selection
 */
export type MovieGenreOption = {
  /**
   * Genre title in multiple languages
   */
  title: DualLanguageValue;
  /**
   * Unique key for the genre
   */
  key: string;
};

/**
 * Base movie role definition
 */
export type MovieRole = {
  /**
   * Unique identifier for the role
   */
  id: string;
  /**
   * Role title in multiple languages
   */
  title: DualLanguageValue;
  /**
   * Role description in multiple languages
   */
  description: DualLanguageValue;
  /**
   * Complexity level of the role
   */
  complexity: number;
  /**
   * Pool number for the role
   */
  pool: number;
};

/**
 * Actor identifier
 */
export type ActorId = string;

/**
 * Acting role with casting information
 */
export type ActingRole = {
  /**
   * Unique identifier for the role
   */
  id: string;
  /**
   * Role title in multiple languages
   */
  title: DualLanguageValue;
  /**
   * Role description in multiple languages
   */
  description: DualLanguageValue;
  /**
   * Required character traits for this role
   */
  traits: string[];
  /**
   * Dictionary of candidate actors for this role
   */
  candidates: Dictionary<SuspectCardData>;
  /**
   * Array of actor IDs selected by players
   */
  selection: ActorId[];
  /**
   * ID of the actor cast for this role (if any)
   */
  actor?: ActorId;
  /**
   * Whether this role has been successfully cast
   */
  cast: boolean;
  /**
   * Round number when this role was cast
   */
  round: number;
  /**
   * Array of player IDs who directed this casting
   */
  directors: UID[];
  /**
   * Type of role
   */
  type: string;
};

/**
 * Complete feature film with all roles and information
 */
export type FeatureFilm = {
  /**
   * Unique identifier for the movie
   */
  id: string;
  /**
   * Title of the movie
   */
  movieTitle: string;
  /**
   * Array of movie props
   */
  movieProps: ItemData[];
  /**
   * Movie genre in multiple languages
   */
  genre: DualLanguageValue;
  /**
   * Dictionary of acting roles in the movie
   */
  roles: Dictionary<ActingRole>;
  /**
   * Order of role IDs for casting
   */
  rolesOrder: string[];
};

/**
 * State for the movie genre selection phase where players vote on genre and props
 */
export type PhaseMovieGenreSelectionState = {
  /**
   * Available genre options to vote on
   */
  genres: MovieGenreOption[];
  /**
   * Available movie titles to choose from
   */
  movieTitles: string[];
  /**
   * Available movie props to select
   */
  movieProps: ItemData[];
};

/**
 * State for the actor selection phase where players cast actors for roles
 */
export type PhaseActorSelectionState = {
  /**
   * The movie being cast
   */
  movie: FeatureFilm;
  /**
   * ID of the currently active role being cast
   */
  activeRoleId: string;
};

/**
 * State for the result phase showing casting outcomes
 */
export type PhaseResultState = {
  /**
   * The movie being cast
   */
  movie: FeatureFilm;
  /**
   * ID of the role that was just cast
   */
  activeRoleId: string;
  /**
   * Outcome of the casting (CAST, NOT_CAST, etc.)
   */
  outcome: string;
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
};

/**
 * State for the game over phase showing final movie results
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
  /**
   * The completed movie with all casting decisions
   */
  movie: FeatureFilm;
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
};
