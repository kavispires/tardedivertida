import { ArteRuimCard, ArteRuimGroup } from '../../types/tdr';
import { ARTE_RUIM_ACHIEVEMENTS, ARTE_RUIM_ACTIONS } from './constants';

export type ArteRuimGameOptions = {
  /**
   * Use all cards, not just unused ones
   */
  useAllCards: boolean;
  /**
   * Make game with variant number of levels by having a score goal (max 10 rounds)
   */
  forPoints: boolean;
  /**
   * Randomize levels
   */
  randomize: boolean;
  /**
   * Use special surprise twist for level 5
   */
  specialLevels: boolean;
};

export type CardsByLevel = Record<string, ArteRuimCard[]>;

export type Level5Type = 'pairs' | 'contenders' | 'movies' | 'adjectives';

export type ResourceData = {
  allCards: Collection<ArteRuimCard>;
  availableCards: CardsByLevel;
  cardsGroups: ArteRuimGroup[];
  specialLevels: {
    cards: ArteRuimCard[];
    types: Level5Type[];
  };
};

export interface ArteRuimDrawing extends ArteRuimCard {
  playerId: PlayerId | null;
  drawing: string | null;
  successRate: number;
}

export interface ArteRuimStore extends DefaultStore {
  deck: ArteRuimCard[];
  currentCards: ArteRuimCard[] | ArteRuimDrawing[];
  pastDrawings: ArteRuimDrawing[];
}

export interface ArteRuimState extends DefaultState {
  drawings?: any;
  gallery?: any;
  cards?: any;
  ranking?: any;
  winners?: any;
  [key: string]: any;
}

export interface ArteRuimPlayer extends Player {
  votes: any;
}

export type ArteRuimPlayers = Record<PlayerId, ArteRuimPlayer>;

export type ArteRuimAchievement = keyof typeof ARTE_RUIM_ACHIEVEMENTS;

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
