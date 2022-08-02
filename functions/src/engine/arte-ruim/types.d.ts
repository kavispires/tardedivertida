export type ArteRuimGameOptions = {
  useAllCards: boolean;
  shortGame: boolean;
};

export type CardsByLevel = {
  [key: string]: ArteRuimCard[];
};

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
  deck: Record<string, ArteRuimCard>;
  currentCards: string[];
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
export interface ArteRuimInitialState extends InitialState {
  store: ArteRuimStore;
  state: ArteRuimState;
}

export interface ArteRuimSubmitAction extends Payload {
  action: 'SUBMIT_DRAWING' | 'SUBMIT_VOTING';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | ArteRuimState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | ArteRuimStore;
