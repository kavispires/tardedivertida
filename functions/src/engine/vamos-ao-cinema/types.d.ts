import type { MovieCard, MovieReviewCard } from '../../types/tdr';
import type { VAMOS_AO_CINEMA_ACHIEVEMENTS, VAMOS_AO_CINEMA_ACTIONS } from './constants';

export type VamosAoCinemaOptions = {
  fixedRounds: boolean;
};

export interface ResourceData {
  movies: Dictionary<MovieCard>;
  reviews: Dictionary<MovieReviewCard>;
}

export type UsedCards = (MovieCard | MovieReviewCard)[];

export type MovieDeck = MovieCard[];
export type ReviewsDeck = MovieReviewCard[];

export interface VamosAoCinemaStore extends DefaultStore {
  movieDeck?: MovieDeck;
  movieDeckIndex?: number;
  goodReviewsDeck?: MovieDeck;
  goodReviewsDeckIndex?: number;
  badReviewsDeck?: MovieDeck;
  badReviewsDeckIndex?: number;
  usedCards?: UsedCards;
  selectedMovies?: string[];
  gameOrder?: unknown[];
  deck?: unknown[];
  deckIndex?: number;
}

export type VamosAoCinemaAchievement = keyof typeof VAMOS_AO_CINEMA_ACHIEVEMENTS;

export interface VamosAoCinemaState extends DefaultState {
  gameOrder?: PlayerId[];
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
