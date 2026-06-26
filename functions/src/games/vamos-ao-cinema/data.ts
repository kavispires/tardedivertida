// Types
import type { MovieCardData, MovieReviewCardData } from '../../types/tdr';
import type { ResourceData } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { TDR_RESOURCES } from '../../constants/resources';
import { MOVIES_PER_ROUND, TOTAL_REVIEW_CARDS, TOTAL_ROUNDS } from './constants';
// Services
import {
  fetchGlobalTrackerDocumentData,
  resetGlobalTrackerDocument,
  updateGlobalTrackerDocumentData,
} from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Utils
import { buildBooleanDictionary, filterOutByIds } from '../../utils';

/**
 * Get movie titles and reviews based on game's language
 * @param language - The language code for localized resources
 * @returns Resource data containing movie cards and review cards
 */
export const getCards = async (language: string): Promise<ResourceData> => {
  // Get full movies deck
  const allMovies = await fetchResource<Dictionary<MovieCardData>>(`${TDR_RESOURCES.MOVIES}-${language}`);
  // Get full movies deck
  const allReviews = await fetchResource<Dictionary<MovieReviewCardData>>(
    `${TDR_RESOURCES.MOVIE_REVIEWS}-${language}`,
  );

  // Get used deck
  const usedMoviesAndReviews = await fetchGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.MOVIES, {});

  // Filter out used cards
  const movies = filterOutByIds(allMovies, usedMoviesAndReviews);
  const reviews = filterOutByIds(allReviews, usedMoviesAndReviews);

  // If not the minimum cards needed, reset and use all
  if (
    Object.keys(movies).length < MOVIES_PER_ROUND * TOTAL_ROUNDS ||
    Object.keys(reviews).length < TOTAL_REVIEW_CARDS
  ) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.MOVIES);
    return {
      movies: allMovies,
      reviews: allReviews,
    };
  }

  return {
    movies,
    reviews,
  };
};

/**
 * Save used movies and reviews to the global document
 * @param movies - Array of movie cards used in the game
 * @param goodReviews - Array of good review cards used
 * @param badReviews - Array of bad review cards used
 */
export const saveData = async (
  movies: MovieCardData[],
  goodReviews: MovieReviewCardData[],
  badReviews: MovieReviewCardData[],
): Promise<void> => {
  const usedMovies = buildBooleanDictionary(movies);
  const usedGoodReviews = buildBooleanDictionary(goodReviews);
  const usedBadReviews = buildBooleanDictionary(badReviews);

  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.MOVIES, {
    ...usedMovies,
    ...usedGoodReviews,
    ...usedBadReviews,
  });
};
