// Constants
import { GENRES, MAX_ROUNDS, TESTE_DE_ELENCO_ACHIEVEMENTS, TESTE_DE_ELENCO_PHASES } from './constants';
// Utils
import utils from '../../utils';
import type {
  ActingRole,
  FirebaseStateData,
  FirebaseStoreData,
  Movie,
  MovieGenre,
  TesteDeElencoAchievement,
} from './types';
import type { Item } from '../../types/tdr';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @param lose
 * @param win
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, state: FirebaseStateData): string => {
  const { RULES, SETUP, MOVIE_GENRE_SELECTION, ACTOR_SELECTION, RESULT, GAME_OVER } = TESTE_DE_ELENCO_PHASES;
  const order = [RULES, SETUP, MOVIE_GENRE_SELECTION, ACTOR_SELECTION, RESULT];

  if (currentPhase === RESULT) {
    // If all roles are cast, end the game
    if (Object.values<ActingRole>(state.movie.roles).every((role) => role.cast || role.round > 3)) {
      return GAME_OVER;
    }

    return round.forceLastRound || round.current >= MAX_ROUNDS ? GAME_OVER : ACTOR_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return ACTOR_SELECTION;
};

/**
 *
 * @param players
 * @returns
 */
const determineMovieVotes = (
  players: Players,
): { genre: MovieGenre; movieTitle: string; selectedProps: string[] } => {
  const genreVotes = utils.players.getRankedVotes(players, 'genre', true);
  const genreKey = utils.game.getRandomItem(genreVotes).value;
  const genre = GENRES[genreKey];

  const movieTitle = utils.game.getRandomItem(
    utils.players.getRankedVotes(players, 'movieTitle', true),
  ).value;

  const selectedProps = utils.players.getListOfPlayers(players).reduce((acc: string[], player) => {
    if (player.selectedProps) {
      return utils.game.removeDuplicates(acc.concat(player.selectedProps));
    }
    return acc;
  }, []);

  return {
    genre,
    movieTitle,
    selectedProps,
  };
};

export const determineCastingOrder = (movie: MovieGenre): string[] => {
  return movie.roles.map((role) => role.id).reverse();
};

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
    const candidates = utils.helpers.buildDictionaryFromList(
      new Array(role.pool).fill(0).map(() => store.actors.pop()),
    );
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
      utils.achievements.increase(store, playerId, 'cast', 1);
    });
  }
  // Or increase round adding a new trait to the role
  else if (votes.length > 1 && activeRole.round < 3) {
    activeRole.round += 1;
    activeRole.traits.push(store.traits.pop());
    activeRole.selection = votes.map((vote) => vote.value);
    activeRole.directors = votes.reduce((acc: PlayerId[], vote) => {
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
        utils.achievements.increase(store, playerId, 'alone', 1);
      });
    } else {
      vote.votes.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'together', 1);
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

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData, players: Players) => {
  const achievements: Achievement<TesteDeElencoAchievement>[] = [];

  const { most: mostAlone } = utils.achievements.getMostAndLeastOf(store, 'alone');

  // Most Alone: voted alone the most times
  if (mostAlone) {
    achievements.push({
      type: TESTE_DE_ELENCO_ACHIEVEMENTS.ALONE_VOTES,
      playerId: mostAlone.playerId,
      value: mostAlone.value,
    });
  }

  const { most: mostTogether } = utils.achievements.getMostAndLeastOf(store, 'together');

  // Most Together: voted with someone else the most times
  if (mostTogether) {
    achievements.push({
      type: TESTE_DE_ELENCO_ACHIEVEMENTS.TOGETHER_VOTES,
      playerId: mostTogether.playerId,
      value: mostTogether.value,
    });
  }

  const { most: mostCast, least: fewestCast } = utils.achievements.getMostAndLeastOf(store, 'cast');

  // Most Cast: cast the most actors
  if (mostCast) {
    achievements.push({
      type: TESTE_DE_ELENCO_ACHIEVEMENTS.MOST_CAST,
      playerId: mostCast.playerId,
      value: mostCast.value,
    });
  }

  // Most Cast: cast the fewest actors
  if (fewestCast) {
    achievements.push({
      type: TESTE_DE_ELENCO_ACHIEVEMENTS.FEWEST_CAST,
      playerId: fewestCast.playerId,
      value: fewestCast.value,
    });
  }

  utils.players.getListOfPlayers(players).forEach((player) => {
    const unique = utils.game.removeDuplicates(player.votes).length;
    utils.achievements.increase(store, player.id, 'actors', unique);
  });

  // Changeling: voted for largest number of different actors
  const { most: mostActors, least: fewestActors } = utils.achievements.getMostAndLeastOf(store, 'actors');
  if (mostActors) {
    achievements.push({
      type: TESTE_DE_ELENCO_ACHIEVEMENTS.CHANGELING,
      playerId: mostActors.playerId,
      value: mostActors.value,
    });
  }

  // Consistency: voted for the same actor the most times
  if (fewestActors) {
    achievements.push({
      type: TESTE_DE_ELENCO_ACHIEVEMENTS.CONSISTENCY,
      playerId: fewestActors.playerId,
      value: fewestActors.value,
    });
  }

  return achievements;
};
