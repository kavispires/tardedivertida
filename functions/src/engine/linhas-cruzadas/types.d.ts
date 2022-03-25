import { ArteRuimCard, TextCard } from '../../utils/tdr';
import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type LinhasCruzadasOptions = {
  singleWordOnly: boolean;
  evenDistribution: boolean;
};

type Card = ArteRuimCard | TextCard;

type ResourceData = {
  allWords: TextCard[];
  allExpressions: ArteRuimCard[];
};

type Prompt = {
  id: PlayerId; // the album entry id
  author: PlayerId; // the player who created the prompt
  content: string;
  type: 'title' | 'drawing';
  wordCount?: number;
};

type Slide = {
  author: PlayerId;
  content: string;
  type: 'title' | 'drawing' | 'cover';
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
