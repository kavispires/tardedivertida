import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

interface WordCard {
  id: string;
  text: string;
}

interface AllWords {
  [key: string]: WordCard;
}

interface ResourceData {
  allWords: AllWords;
}

type Deck = WordCard[];

interface ClueEntry {
  playerId: PlayerId;
  clue: string;
  coordinate: number;
}

interface GridCell {
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
}

interface CruzaPalavrasStore extends DefaultStore {
  deck?: Deck;
  [key: string]: any;
}

interface CruzaPalavrasState extends DefaultState {
  [key: string]: any;
}

interface XTudoPalavrasInitialState extends InitialState {
  store: CruzaPalavrasStore;
  state: CruzaPalavrasState;
}

interface XTudoPalavrasSubmitAction extends Payload {
  action: 'SUBMIT_CLUE' | 'SUBMIT_GUESSES';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | CruzaPalavrasState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | CruzaPalavrasStore;
