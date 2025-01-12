import type { Item, MovieCard, SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
import type { TESTE_DE_ELENCO_ACHIEVEMENTS, TESTE_DE_ELENCO_ACTIONS } from './constants';

export type TesteDeElencoOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
} & SuspectCardsOptions;

export type ActorId = CardId;

export type MovieRole = {
  id: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  complexity: number;
  pool: number;
  type: string;
};

export type ActingRole = {
  traits: string[];
  candidates: Dictionary<SuspectCard>;
  selection: ActorId[];
  actor?: ActorId;
  cast: boolean;
  round: number;
  directors: PlayerId[];
} & Pick<MovieRole, 'id' | 'title' | 'description' | 'type'>;

export type MovieGenre = {
  id: string;
  title: DualLanguageValue;
  roles: MovieRole[];
};

export type Movie = {
  id: string;
  movieTitle: string;
  movieProps: Item[];
  genre: DualLanguageValue;
  roles: Dictionary<ActingRole>;
  rolesOrder: string[];
};

export interface ResourceData {
  moviesSamples: MovieCard[];
  itemsSamples: Item[];
  allCards: TestimonyQuestionCard[];
  allActors: SuspectCard[];
}

export interface TesteDeElencoStore extends DefaultStore<TesteDeElencoOptions> {
  traits: string[];
  actors: SuspectCard[];
}

export interface TesteDeElencoState extends DefaultState {
  [key: string]: any;
}

export interface TesteDeElencoInitialState extends InitialState {
  store: TesteDeElencoStore;
  state: TesteDeElencoState;
}

export type TesteDeElencoAchievement = keyof typeof TESTE_DE_ELENCO_ACHIEVEMENTS;

export interface TesteDeElencoSubmitAction extends Payload {
  action: keyof typeof TESTE_DE_ELENCO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | TesteDeElencoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TesteDeElencoStore;
