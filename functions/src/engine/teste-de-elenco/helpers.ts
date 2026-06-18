// Constants
import { GENRES, MAX_ROUNDS, TESTE_DE_ELENCO_PHASES } from './constants';
import { keyBy, sampleSize, uniq } from 'lodash';
// Utils
import utils from '../../utils';
import type { ActingRole, FirebaseStateData, FirebaseStoreData, Movie, MovieGenre } from './types';
import type { Item } from '../../types/tdr';
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and game state
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param state - The current Firebase state data
 */
export const determineNextPhase = (currentPhase: string, round: Round, state: FirebaseStateData): string => {
  const { SETUP, MOVIE_GENRE_SELECTION, ACTOR_SELECTION, RESULT, GAME_OVER } = TESTE_DE_ELENCO_PHASES;
  const order = [SETUP, MOVIE_GENRE_SELECTION, ACTOR_SELECTION, RESULT];

  if (currentPhase === RESULT) {
    // If all roles are cast, end the game
    if (Object.values<ActingRole>(state.movie.roles).every((role) => role.cast || role.round > 3)) {
      return GAME_OVER;
    }

    return round.forceLastRound || round.current >= MAX_ROUNDS ? GAME_OVER : ACTOR_SELECTION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Determines movie genre and props from player votes
 * @param players - The collection of players in the game
 */
const determineMovieVotes = (
  players: Players,
): { genre: MovieGenre; movieTitle: string; selectedProps: string[] } => {
  const genreVotes = utils.players.getRankedVotes(players, 'genre', true);
  const genreKey = sampleSize(genreVotes, 1)[0].value;
  const genre = GENRES[genreKey];

  const movieTitle = sampleSize(utils.players.getRankedVotes(players, 'movieTitle', true), 1)[0].value;

  const selectedProps = utils.players.getListOfPlayers(players).reduce((acc: string[], player) => {
    if (player.selectedProps) {
      return uniq(acc.concat(player.selectedProps));
    }
    return acc;
  }, []);

  return {
    genre,
    movieTitle,
    selectedProps,
  };
};

/**
 * Determines the order in which movie roles will be cast
 * @param movie - The movie genre object
 */
export const determineCastingOrder = (movie: MovieGenre): string[] => {
  return movie.roles.map((role) => role.id).reverse();
};

/**
 * Builds the movie object with all roles and candidates
 * @param players - The collection of players in the game
 * @param store - The Firebase store data
 * @param movieProps - The array of movie prop items
 */
export const buildMovie = (players: Players, store: FirebaseStoreData, movieProps: Item[]): Movie => {
  const { genre, selectedProps, movieTitle } = determineMovieVotes(players);

  const movie: Movie = {
    id: genre.id,
    genre: genre.title,
    movieTitle,
    movieProps: selectedProps
      .map((propId) => movieProps.find((item) => item.id === propId))
      .filter(Boolean) as Item[],
    roles: {},
    rolesOrder: determineCastingOrder(genre),
  };

  genre.roles.forEach((role) => {
    const candidates = keyBy(new Array(role.pool).fill(0).map(() => store.actors.pop()));
    movie.roles[role.id] = {
      id: role.id,
      title: role.title,
      description: role.description,
      type: role.type,
      candidates,
      traits: new Array(role.complexity).fill(0).map(() => store.traits.pop()),
      cast: false,
      round: 1,
      directors: [],
      selection: Object.keys(candidates),
    };
  });

  return movie;
};

/**
 * TODO: Refactor so if there's a majority (50+1) wins,
 * Otherwise get any actor who got more than one vote (if more than one)
 * Otherwise get any actor who got at least one vote
 * @param players
 * @param state
 * @param store
 * @returns
 */
export const determineCast = (players: Players, state: FirebaseStateData, store: FirebaseStoreData) => {
  // Gained Points [matches]
  const scores = new utils.players.Scores(players, [0]);

  let outcome = 'CONTINUE';

  // Count votes
  const votes = utils.players.getRankedVotes(players, 'actorId', true);
  const allVotes = utils.players.getRankedVotes(players, 'actorId');

  // Achievement: Consistency and Changeling
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.votes.push(player.actorId);
  });

  // Determine success threshold (how many votes are necessary to consider the role cast)
  const successThreshold = Math.ceil(utils.players.getListOfPlayers(players).length / 2); // 50% + 1

  const activeRole = state.movie.roles[state.activeRoleId];

  // Determine cast (who has the most votes)
  if (votes.length === 1 && votes[0].count >= successThreshold) {
    activeRole.cast = true;
    activeRole.selection = [votes[0].value];
    activeRole.actor = votes[0].value;
    activeRole.directors = votes[0].votes;
    scores.addMultiple(votes[0].votes, votes[0].votes.length, 0);
    outcome = 'CAST';
    activeRole.directors.forEach((playerId) => {
      increaseAchievement(store.achievements, playerId, 'cast', 1);
    });
  }
  // Or increase round adding a new trait to the role
  else if (votes.length > 1 && activeRole.round < 3) {
    activeRole.round += 1;
    activeRole.traits.push(store.traits.pop());
    activeRole.selection = votes.map((vote) => vote.value);
    activeRole.directors = votes.reduce((acc: UID[], vote) => {
      return acc.concat(vote.votes);
    }, []);
    votes.forEach((vote) => {
      scores.addMultiple(vote.votes, vote.votes.length, 0);
    });
  } else {
    allVotes.forEach((vote) => {
      scores.addMultiple(vote.votes, vote.votes.length, 0);
    });
    activeRole.round += 1;
    activeRole.traits.push(store.traits.pop());
    activeRole.selection = allVotes.map((vote) => vote.value);
  }

  // Achievement: alone and together votes
  allVotes.forEach((vote) => {
    if (vote.count === 1) {
      vote.votes.forEach((playerId) => {
        increaseAchievement(store.achievements, playerId, 'alone', 1);
      });
    } else {
      vote.votes.forEach((playerId) => {
        increaseAchievement(store.achievements, playerId, 'together', 1);
      });
    }
  });

  if (activeRole.round > 3) {
    outcome = 'FAIL';
  }

  return {
    outcome,
    ranking: scores.rank(players),
  };
};

/**
 * Gets the next role ID that hasn't been cast yet
 * @param movie - The movie object
 * @param currentId - The current role ID
 */
export const getNextRoleId = (movie: Movie, currentId: string) => {
  const startIndex = movie.rolesOrder.indexOf(currentId);

  // Find the next movie role that hasn't been cast yet, starting from the next element after activeId.
  for (let i = 1; i <= movie.rolesOrder.length; i++) {
    const nextIndex = (startIndex + i) % movie.rolesOrder.length;
    const nextId = movie.rolesOrder[nextIndex];

    if (movie.roles[nextId].cast === false) {
      return nextId;
    }
  }

  return 0;
};
