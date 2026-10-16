import { shuffle } from 'lodash';
// Types
import type { FestaJuninaCard } from './types';
// Constants
import { SEPARATOR } from '../../constants/general';
import { CORREIO_DO_AMOR_PHASES, DECK_INFO_BY_PLAYER_COUNT, OUTCOME } from './constants';
// Mechanics
import { nextPhaseDelegator } from '../../mechanics/session';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The result used to resolve this step or advance the game
 * @param shouldTakeAction - Whether the selected card requires another interactive action
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  outcome: string,
  shouldTakeAction?: boolean | null,
): string => {
  const { SETUP, CARD_PLAY, CARD_EFFECTS, CARD_RESOLUTION, ROUND_RANKING, GAME_OVER } =
    CORREIO_DO_AMOR_PHASES;
  const order = [SETUP, CARD_PLAY, CARD_EFFECTS, CARD_RESOLUTION, ROUND_RANKING, GAME_OVER];

  // Check if game should end after last round
  if (currentPhase === ROUND_RANKING) {
    return round.forceLastRound ||
      (round.current > 0 && round.current === round.total) ||
      outcome === OUTCOME.END_GAME
      ? GAME_OVER
      : CARD_PLAY;
  }

  if (currentPhase === CARD_RESOLUTION) {
    return outcome === OUTCOME.END_ROUND ? ROUND_RANKING : CARD_PLAY;
  }

  // Define if we need to go to card effects phase based on active effect keyword
  if (currentPhase === CARD_PLAY) {
    return shouldTakeAction ? CARD_EFFECTS : CARD_RESOLUTION;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Get the card key which is used as a key for cardsDict
 * @param cardId - Identifier of the card associated with this entry
 * @returns The key of the card
 */
export const getCardKeyFromId = (cardId: string) => {
  const [key] = cardId.split(SEPARATOR);
  return key;
};

/**
 * Builds unique card IDs for the round deck based on the original card IDs and their index in the deck
 * @param deck - The array of card IDs for the round deck
 * @returns An array of unique card IDs for the round deck
 */
const buildCardUniqueIds = (deck: UID[]) => {
  return deck.map((cardId, index) => `${cardId}${SEPARATOR}${index}`);
};

/**
 * Updates the count of each card in the cardsDict based on the current round deck
 * @param cardsDict - The dictionary of cards
 * @param deck - The array of unique card IDs for the round deck
 */
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

/**
 * Builds and shuffles uniquely identified card copies using round progression and player-count requirements.
 * @param cardsDict - The card definitions indexed by identifier
 * @param currentRound - The current round number
 * @param playerCount - The number of players in the session
 * @param plusCardsRotation - The sequence of plus-tier cards used across rounds
 * @param advancedCardsRotation - The sequence of advanced cards used in later rounds
 * @returns The shuffled card identifiers for this round
 */
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
  /**
   * Alternates rank-one card identifiers to fill the remaining deck positions.
   * @param quantityNeeded - The number of padding card identifiers to generate
   * @returns The rank-one card identifiers used for padding
   */
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

  const selectedDeck: UID[] = Object.values(cardsDict)
    .filter((card) => card.setupTier === 'core')
    .flatMap((card) => Array(card.quantity).fill(card.id));

  // From Round 2 on - Introduce Rank 0 and from now on alternate the selection of the ZERO group
  if (currentRound >= 2) {
    const plusCardId = plusCardsRotation[currentRound % plusCardsRotation.length];
    const plusCard = cardsDict[plusCardId];
    selectedDeck.push(...Array(plusCard.quantity).fill(plusCard.id));
  }

  // From Round 4 on - Add an advanced card from advancedCardsRotation (all cards are only 1 copy)
  // If from a group already in the deck that has the setupRule 'COMBINE', simply add it.
  // If from a group already in the deck that has the setupRule 'SINGLE', replaced the existing card in the group with this one
  if (currentRound >= 4) {
    const advancedCardId = advancedCardsRotation[currentRound % advancedCardsRotation.length];
    const advancedCard = cardsDict[advancedCardId];
    const existingCardIndex = selectedDeck.findIndex((cardId) => {
      const card = cardsDict[cardId];
      return card.rank === advancedCard.rank;
    });
    if (existingCardIndex !== -1) {
      const existingCard = cardsDict[selectedDeck[existingCardIndex]];
      if (existingCard.setupRule === 'SINGLE') {
        selectedDeck[existingCardIndex] = advancedCard.id;
      } else if (existingCard.setupRule === 'COMBINE') {
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

  // TODO: REMOVE TEMPORARY TESTING
  //   const ALL_CARD_IDS: UID[] = [
  //   '0_SANFONEIRO',
  //   '0_PAU_DE_SEBO',
  //   '0_CRIANCA',
  //   '0_BEBADO',
  //   '1_CAIPIRA_HOMEM',
  //   '1_CAIPIRA_MULHER',
  //   '2_PADRE',
  //   '2_CARTOMANTE',
  //   '3_NOIVO',
  //   '3_NOIVA',
  //   '4_DANCARINA',
  //   '4_DANCARINO',
  //   '5_DELEGADO',
  //   '6_BARRAQUINHA_A',
  //   '6_BARRAQUINHA_B',
  //   '6_BARRAQUINHA_C',
  //   '7_PUXADOR_A',
  //   '7_PUXADOR_B',
  //   '7_PUXADOR_C',
  //   '8_FAZENDEIRO',
  //   '9_COMILAO',
  //   '10_GOAL',
  //   '11_EXS',
  // ];
  //  updateCardsCount(cardsDict, ALL_CARD_IDS);
  //   return shuffle(buildCardUniqueIds(ALL_CARD_IDS));
}
