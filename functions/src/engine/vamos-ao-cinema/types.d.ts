import { VAMOS_AO_CINEMA_ACTIONS } from './constants';

export type VamosAoCinemaOptions = {
  fixedRounds: boolean;
};

export interface ResourceData {
  movies: Record<CardId, MovieCard>;
  reviews: Record<CardId, MovieReviewCard>;
}

export type UsedCards = (MovieCard | MovieReviewCard)[];

export type MovieDeck = MovieCard[];
export type ReviewsDeck = MovieReviewCard[];

export interface VamosAoCinemaStore extends DefaultStore {
  movieDeck: MovieDeck;
  movieDeckIndex: number;
  goodReviewsDeck: MovieDeck;
  goodReviewsDeckIndex: number;
  badReviewsDeck: MovieDeck;
  badReviewsDeckIndex: number;
  usedCards: UsedCards;
  selectedMovies: string[];
}

export interface VamosAoCinemaState extends DefaultState {
  gameOrder: PlayerId[];
  [key: string]: any;
}

export interface VamosAoCinemaInitialState extends InitialState {
  store: VamosAoCinemaStore;
  state: VamosAoCinemaState;
}

export interface VamosAoCinemaSubmitAction extends Payload {
  action: keyof typeof VAMOS_AO_CINEMA_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | VamosAoCinemaState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | VamosAoCinemaStore;
