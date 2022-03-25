// Types
import { Album, Card, ExpressionCard, LinhasCruzadasOptions, Slide, WordCard } from './types';
import { GameOrder, Players, Round } from '../../utils/types';
// Constants
import { LINHAS_CRUZADAS_PHASES } from './constants';
// Utils
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, PROMPT_SELECTION, DRAWING, NAMING, PRESENTATION, GAME_OVER } = LINHAS_CRUZADAS_PHASES;
  const order = [RULES, SETUP, PROMPT_SELECTION, DRAWING, NAMING, PRESENTATION, GAME_OVER];

  if (currentPhase !== PRESENTATION && triggerLastRound) {
    return PRESENTATION;
  }

  // If current phase is Naming, it depends if it will go to back to drawing or presentation
  if (currentPhase === NAMING) {
    // // In an even number of players, end when there's been slides in a album equal to the number of players + 1, otherwise, just the number of players
    // const slidesToTriggerPresentation = playerCount % 2 === 0 ? playerCount + 1 : playerCount;

    // return Object.values(album)[0].slides.length === slidesToTriggerPresentation ? PRESENTATION : DRAWING;
    return triggerLastRound || round.current >= round.total ? PRESENTATION : DRAWING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return PRESENTATION;
};

export const dealPromptOptions = (
  players: Players,
  expressionDeck: ExpressionCard[],
  wordsDeck: WordCard[],
  options: LinhasCruzadasOptions
) => {
  const playerCount = utils.players.getPlayerCount(players);

  if (options.singleWordOnly) {
    const dealCardEveryNTimes = Math.floor(wordsDeck.length / playerCount);
    Object.values(players).forEach((player, index) => {
      player.prompts = utils.game.shuffle(
        Array(dealCardEveryNTimes)
          .fill(0)
          .map((e, i) => wordsDeck[e + index + i * playerCount])
      );
    });
  } else {
    // On an even distribution all players get the same amount of expressions and single word cards
    const deck = options.evenDistribution
      ? [...expressionDeck, ...wordsDeck]
      : utils.game.shuffle([...expressionDeck, ...wordsDeck]);
    const dealCardEveryNTimes = Math.floor(deck.length / playerCount);
    Object.values(players).forEach((player, index) => {
      player.prompts = Array(dealCardEveryNTimes)
        .fill(0)
        .map((e, i) => deck[e + index + i * playerCount]);
    });
  }
};

export const buildAlbum = (players: Players): Album => {
  return Object.values(players).reduce((album: Album, player) => {
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

export const addSlideToAlbum = (album: Album, players: Players): Album => {
  Object.values(players).forEach((player) => {
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
  isFirstSlide = false
) => {
  gameOrder.forEach((playerId) => {
    const player = players[playerId];

    // If even number of players, and the first slide on an album, you get your own prompt, of not, the next player will
    let currentAlbumSlides: Slide[] = [];
    let albumEntryId = playerId;

    if (isFirstSlide && gameOrder.length % 2 === 0) {
      currentAlbumSlides = album[albumEntryId].slides;
    } else {
      albumEntryId = utils.players.getNextPlayer(gameOrder, player.currentPrompt?.id ?? player.id);
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
