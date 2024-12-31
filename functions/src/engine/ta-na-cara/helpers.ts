import { DUMMY_ID, TA_NA_CARA_PHASES } from './constants';
import type { CharacterFace, TaNaCaraState, TaNaCaraStore } from './types';
// Helpers
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param state
 * @param store
 * @returns
 */
export const determineNextPhase = (state: TaNaCaraState, store: TaNaCaraStore): string => {
  const { RULES, SETUP, PROMPT, ANSWERING, GUESSING, REVEAL, GAME_OVER } = TA_NA_CARA_PHASES;
  const order = [RULES, SETUP, PROMPT, ANSWERING, GUESSING, REVEAL, GAME_OVER];

  const { phase: currentPhase, round } = state;

  if (currentPhase === PROMPT) {
    return store.currentTargetId ? GUESSING : ANSWERING;
  }

  if (currentPhase === ANSWERING) {
    return PROMPT;
  }

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current) === round.total ? GAME_OVER : PROMPT;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return PROMPT;
};

export const buildRankingAndOutcome = (
  players: Players,
  targetId: PlayerId,
  points: number,
  charactersDict: Collection<CharacterFace>,
) => {
  // Gained Points [correct guess, guesses on your character]
  const scores = new utils.players.Scores(players, [0, 0]);

  const correct: PlayerId[] = [];

  const target = players[targetId];

  let result: unknown = null;

  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.id === targetId) return;

    // Correct guess
    if (player.guess === target.characterId) {
      scores.add(player.id, points, 0);
      player.score += points;
      scores.add(targetId, 1, 0);
      players[targetId].score += 1;

      correct.push(player.id);
    } else {
      if (player.history[targetId] === undefined) {
        player.history[targetId] = [];
      }
      player.history[targetId].push(player.guess);
    }
  });

  // If anybody got correct
  if (correct.length > 0) {
    // Erase history for the player for all other players
    utils.players.getListOfPlayers(players).forEach((player) => {
      if (player.history[targetId]) {
        delete player.history[targetId];
      }
    });
    // Mark character as revealed
    charactersDict[target.characterId].revealed = true;
    // Save the result
    result = {
      id: DUMMY_ID,
      playerId: target.id,
      avatarId: target.avatarId,
      name: target.name,
      characterId: target.characterId,
      answers: target.answers,
    };
    // Assign a new character to the player if any
    assignNewCharacterToPlayer(players, targetId, charactersDict);
  }

  return {
    correct,
    ranking: scores.rank(players),
    result,
  };
};

const assignNewCharacterToPlayer = (
  players: Players,
  playerId: PlayerId,
  charactersDict: Collection<CharacterFace>,
) => {
  // Erase answers
  players[playerId].answers = [];

  // Check if there are enough characters available
  const availableCharacters = Object.values(charactersDict)
    .filter((character) => !character.playerId)
    .map((character) => character.id);

  if (availableCharacters.length > 1) {
    players[playerId].characterId = utils.game.getRandomItem(availableCharacters);
    charactersDict[players[playerId].characterId].playerId = playerId;
  } else {
    players[playerId].characterId = null;
  }
};
