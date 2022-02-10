import {
  DefaultState,
  DefaultStore,
  DualLanguageValue,
  InitialState,
  NumberDictionary,
  Payload,
} from '../../utils/types';

type NoRuaDoMedoOptions = {
  shortGame: boolean;
};

type Card = {
  id: string;
  key: string;
  name: DualLanguageValue;
  type: 'horror' | 'candy' | 'jackpot';
  value: number;
};

type Decks = {
  horrorDeck: Card[];
  jackpotDeck: Card[];
  candyDeck: Card[];
  horrorCount: NumberDictionary;
};

type CandyStatus = {
  leftover: number;
  perPlayer: number;
};

type Outcome = {
  status: string;
  flipCard: boolean;
  isEverybodyHome?: boolean;
};

interface NoRuaDoMedoStore extends DefaultStore {
  horrorDeck: Card[];
  jackpotDeck: Card[];
  candyDeck: Card[];
  usedHorrorIds: string[];
  claimedJackpotIds: string[];
  [key: string]: any;
}

interface NoRuaDoMedoState extends DefaultState {
  street?: Card[];
  currentCard?: Card;
  candySidewalk?: CandyStatus[];
  totalCandyInSidewalk?: number;
  isEverybodyHome?: boolean;
  isDoubleHorror?: boolean;
  [key: string]: any;
}

interface NoRuaDoMedoInitialState extends InitialState {
  store: NoRuaDoMedoStore;
  state: NoRuaDoMedoState;
}

interface NaRuaDoMedoSubmitAction extends Payload {
  action: 'SUBMIT_DECISION';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | NoRuaDoMedoState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | NoRuaDoMedoStore;

type Decisions = 'CONTINUE' | 'GO_HOME' | 'HOME';
