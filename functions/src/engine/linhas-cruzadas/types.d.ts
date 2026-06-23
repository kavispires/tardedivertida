import type { ArteRuimCardData, TextCardData } from '../../types/tdr';
import type { LINHAS_CRUZADAS_ACTIONS } from './constants';

export type LinhasCruzadasOptions = {
  singleWordOnly: boolean;
  evenDistribution: boolean;
};

export type Card = ArteRuimCardData | TextCardData;

export type ResourceData = {
  allWords: TextCardData[];
  allExpressions: ArteRuimCardData[];
};

export type Prompt = {
  id: UID; // the album entry id
  author: UID; // the player who created the prompt
  content: string;
  type: 'title' | 'drawing';
  wordCount?: number;
};

export type Slide = {
  author: UID;
  content: string;
  type: 'title' | 'drawing' | 'cover';
};

export type AlbumEntry = {
  id: UID;
  text: string;
  cardId: string;
  slides: Slide[];
};

export interface Album {
  [key: string]: AlbumEntry;
}

export interface LinhasCruzadasStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface LinhasCruzadasState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}
export interface LinhasCruzadasInitialState extends InitialState {
  store: LinhasCruzadasStore;
  state: LinhasCruzadasState;
}

export interface LinhasCruzadasSubmitAction extends Payload {
  action: keyof typeof LINHAS_CRUZADAS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | LinhasCruzadasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | LinhasCruzadasStore;
