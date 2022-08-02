export type NoRuaDoMedoOptions = {
  shortGame: boolean;
};

export type Card = {
  id: string;
  key: string;
  name: DualLanguageValue;
  type: 'horror' | 'candy' | 'jackpot';
  value: number;
};

export type Decks = {
  horrorDeck: Card[];
  jackpotDeck: Card[];
  candyDeck: Card[];
  horrorCount: NumberDictionary;
};

export type CandyStatus = {
  leftover: number;
  perPlayer: number;
};

export type Outcome = {
  status: string;
  flipCard: boolean;
  isEverybodyHome?: boolean;
};

export interface NoRuaDoMedoStore extends DefaultStore {
  horrorDeck: Card[];
  jackpotDeck: Card[];
  candyDeck: Card[];
  usedHorrorIds: string[];
  claimedJackpotIds: string[];
  [key: string]: any;
}

export interface NoRuaDoMedoState extends DefaultState {
  street?: Card[];
  currentCard?: Card;
  candySidewalk?: CandyStatus[];
  totalCandyInSidewalk?: number;
  isEverybodyHome?: boolean;
  isDoubleHorror?: boolean;
  [key: string]: any;
}

export interface NoRuaDoMedoInitialState extends InitialState {
  store: NoRuaDoMedoStore;
  state: NoRuaDoMedoState;
}

export interface NaRuaDoMedoSubmitAction extends Payload {
  action: 'SUBMIT_DECISION';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | NoRuaDoMedoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | NoRuaDoMedoStore;

export type Decisions = 'CONTINUE' | 'GO_HOME' | 'HOME';
