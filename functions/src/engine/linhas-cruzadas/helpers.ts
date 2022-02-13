// Types
import { Album, ExpressionCard, Slide, WordCard } from './types';
import { GameOrder, Players } from '../../utils/types';
// Constants
import { LINHAS_CRUZADAS_PHASES } from './constants';
// Utils
import * as utils from '../../utils/helpers';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  playerCount: number,
  album: Album,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, PROMPT_SELECTION, DRAWING, NAMING, PRESENTATION, GAME_OVER } = LINHAS_CRUZADAS_PHASES;
  const order = [RULES, SETUP, PROMPT_SELECTION, DRAWING, NAMING, PRESENTATION, GAME_OVER];

  if (currentPhase !== PRESENTATION && triggerLastRound) {
    return PRESENTATION;
  }

  // If current phase is Naming, it depends if it will go to back to drawing or presentation
  if (currentPhase === NAMING) {
    // In an even number of players, end when there's been slides in a album equal to the number of players + 1, otherwise, just the number of players
    const slidesToTriggerPresentation = playerCount % 2 === 0 ? playerCount + 1 : playerCount;

    return Object.values(album)[0].slides.length === slidesToTriggerPresentation ? PRESENTATION : DRAWING;
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
  wordsDeck: WordCard[]
) => {
  Object.values(players).forEach((player, index) => {
    player.prompts = [expressionDeck[index], wordsDeck[index]];
  });
};

export const buildAlbum = (
  players: Players,
  expressionDeck: ExpressionCard[],
  wordsDeck: WordCard[]
): Album => {
  const deck = [...wordsDeck, ...expressionDeck];

  return Object.values(players).reduce((album: Album, player) => {
    const card = deck.find((card) => card.id === player.promptId);

    album[player.id] = {
      id: player.id,
      text: card?.text ?? 'unknown',
      cardId: card?.id ?? 'unknown',
      slides: [
        {
          playerId: player.id,
          content: card?.text ?? 'unknown',
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
      playerId: player.id,
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
    const didSlideForPlayerId = player.currentPrompt.playerId;

    // If even number of players, and the first slide on an album, you get your own prompt, of not, the next player will
    let currentAlbumSlides: Slide[] = [];
    let albumEntryId = playerId;

    if (isFirstSlide && gameOrder.length % 2 === 0) {
      currentAlbumSlides = album[albumEntryId].slides;
    } else {
      albumEntryId = utils.getNextPlayer(gameOrder, didSlideForPlayerId);
      currentAlbumSlides = album[albumEntryId].slides;
    }

    const newSlide = currentAlbumSlides[currentAlbumSlides.length - 1];

    player.currentPrompt = {
      id: albumEntryId,
      content: newSlide.content,
      type: newSlide.type,
      createdBy: newSlide.playerId,
    };
  });
};
