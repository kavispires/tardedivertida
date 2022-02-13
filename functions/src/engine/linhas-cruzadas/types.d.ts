import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type ExpressionCard = {
  id: string;
  text: string;
  level: number;
};

type WordCard = {
  id: string;
  text: string;
};

type ResourceData = {
  allWords: WordCard[];
  allExpressions: ExpressionCard[];
};

type Prompt = {
  id: PlayerId; // the album entry id
  createdBy: PlayerId; // the player who created the prompt
  content: string;
  type: 'title' | 'drawing';
};

type Slide = {
  playerId: PlayerId;
  content: string;
  type: 'title' | 'drawing';
};

type AlbumEntry = {
  id: PlayerId;
  text: string;
  cardId: string;
  slides: Slide[];
};

interface Album {
  [key: string]: AlbumEntry;
}

interface LinhasCruzadasStore extends DefaultStore {
  [key: string]: any;
}

interface LinhasCruzadasState extends DefaultState {
  [key: string]: any;
}
interface LinhasCruzadasInitialState extends InitialState {
  store: LinhasCruzadasStore;
  state: LinhasCruzadasState;
}

interface LinhasCruzadasSubmitAction extends Payload {
  action: 'SUBMIT_PROMPT' | 'SUBMIT_DRAWING' | 'SUBMIT_GUESS';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | LinhasCruzadasState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | LinhasCruzadasStore;
