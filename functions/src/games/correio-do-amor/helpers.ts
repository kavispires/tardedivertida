import { shuffle } from 'lodash';
// Types
import type { FestaJuninaCard } from './types';
// Constants
import { SEPARATOR } from '../../constants/general';
import { CORREIO_DO_AMOR_PHASES, DECK_INFO_BY_PLAYER_COUNT } from './constants';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, CARD_PLAY, CARD_EFFECTS, CARD_RESOLUTION, GAME_OVER } = CORREIO_DO_AMOR_PHASES;
  const order = [SETUP, CARD_PLAY, CARD_EFFECTS, CARD_RESOLUTION, GAME_OVER];

  // Check if game should end after last round
  if (currentPhase === CARD_RESOLUTION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : CARD_PLAY;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

const buildCardUniqueIds = (deck: UID[]) => {
  return deck.map((cardId, index) => `${cardId}${SEPARATOR}${index}`);
};

const updateCardsCount = (cardsDict: Dictionary<FestaJuninaCard>, deck: UID[]) => {
  // Zero everything first
  Object.values(cardsDict).forEach((card) => {
    card.count = 0;
  });

  // Then count based on the deck
  deck.forEach((cardUniqueId) => {
    const [cardId] = cardUniqueId.split(SEPARATOR);
    if (cardsDict[cardId]) {
      cardsDict[cardId].count += 1;
    }
  });
};

export function buildRoundDeck(
  cardsDict: Dictionary<FestaJuninaCard>,
  currentRound: number,
  playerCount: number,
  plusCardsRotation: UID[],
  advancedCardsRotation: UID[],
): UID[] {
  const totalCardsNeeded = DECK_INFO_BY_PLAYER_COUNT[playerCount].totalCards;
  // Golden rule: Pad with Rank 1 cards until quantity for player count is met, but there's a minimum of 4 Rank 1 cards)
  const rank1Cards = Object.values(cardsDict).filter((card) => card.rank === 1);
  const padWithRank1 = (quantityNeeded: number): UID[] => {
    // There are two Rank 1 cards, they must be alternately repeated until quantity is met
    const rank1Deck: UID[] = [];
    let rank1Index = 0;

    for (let i = 0; i < quantityNeeded; i++) {
      const card = rank1Cards[rank1Index];
      rank1Deck.push(card.id);
      rank1Index = (rank1Index + 1) % rank1Cards.length;
    }
    return rank1Deck;
  };

  const selectedDeck = Object.values(cardsDict)
    .filter((card) => card.tier === 'core')
    .flatMap((card) => Array(card.quantity).fill(card.id));

  // From Round 2 on - Introduce Rank 0 and from now on alternate the selection of the ZERO group
  if (currentRound >= 2) {
    const plusCardId = plusCardsRotation[currentRound % plusCardsRotation.length];
    const plusCard = cardsDict[plusCardId];
    selectedDeck.push(...Array(plusCard.quantity).fill(plusCard.id));
  }

  // From Round 4 on - Add an advanced card from advancedCardsRotation (all cards are only 1 copy)
  // If from a group already in the deck that has the setRule 'COMBINE', simply add it.
  // If from a group already in the deck that has the setRule 'SINGLE', replaced the existing card in the group with this one
  if (currentRound >= 4) {
    const advancedCardId = advancedCardsRotation[currentRound % advancedCardsRotation.length];
    const advancedCard = cardsDict[advancedCardId];
    const existingCardIndex = selectedDeck.findIndex((cardId) => {
      const card = cardsDict[cardId];
      return card.setName === advancedCard.setName;
    });
    if (existingCardIndex !== -1) {
      const existingCard = cardsDict[selectedDeck[existingCardIndex]];
      if (existingCard.setRule === 'SINGLE') {
        selectedDeck[existingCardIndex] = advancedCard.id;
      } else if (existingCard.setRule === 'COMBINE') {
        selectedDeck.push(advancedCard.id);
      }
    } else {
      selectedDeck.push(advancedCard.id);
    }
  }

  // Add padding for player count
  selectedDeck.push(...padWithRank1(Math.max(0, totalCardsNeeded - selectedDeck.length)));

  // Update counts
  updateCardsCount(cardsDict, selectedDeck);
  return shuffle(buildCardUniqueIds(selectedDeck));
}
