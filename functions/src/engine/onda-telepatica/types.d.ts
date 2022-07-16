import type { OpposingIdeaCard } from '../../utils/tdr';
import type { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type OndaTelepaticaOptions = {
  fixedRounds: boolean;
};

interface CategoryCard extends OpposingIdeaCard {
  target?: number;
  clue?: string;
  psychicId?: string;
}

interface ResourceData {
  allCategories: {
    [key: string]: OpposingIdeaCard;
  };
}

type PastCategories = CategoryCard[];

type Deck = CategoryCard[];

interface OndaTelepaticaStore extends DefaultStore {
  gameOrder?: PlayerId[];
  deck?: Deck;
  deckIndex?: number;
  pastCategories?: PastCategories;

  [key: string]: any;
}

interface OndaTelepaticaState extends DefaultState {
  [key: string]: any;
}

interface OndaTelepaticaInitialState extends InitialState {
  store: OndaTelepaticaStore;
  state: OndaTelepaticaState;
}

interface OndaTelepaticaSubmitAction extends Payload {
  action: 'SUBMIT_CATEGORY' | 'SUBMIT_CLUE' | 'SUBMIT_GUESS';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | OndaTelepaticaState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | OndaTelepaticaStore;
