import { TextCard } from '../../utils/tdr';
import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type ResourceData = {
  words: TextCard[];
  categories: TextCard[];
};

type Clue = {
  playerId: PlayerId;
  clue: string;
  isGuess?: boolean;
};

type BoardEntry = {
  clues: Clue[];
  evaluation?: number;
};

type Board = {
  [key: string]: BoardEntry;
};

interface VendavalDePalpiteStore extends DefaultStore {
  categories: TextCard[];
  words: TextCard[];
  [key: string]: any;
}

interface VendavalDePalpiteState extends DefaultState {
  [key: string]: any;
}

interface VendavalDePalpiteInitialState extends InitialState {
  store: VendavalDePalpiteStore;
  state: VendavalDePalpiteState;
}

interface VendavalDePalpiteSubmitAction extends Payload {
  action:
    | 'SUBMIT_MASTER'
    | 'SUBMIT_SECRET_WORD'
    | 'SUBMIT_CLUES'
    | 'SUBMIT_EVALUATION'
    | 'SUBMIT_OUTCOME'
    | 'SUBMIT_HELP';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | VendavalDePalpiteState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | VendavalDePalpiteStore;
