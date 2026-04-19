// Types
import type { GamePlayer } from 'types/game';
// Internal
import type { ClientCard, SubmitPlayCardPayload, Teller } from './types';
import { CHARACTER_TYPES } from './constants';

export const mockPlay = (
  user: GamePlayer,
  tellers: Dictionary<Teller>,
  deckDict: Dictionary<ClientCard>,
  drawDeck: UID[],
): SubmitPlayCardPayload => {
  const hand: UID[] = user.hand;
  const deckColor: string = user.deckColor;

  // Helper: Check if a card can trigger a cut-in effect in a teller's queue
  const canTriggerCutIn = (cardId: UID, queue: UID[]): boolean => {
    const card = deckDict[cardId];
    if (!card || card.type === CHARACTER_TYPES.KID.id) return false;

    const cutInTarget = CHARACTER_TYPES[card.type]?.cutIn;
    if (!cutInTarget) return false;

    return queue.some((queueCardId) => {
      const queueCard = deckDict[queueCardId];
      return queueCard?.type === cutInTarget;
    });
  };

  // Helper: Check if a KID card can trigger the "bring next to me" effect
  const canKidTriggerEffect = (cardId: UID, queue: UID[]): boolean => {
    const card = deckDict[cardId];
    if (!card || card.type !== CHARACTER_TYPES.KID.id) return false;

    return queue.some((queueCardId) => {
      const queueCard = deckDict[queueCardId];
      return queueCard?.color === card.color;
    });
  };

  // Helper: Calculate potential points for a teller
  const calculateTellerPoints = (teller: Teller): number => {
    return teller.queue.reduce((total, cardId, index) => {
      if (index >= teller.capacity.length) return total;
      const card = deckDict[cardId];
      if (!card || card.type === CHARACTER_TYPES.KID.id) return total;

      const points = teller.capacity[index];
      const multiplier = teller.doublers.includes(card.type) ? 2 : 1;
      return total + points * multiplier;
    }, 0);
  };

  // Step 1: Filter tellers where user is not scoring yet (queue < capacity)
  let candidateTellers = Object.values(tellers).filter(
    (teller) => teller.queue.length < teller.capacity.length,
  );

  // Step 2: If all tellers are scoring, get the one with fewest points
  if (candidateTellers.length === 0) {
    const tellersSortedByPoints = Object.values(tellers).sort(
      (a, b) => calculateTellerPoints(a) - calculateTellerPoints(b),
    );
    candidateTellers = [tellersSortedByPoints[0]];
  }

  // Step 3: Find teller where a non-kid card can trigger an effect
  let selectedTeller: Teller | null = null;
  let selectedCard: UID | null = null;

  const nonKidCards = hand.filter((cardId) => {
    const card = deckDict[cardId];
    return card?.type !== CHARACTER_TYPES.KID.id;
  });

  for (const teller of candidateTellers) {
    for (const cardId of nonKidCards) {
      if (canTriggerCutIn(cardId, teller.queue)) {
        selectedTeller = teller;
        selectedCard = cardId;
        break;
      }
    }
    if (selectedTeller) break;
  }

  // Step 4: If no effect found and user has a kid, pick the kid (preferably one that triggers effect)
  if (!selectedTeller) {
    const kidCards = hand.filter((cardId) => {
      const card = deckDict[cardId];
      return card?.type === CHARACTER_TYPES.KID.id;
    });

    if (kidCards.length > 0) {
      // Try to find a kid that can trigger the "bring next to me" effect
      for (const teller of candidateTellers) {
        for (const kidId of kidCards) {
          if (canKidTriggerEffect(kidId, teller.queue)) {
            selectedTeller = teller;
            selectedCard = kidId;
            break;
          }
        }
        if (selectedTeller) break;
      }

      // If no kid triggers effect, just pick the first kid and first candidate teller
      if (!selectedTeller) {
        selectedTeller = candidateTellers[0];
        selectedCard = kidCards[0];
      }
    }
  }

  // Step 5: If still no card selected, play a random card
  if (!selectedTeller) {
    selectedTeller = candidateTellers[0];
    selectedCard = hand[0];
  }

  // Step 6: Pick next card from draw deck
  // Prefer: own color > neutral > any
  let newCardId = '';

  if (drawDeck.length > 0) {
    const ownColorCard = drawDeck.find((cardId) => {
      const card = deckDict[cardId];
      return card?.color === deckColor;
    });

    const neutralCard = drawDeck.find((cardId) => {
      const card = deckDict[cardId];
      return card?.playerId === 'neutral';
    });

    newCardId = ownColorCard || neutralCard || drawDeck[0];
  }

  return {
    cardId: selectedCard ?? hand[0],
    tellerId: selectedTeller?.id ?? Object.values(tellers)[0].id,
    newCardId,
  };
};
