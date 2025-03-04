// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { MOVIES_PER_ROUND, TOTAL_REVIEW_CARDS, TOTAL_ROUNDS } from './constants';
// Types
import type { MovieCard, MovieReviewCard } from '../../types/tdr';
import type { ResourceData } from './types';
// Utils
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import utils from '../../utils';

/**
 * Get movie titles and reviews based on game's language
 * @param language
 * @returns
 */
export const getCards = async (language: string): Promise<ResourceData> => {
  // Get full movies deck
  const allMovies = await resourceUtils.fetchResource<Dictionary<MovieCard>>(
    `${TDR_RESOURCES.MOVIES}-${language}`,
  );
  // Get full movies deck
  const allReviews = await resourceUtils.fetchResource<Dictionary<MovieReviewCard>>(
    `${TDR_RESOURCES.MOVIE_REVIEWS}-${language}`,
  );

  // Get used deck
  const usedMoviesAndReviews = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.MOVIES, {});

  // Filter out used cards
  const movies = utils.game.filterOutByIds(allMovies, usedMoviesAndReviews);
  const reviews = utils.game.filterOutByIds(allReviews, usedMoviesAndReviews);

  // If not the minimum cards needed, reset and use all
  if (
    Object.keys(movies).length < MOVIES_PER_ROUND * TOTAL_ROUNDS ||
    Object.keys(reviews).length < TOTAL_REVIEW_CARDS
  ) {
    await utils.firestore.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.MOVIES);
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
 * @param pastMoviesAndReviews
 */
export const saveData = async (
  movies: MovieCard[],
  goodReviews: MovieReviewCard[],
  badReviews: MovieReviewCard[],
): Promise<void> => {
  const usedMovies = utils.helpers.buildBooleanDictionary(movies);
  const usedGoodReviews = utils.helpers.buildBooleanDictionary(goodReviews);
  const usedBadReviews = utils.helpers.buildBooleanDictionary(badReviews);

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.MOVIES, {
    ...usedMovies,
    ...usedGoodReviews,
    ...usedBadReviews,
  });
};
