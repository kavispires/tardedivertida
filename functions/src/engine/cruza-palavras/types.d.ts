import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type CruzaPalavrasOptions = {
  largerGrid: boolean;
};

type WordCard = {
  id: string;
  text: string;
};

type AllWords = {
  [key: string]: WordCard;
};

type ResourceData = {
  allWords: AllWords;
};

type Deck = WordCard[];

type ClueEntry = {
  playerId: PlayerId;
  clue: string;
  coordinate: number;
};

type GridCell = {
  index: number;
  kind: string;
  text: string;
  available: boolean;
  id?: string;
  x?: number;
  y?: number;
  xText?: string;
  yText?: string;
  writable?: boolean;
  playerId?: string | null;
};

interface CruzaPalavrasStore extends DefaultStore {
  deck?: Deck;
  [key: string]: any;
}

interface CruzaPalavrasState extends DefaultState {
  [key: string]: any;
}

interface CruzaPalavrasInitialState extends InitialState {
  store: CruzaPalavrasStore;
  state: CruzaPalavrasState;
}

interface CruzaPalavrasSubmitAction extends Payload {
  action: 'SUBMIT_CLUE' | 'SUBMIT_GUESSES';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | CruzaPalavrasState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | CruzaPalavrasStore;