// Types
import type { ImageCardId, PlainObject, Players, Round, StringDictionary } from '../../utils/types';
import type { SonhosPesadelosCards, ThemeDeck } from './types';
import type { NamingPromptCard } from '../../utils/tdr';
// Constants
import { IMAGE_CARDS_PER_ROUND, SONHOS_PESADELOS_PHASES, THEMES_PER_ROUND } from './constants';
// Helpers
import * as utils from '../../utils';
import { orderBy } from '../../utils/helpers';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, DREAM_TELLING, MATCHING, RESOLUTION, GAME_OVER } = SONHOS_PESADELOS_PHASES;
  const order = [RULES, SETUP, DREAM_TELLING, MATCHING, RESOLUTION];

  if (currentPhase === RESOLUTION) {
    if (triggerLastRound) {
      return GAME_OVER;
    }
    if (round.current < round.total) {
      return DREAM_TELLING;
    }
    return GAME_OVER;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return DREAM_TELLING;
};

/**
 * Distribute 3 themes for each round
 * Round 1 gets level 2 themes
 * Round 2 gets level 3 themes
 * Round 3 gets level 4 themes
 * Round 4 gets any level themes (within the same level)
 * Round 4 gets any level themes (within the same level)
 */
export const getThemeDeck = (cards: SonhosPesadelosCards): ThemeDeck => {
  const deck: ThemeDeck = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };

  // Round 1 gets level 2 themes
  deck[1] = utils.game.getRandomItems(cards[2], THEMES_PER_ROUND);

  // Round 2 gets level 3 themes
  deck[2] = utils.game.getRandomItems(cards[3], THEMES_PER_ROUND);

  // Round 3 gets level 4 themes
  deck[3] = utils.game.getRandomItems(cards[4], THEMES_PER_ROUND);

  const levelOrder = utils.game.shuffle([2, 3, 4]);

  // Round 4 gets any level themes (within the same level)
  const round4Level = levelOrder[0];
  deck[4] = utils.game.getRandomUniqueObjects(cards[round4Level], deck[round4Level - 1], THEMES_PER_ROUND);

  // Round 5 gets any level themes (within the same level)
  const round5Level = levelOrder[1];
  deck[5] = utils.game.getRandomUniqueObjects(cards[round5Level], deck[round5Level - 1], THEMES_PER_ROUND);

  return deck;
};

/**
 * Get images cards for the round, modifies the source list
 * @param imagesIds
 * @returns
 */
export const buildTable = (imagesIds: ImageCardId[]): ImageCardId[] =>
  imagesIds.splice(0, IMAGE_CARDS_PER_ROUND);

/**
 * Selects 3 themes for the round and uses them across the distribution
 * Players with equal dreams will not have the same theme
 * @param players - modified
 * @param themesDeck - modified
 * @param table
 * @param currentRound
 * @returns
 */
export const determineDreamsNightmaresAndThemes = (
  players: Players,
  themesDeck: ThemeDeck,
  table: ImageCardId[],
  currentRound: number
) => {
  const roundThemesDeck: NamingPromptCard[] = themesDeck[currentRound];

  const shuffledThemes: NamingPromptCard[] = utils.game.shuffle(roundThemesDeck).slice(0, 3);
  const shuffledImageCards: ImageCardId[] = utils.game.shuffle(table);

  const dictionaryPair: any = [];
  shuffledThemes.forEach((theme) => {
    shuffledImageCards.forEach((imageCardId) => {
      dictionaryPair.push([theme, imageCardId]);
    });
  });

  const shufflePairs: [NamingPromptCard, ImageCardId][] = utils.game.shuffle(dictionaryPair);

  Object.values(players).forEach((player, index) => {
    const dreamSelection = shufflePairs[index];
    player.theme = dreamSelection[0];
    player.dreamId = dreamSelection[1];

    const reshuffledImages = utils.game.shuffle(shuffledImageCards);

    player.nightmareId =
      reshuffledImages[0] === dreamSelection[1] ? reshuffledImages[1] : reshuffledImages[0];
  });

  return players;
};

/**
 *
 * @param players
 * @returns
 */
export const gatherDreams = (players: Players): PlainObject[] => {
  const dreams = Object.values(players).reduce((acc: PlainObject[], player) => {
    acc.push({
      id: player.id,
      dream: player.dream,
    });

    return acc;
  }, []);

  return utils.game.shuffle(dreams);
};

/**
 *
 * @param players
 * @returns
 */
export const buildRanking = (players: Players) => {
  // Gained points: correct answers, votes gotten, nightmare selection
  const newScores = utils.helpers.buildNewScoreObject(players, [0, 0, 0]);

  Object.values(players).forEach((player) => {
    const points: number = player.theme.level;
    Object.entries(<StringDictionary>player.votes).forEach(([playerId, vote]) => {
      const correctDreamId: string = players[playerId].dreamId;
      const nightmareId: string = players[playerId].nightmareId;

      if (vote === correctDreamId) {
        newScores[player.id].gainedPoints[0] += points;
        newScores[player.id].newScore += points;
        players[player.id].score += points;
        newScores[playerId].gainedPoints[1] += points;
        newScores[playerId].newScore += points;
        players[playerId].score += points;
      } else if (vote === nightmareId) {
        newScores[player.id].gainedPoints[2] -= 1;
        newScores[player.id].newScore -= 1;
        players[player.id].score -= 1;
        newScores[playerId].gainedPoints[2] -= 1;
        newScores[playerId].newScore -= 1;
        players[playerId].score -= 1;
      }
    });
  });

  return Object.values(newScores).sort((a, b) => (a.newScore > b.newScore ? 1 : -1));
};

/**
 *
 * @param players
 * @param table
 * @returns
 */
export const buildGallery = (players: Players, table: ImageCardId[]): PlainObject[] => {
  return orderBy(Object.values(players), 'name', 'asc').map((player) => {
    return {
      playerId: player.id,
      dreamId: player.dreamId,
      dream: player.dream,
      cards: table.map((imageCardId) => {
        return {
          cardId: imageCardId,
          votes: Object.values(players)
            .filter((p) => p.votes[player.id] === imageCardId)
            .map((p) => p.id),
          isDream: imageCardId === player.dreamId,
          isNightmare: imageCardId === player.nightmareId,
        };
      }),
    };
  });
};
