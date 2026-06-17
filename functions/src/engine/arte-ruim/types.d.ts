import type { ArteRuimCard, ArteRuimGroup, ArteRuimPair } from '../../types/tdr';
import type { ARTE_RUIM_ACTIONS } from './constants';

export type ArteRuimGameOptions = {
  /**
   * Use all cards, not just unused ones
   */
  useAllCards: boolean;
  /**
   * Use only basic levels (1-2-3)
   */
  basicLevelsOnly: boolean;
  /**
   * Make game with variant number of levels by having a score goal (max 10 rounds)
   */
  forPoints: boolean;
  /**
   * Randomize levels
   */
  randomize: boolean;
  /**
   * Use special surprise twist for level 4
   */
  specialLevels: boolean;
};

export type CardsByLevel = Record<string, ArteRuimCard[]>;

export type Level4Type = 'pairs' | 'contenders' | 'movies' | 'adjectives';

export type ResourceData = {
  allCards: Dictionary<ArteRuimCard>;
  availableCards: CardsByLevel;
  cardsPairs: ArteRuimPair[];
  cardsGroups: ArteRuimGroup[];
  specialLevels: {
    cards: ArteRuimCard[];
    types: Level4Type[];
  } | null;
};

export interface ArteRuimDrawing extends ArteRuimCard {
  playerId: UID | null;
  drawing: string | null;
  successRate: number;
}

export interface ArteRuimStore extends DefaultStore {
  deck: ArteRuimCard[];
  currentCards: ArteRuimCard[] | ArteRuimDrawing[];
  pastDrawings: ArteRuimDrawing[];
}

export interface ArteRuimState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface ArteRuimPlayer extends Player {
  votes: any;
}

export type ArteRuimPlayers = Record<UID, ArteRuimPlayer>;

export interface ArteRuimInitialState extends InitialState {
  store: ArteRuimStore;
  state: ArteRuimState;
}

export interface ArteRuimSubmitAction extends Payload {
  action: keyof typeof ARTE_RUIM_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & ArteRuimState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & ArteRuimStore;
export type FirebasePlayersData = FirebaseFirestore.DocumentData & ArteRuimPlayers;
