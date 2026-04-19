// Types
import type { GameRanking, GamePlayer, Achievement } from 'types/game';

export interface ClientCard {
  id: string;
  type: string;
  playerId: UID;
  imageId: string;
  color: string;
}

export interface Teller {
  id: string;
  type: string;
  imageId: string;
  capacity: number[];
  doublers: string[];
  queue: string[];
  lastEvent: {
    eventId: string;
    playedCardId: string;
    effectType: string;
    // ADD THIS: The snapshot of the queue right before this event
    queueBeforeEvent: string[]; // (e.g., ['A', 'B'])
  } | null;
}

export type SubmitPlayCardPayload = {
  /** The card from the player's hand (or a teller) to play */
  cardId: string;
  /** The teller where the card will be placed */
  tellerId: string;
  /** The card that will be in the player's hand after the move */
  newCardId: string;
};

export type PhaseCardPlayState = {
  activePlayerId: UID;
  deckDict: Dictionary<ClientCard>;
  drawDeck: UID[];
  gameOrder: TurnOrder;
  tellers: Dictionary<Teller>;
  outcome: string;
  previousPlayerId: UID | null;
};

export type PhaseRoundResolutionState = {
  activePlayerId: UID;
  deckDict: Dictionary<ClientCard>;
  drawDeck: UID[];
  gameOrder: TurnOrder;
  outcome: string;
  previousPlayerId: null;
  tellers: Dictionary<Teller>;
  ranking: GameRanking;
};

export type PhaseGameOverState = {
  winners: GamePlayer[];
  achievements: Achievement[];
  deckDict: Dictionary<ClientCard>;
  gallery: UID[];
  gameEndedAt: number;
};
