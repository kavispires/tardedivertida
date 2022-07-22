export type OndaTelepaticaOptions = {
  fixedRounds: boolean;
};

export interface CategoryCard extends OpposingIdeaCard {
  target?: number;
  clue?: string;
  psychicId?: string;
}

export interface ResourceData {
  allCategories: {
    [key: string]: OpposingIdeaCard;
  };
}

export type PastCategories = CategoryCard[];

export type Deck = CategoryCard[];

export interface OndaTelepaticaStore extends DefaultStore {
  gameOrder?: PlayerId[];
  deck?: Deck;
  deckIndex?: number;
  pastCategories?: PastCategories;

  [key: string]: any;
}

export interface OndaTelepaticaState extends DefaultState {
  [key: string]: any;
}

export interface OndaTelepaticaInitialState extends InitialState {
  store: OndaTelepaticaStore;
  state: OndaTelepaticaState;
}

export interface OndaTelepaticaSubmitAction extends Payload {
  action: 'SUBMIT_CATEGORY' | 'SUBMIT_CLUE' | 'SUBMIT_GUESS';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | OndaTelepaticaState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | OndaTelepaticaStore;
