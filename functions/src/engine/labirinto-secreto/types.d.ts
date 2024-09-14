import { TextCard } from '../../types/tdr';
import { DIRECTIONS, LABIRINTO_SECRETO_ACHIEVEMENTS, LABIRINTO_SECRETO_ACTIONS } from './constants';

export type LabirintoSecretoGameOptions = {
  /**
   * Shorter path with 5 instead of 10 trees
   */
  shortPath?: boolean;
  /**
   * Use items instead of trees
   */
  itemTreeType?: boolean;
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
};

export type ResourceData = {
  forestCards: TextCard[];
  allCards: TextCard[];
};

type TreeId = number;
export type Point = [number, number];

export type ExtendedTextCard = {
  negate?: boolean;
} & TextCard;

export interface Tree {
  /**
   * Forest segment id/index
   */
  id: TreeId;
  /**
   * The tree picture (a string means an itemId)
   */
  treeType: number | string;
  /**
   * Text card
   */
  card: TextCard;
}

export type Direction = keyof typeof DIRECTIONS;

export interface MapSegment {
  /**
   * Player map index
   */
  index: number;
  /**
   * Player map segment belongs to
   */
  playerId: PlayerId;
  /**
   * Equivalent Forest segment
   */
  treeId: TreeId;
  /**
   * Was segment discovered by a player
   */
  passed: boolean;
  /**
   * Is the segment active in the current round
   */
  active: boolean;
  /**
   * Points granted by the segment
   */
  score: number;
  /**
   * The tree before this one
   */
  previousTree: TreeId | null;
  /**
   * The tree after this one
   */
  nextTree: TreeId | null;
  /**
   * Direction of the next segment
   */
  direction: Direction | null;
  /**
   * Card ids attached to it by the user as clues
   */
  clues: ExtendedTextCard[];
  /**
   * List of players that are currently on this segment
   */
  playersIds: PlayerId[];
}

export interface LabirintoSecretoStore extends DefaultStore {
  [key: string]: any;
}

export interface LabirintoSecretoState extends DefaultState {
  [key: string]: any;
}

export interface LabirintoSecretoPlayer extends Player {
  votes: any;
}

export type LabirintoSecretoPlayers = Record<PlayerId, LabirintoSecretoPlayer>;

export type LabirintoSecretoAchievement = keyof typeof LABIRINTO_SECRETO_ACHIEVEMENTS;

export interface LabirintoSecretoInitialState extends InitialState {
  store: LabirintoSecretoStore;
  state: LabirintoSecretoState;
}

export interface LabirintoSecretoSubmitAction extends Payload {
  action: keyof typeof LABIRINTO_SECRETO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & LabirintoSecretoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & LabirintoSecretoStore;
export type FirebasePlayersData = FirebaseFirestore.DocumentData & LabirintoSecretoPlayers;
