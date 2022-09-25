import { ARTE_RUIM_ACTIONS } from './constants';

export type ArteRuimGameOptions = {
  useAllCards: boolean;
  shortGame: boolean;
};

export type CardsByLevel = Record<string, ArteRuimCard[]>;

export type ResourceData = {
  allCards: Record<CardId, ArteRuimCard>;
  availableCards: CardsByLevel;
  cardsGroups: ArteRuimGroup[];
  cardsPairs: ArteRuimPair[];
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
