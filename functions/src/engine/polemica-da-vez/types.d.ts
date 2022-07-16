import type { TextCard } from '../../utils/tdr';
import type { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type PolemicaDaVezOptions = {
  fixedRounds: boolean;
};

interface Topic extends TextCard {
  custom?: boolean;
}

interface CustomTopic extends Topic {
  custom: boolean;
}

type Deck = Topic[];
type CustomDeck = CustomTopic[];

interface Decks {
  deck: Deck;
  customDeck: CustomDeck;
  deckIndex?: number;
  customDeckIndex?: number;
  pastTopics?: any[];
}

interface PolemicaDaVezStore extends DefaultStore {
  gameOrder: PlayerId[];
}

interface PolemicaDaVezState extends DefaultState {
  activePlayerId?: PlayerId;
  gameOrder?: PlayerId[];
  currentTopics?: any;
  currentCustomTopic?: any;
  currentTopic?: any;
  customTopic?: any;
  totalLikes?: any;
  ranking?: any;
  winners?: any;
  [key: string]: any;
}

interface PolemicaDaVezInitialState extends InitialState {
  store: PolemicaDaVezStore;
  state: PolemicaDaVezState;
}

interface PolemicaDaVezSubmitAction extends Payload {
  action: 'SUBMIT_TOPIC' | 'SUBMIT_REACTION';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | PolemicaDaVezState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | PolemicaDaVezStore;
