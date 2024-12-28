import type { NA_RUA_DO_MEDO_ACHIEVEMENTS, NA_RUA_DO_MEDO_ACTIONS } from './constants';

export type NoRuaDoMedoOptions = {
  shortGame: boolean;
};

export type HouseCard = {
  id: string;
  key: string;
  name: DualLanguageValue;
  type: 'horror' | 'candy' | 'jackpot';
  value: number;
};

export type Decks = {
  horrorDeck: HouseCard[];
  jackpotDeck: HouseCard[];
  candyDeck: HouseCard[];
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
  horrorDeck: HouseCard[];
  jackpotDeck: HouseCard[];
  candyDeck: HouseCard[];
  usedHorrorIds: string[];
  claimedJackpotIds: string[];
  [key: string]: any;
}

export interface NoRuaDoMedoState extends DefaultState {
  street?: HouseCard[];
  currentCard?: HouseCard;
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
  action: keyof typeof NA_RUA_DO_MEDO_ACTIONS;
}

export type NaRuaDoMedoAchievement = keyof typeof NA_RUA_DO_MEDO_ACHIEVEMENTS;

export type FirebaseStateData = FirebaseFirestore.DocumentData | NoRuaDoMedoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | NoRuaDoMedoStore;

export type Decisions = 'CONTINUE' | 'GO_HOME' | 'HOME';
