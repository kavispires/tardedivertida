// Types
import type { Achievement } from 'types/game';
import type { MovieCardData, MovieReviewCardData } from 'types/tdr';

export type SubmitMovieSelectionPayload = {
  movieId: string;
};

export type SubmitMovieEliminationPayload = {
  movieId: string;
};

export type SubmitMoviePosterPayload = {
  movieId: string;
  posterId: string;
};

export type FinalMovie = {
  /**
   * Unique identifier for the final movie
   */
  id: string;
  /**
   * The full title of the selected movie
   */
  title: string;
  /**
   * The ID of the poster selected for this movie
   */
  posterId: string;
  /**
   * The session/round number when this movie was selected
   */
  session: number;
};

export type Outcome = 'CONTINUE' | 'MISTAKE' | 'DONE';

export type PhaseMovieSelectionState = {
  /**
   * The movies available for selection in this round
   */
  movies: MovieCardData[];
  /**
   * The positive review card for this round
   */
  goodReview: MovieReviewCardData;
  /**
   * The negative review card for this round
   */
  badReview: MovieReviewCardData;
  /**
   * List of movie IDs that were mistakes (players voted for them)
   */
  mistakes: string[];
  /**
   * List of movie IDs that have been eliminated
   */
  eliminatedMovies: string[];
  /**
   * Player IDs who voted for the currently selected movie
   */
  votedForSelectedMovie: string[];
  /**
   * Current round score
   */
  score: number;
};

export type PhaseMovieEliminationState = PhaseMovieSelectionState & {
  /**
   * The order in which players take turns eliminating movies
   */
  turnOrder: string[];
  /**
   * The ID of the player whose turn it is to eliminate a movie
   */
  activePlayerId: string;
};

export type PhaseRevealState = PhaseMovieEliminationState & {
  /**
   * The ID of the movie that was just eliminated
   */
  currentMovieId: string;
  /**
   * The outcome of the elimination (continue, mistake, or done)
   */
  outcome: Outcome;
  /**
   * The ID of the final selected movie for this round (if determined)
   */
  finalMovieId?: string;
  /**
   * The cumulative score across all rounds
   */
  groupScore: number;
  /**
   * Available poster IDs for voting (if a final movie was selected)
   */
  posters?: string[];
};

export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * The total group score across all rounds
   */
  groupScore: number;
  /**
   * List of achievements earned by players
   */
  achievements: Achievement[];
  /**
   * List of all final movies selected throughout the game
   */
  finalMovies: FinalMovie[];
};
