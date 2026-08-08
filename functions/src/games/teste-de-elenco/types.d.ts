// Types
import type { ItemData, MovieCardData, SuspectCardData, TestimonyStatementCardData } from '../../types/tdr';
import type { TESTE_DE_ELENCO_ACTIONS } from './constants';

export type TesteDeElencoOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
} & SuspectCardsOptions;

export type ActorId = UID;

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
  candidates: Dictionary<SuspectCardData>;
  selection: ActorId[];
  actor?: ActorId;
  cast: boolean;
  round: number;
  directors: UID[];
} & Pick<MovieRole, 'id' | 'title' | 'description' | 'type'>;

export type MovieGenre = {
  id: string;
  title: DualLanguageValue;
  roles: MovieRole[];
};

export type Movie = {
  id: string;
  movieTitle: string;
  movieProps: ItemData[];
  genre: DualLanguageValue;
  roles: Dictionary<ActingRole>;
  rolesOrder: string[];
};

export interface ResourceData {
  moviesSamples: MovieCardData[];
  itemsSamples: ItemData[];
  allCards: TestimonyStatementCardData[];
  allActors: SuspectCardData[];
}

export interface TesteDeElencoStore extends DefaultStore<TesteDeElencoOptions> {
  traits: string[];
  actors: SuspectCardData[];
}

export interface TesteDeElencoState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface TesteDeElencoInitialState extends InitialState {
  store: TesteDeElencoStore;
  state: TesteDeElencoState;
}

export interface TesteDeElencoSubmitAction extends Payload {
  action: keyof typeof TESTE_DE_ELENCO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | TesteDeElencoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TesteDeElencoStore;
