// Types
import type {
  Album,
  Card,
  FirebaseStoreData,
  LinhasCruzadasAchievement,
  LinhasCruzadasOptions,
  Slide,
} from './types';
// Constants
import { LINHAS_CRUZADAS_ACHIEVEMENTS, LINHAS_CRUZADAS_PHASES } from './constants';
import { shuffle } from 'lodash';
// Utils
import utils from '../../utils';
import type { ArteRuimCard, TextCard } from '../../types/tdr';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, PROMPT_SELECTION, DRAWING, NAMING, PRESENTATION, GAME_OVER } = LINHAS_CRUZADAS_PHASES;
  const order = [SETUP, PROMPT_SELECTION, DRAWING, NAMING, PRESENTATION, GAME_OVER];

  if (currentPhase !== PRESENTATION && round.forceLastRound) {
    return PRESENTATION;
  }

  // If current phase is Naming, it depends if it will go to back to drawing or presentation
  if (currentPhase === NAMING) {
    // In an even number of players, end when there's been slides in a album equal to the number of players + 1, otherwise, just the number of players
    // const slidesToTriggerPresentation = playerCount % 2 === 0 ? playerCount + 1 : playerCount;

    // return Object.values(album)[0].slides.length === slidesToTriggerPresentation ? PRESENTATION : DRAWING;
    return round.forceLastRound || round.current >= round.total ? PRESENTATION : DRAWING;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Deals prompt options to players based on game configuration
 * @param players - The collection of players in the game
 * @param expressionDeck - The deck of expression cards
 * @param wordsDeck - The deck of word cards
 * @param options - The game configuration options
 */
export const dealPromptOptions = (
  players: Players,
  expressionDeck: ArteRuimCard[],
  wordsDeck: TextCard[],
  options: LinhasCruzadasOptions,
) => {
  const playerCount = utils.players.getPlayerCount(players);

  if (options.singleWordOnly) {
    const dealCardEveryNTimes = Math.floor(wordsDeck.length / playerCount);
    utils.players.getListOfPlayers(players).forEach((player, index) => {
      player.prompts = shuffle(
        Array(dealCardEveryNTimes)
          .fill(0)
          .map((e, i) => wordsDeck[e + index + i * playerCount]),
      );
    });
  } else {
    // On an even distribution all players get the same amount of expressions and single word cards
    const deck = options.evenDistribution
      ? [...expressionDeck, ...wordsDeck]
      : shuffle([...expressionDeck, ...wordsDeck]);
    const dealCardEveryNTimes = Math.floor(deck.length / playerCount);
    utils.players.getListOfPlayers(players).forEach((player, index) => {
      player.prompts = Array(dealCardEveryNTimes)
        .fill(0)
        .map((e, i) => deck[e + index + i * playerCount]);
    });
  }
};

/**
 * Builds the album structure for all players
 * @param players - The collection of players in the game
 */
export const buildAlbum = (players: Players): Album => {
  return utils.players.getListOfPlayers(players).reduce((album: Album, player) => {
    const card = player.prompts.find((card: Card) => card.id === player.promptId) ?? {};

    album[player.id] = {
      id: player.id,
      text: card.text ?? 'unknown',
      cardId: card.id ?? 'unknown',
      slides: [
        {
          author: player.id,
          content: 'cover',
          type: 'cover',
        },
        {
          author: player.id,
          content: card.text ?? 'unknown',
          type: 'title',
        },
      ],
    };

    return album;
  }, {});
};

/**
 * Adds a new slide to the album with player drawings and names
 * @param album - The current album object
 * @param players - The collection of players in the game
 */
export const addSlideToAlbum = (album: Album, players: Players): Album => {
  utils.players.getListOfPlayers(players).forEach((player) => {
    album[player.currentPrompt.id].slides.push({
      author: player.id,
      content: player.drawing ?? player.guess,
      type: player.drawing ? 'drawing' : 'title',
    });
  });

  return album;
};

export const assignSlideToPlayers = (
  album: Album,
  players: Players,
  gameOrder: GameOrder,
  isFirstSlide = false,
) => {
  gameOrder.forEach((playerId) => {
    const player = players[playerId];

    // If even number of players, and the first slide on an album, you get your own prompt, of not, the next player will
    let currentAlbumSlides: Slide[] = [];
    let albumEntryId = playerId;

    if (isFirstSlide && gameOrder.length % 2 === 0) {
      currentAlbumSlides = album[albumEntryId].slides;
    } else {
      albumEntryId = utils.turnOrder.getNextPlayerId(gameOrder, player.currentPrompt?.id ?? player.id);
      currentAlbumSlides = album[albumEntryId].slides;
    }
    const newSlide = currentAlbumSlides[currentAlbumSlides.length - 1];
    const secondToLastSlide = currentAlbumSlides[currentAlbumSlides.length - 2] ?? {};

    const wordCount =
      newSlide.type === 'drawing'
        ? secondToLastSlide.content.split(' ').length
        : newSlide.content.split(' ').length;

    player.currentPrompt = {
      id: albumEntryId,
      ...newSlide,
      wordCount,
    };
  });
};

/**
 * Calculates and returns player achievements based on game statistics
 * @param store - The Firebase store data containing achievement counters
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<LinhasCruzadasAchievement>[] = [];

  // Drawing
  const { most: quickestDrawer, least: slowestDrawer } = utils.achievements.getMostAndLeastOf(
    store,
    'drawingDuration',
  );
  if (quickestDrawer) {
    achievements.push({
      type: LINHAS_CRUZADAS_ACHIEVEMENTS.QUICKEST_DRAWER,
      playerId: quickestDrawer.playerId,
      value: quickestDrawer.value,
    });
  }
  if (slowestDrawer) {
    achievements.push({
      type: LINHAS_CRUZADAS_ACHIEVEMENTS.SLOWEST_DRAWER,
      playerId: slowestDrawer.playerId,
      value: slowestDrawer.value,
    });
  }

  // Writing
  const { most: quickestWriting, least: slowestWriting } = utils.achievements.getMostAndLeastOf(
    store,
    'writingDuration',
  );
  if (quickestWriting) {
    achievements.push({
      type: LINHAS_CRUZADAS_ACHIEVEMENTS.QUICKEST_GUESSER,
      playerId: quickestWriting.playerId,
      value: quickestWriting.value,
    });
  }
  if (slowestWriting) {
    achievements.push({
      type: LINHAS_CRUZADAS_ACHIEVEMENTS.SLOWEST_GUESSER,
      playerId: slowestWriting.playerId,
      value: slowestWriting.value,
    });
  }

  const { most: randomPromptSelection } = utils.achievements.getMostAndLeastOf(
    store,
    'randomPromptSelection',
  );
  if (randomPromptSelection) {
    achievements.push({
      type: LINHAS_CRUZADAS_ACHIEVEMENTS.RANDOM_PROMPT_SELECTION,
      playerId: randomPromptSelection.playerId,
      value: randomPromptSelection.value,
    });
  }

  return achievements;
};
