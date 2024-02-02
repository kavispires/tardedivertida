import { ArteRuimCard, TextCard } from '../../types/tdr';
import { LINHAS_CRUZADAS_ACHIEVEMENTS, LINHAS_CRUZADAS_ACTIONS } from './constants';

export type LinhasCruzadasOptions = {
  singleWordOnly: boolean;
  evenDistribution: boolean;
};

export type Card = ArteRuimCard | TextCard;

export type ResourceData = {
  allWords: TextCard[];
  allExpressions: ArteRuimCard[];
};

export type Prompt = {
  id: PlayerId; // the album entry id
  author: PlayerId; // the player who created the prompt
  content: string;
  type: 'title' | 'drawing';
  wordCount?: number;
};

export type Slide = {
  author: PlayerId;
  content: string;
  type: 'title' | 'drawing' | 'cover';
};

export type AlbumEntry = {
  id: PlayerId;
  text: string;
  cardId: string;
  slides: Slide[];
};

export interface Album {
  [key: string]: AlbumEntry;
}

export interface LinhasCruzadasStore extends DefaultStore {
  [key: string]: any;
}

export interface LinhasCruzadasState extends DefaultState {
  [key: string]: any;
}
export interface LinhasCruzadasInitialState extends InitialState {
  store: LinhasCruzadasStore;
  state: LinhasCruzadasState;
}

export interface LinhasCruzadasSubmitAction extends Payload {
  action: keyof typeof LINHAS_CRUZADAS_ACTIONS;
}

export type LinhasCruzadasAchievement = keyof typeof LINHAS_CRUZADAS_ACHIEVEMENTS;

export type FirebaseStateData = FirebaseFirestore.DocumentData | LinhasCruzadasState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | LinhasCruzadasStore;
