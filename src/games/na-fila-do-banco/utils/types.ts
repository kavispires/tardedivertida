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
  previousQueue: string[];
  queue: string[];
  nextQueue: string[];
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
  deckDict: Dictionary<ClientCard>;
  drawDeck: UID[];
  tellers: Dictionary<Teller>;
  outcome: string;
  activePlayerId: UID;
};

export type PhaseRoundResolutionState = {
  deckDict: Dictionary<ClientCard>;
  drawDeck: UID[];
  tellers: Dictionary<Teller>;
  outcome: string;
  activePlayerId: UID;
  ranking: GameRanking;
};

export type PhaseGameOverState = {
  winners: GamePlayer[];
  achievements: Achievement[];
  gallery: unknown[];
  gameEndedAt: number;
};
