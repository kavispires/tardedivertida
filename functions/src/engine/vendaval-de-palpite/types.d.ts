import { TextCard } from '../../utils/tdr';
import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type ResourceData = {
  words: TextCard[];
  categories: TextCard[];
};

type ClueId = string;

type Clue = {
  id: ClueId;
  playerId: PlayerId;
  clue: string;
  /**
   * Indicates if the boss has already evaluated this clue against the secret word
   */
  evaluation?: boolean;
  /**
   * Indicates if clue is a final guess
   */
  isGuess?: boolean;
  /**
   * Indicates if the boss has used help to reveal the resolution of this clue
   */
  isResolved?: boolean;
};

type Clues = Record<ClueId, Clue>;

type CurrentRound = number;

type BoardEntry = {
  clues: ClueId[];
  evaluation?: number;
};

type Board = Record<CurrentRound, BoardEntry>;

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
    | 'SUBMIT_BOSS'
    | 'SUBMIT_SECRET_WORD'
    | 'SUBMIT_CLUES'
    | 'SUBMIT_EVALUATION'
    | 'SUBMIT_OUTCOME'
    | 'SUBMIT_HELP';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | VendavalDePalpiteState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | VendavalDePalpiteStore;
