// Types
import type { ItemData, MovieCardData, SuspectCardData, TestimonyStatementCardData } from '../../types/tdr';
import type { TESTE_DE_ELENCO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `teste-de-elenco` session.
 */
export type TesteDeElencoOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
} & SuspectCardsOptions;

/**
 * Identifier of a suspect-card actor available for casting.
 */
export type ActorId = UID;

/**
 * A role definition with its complexity, candidate-pool size, and localized description.
 */
export type MovieRole = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The localized title displayed for this entry.
   */
  title: DualLanguageValue;
  /**
   * The localized description explaining this entry.
   */
  description: DualLanguageValue;
  /**
   * The number of trait requirements for the acting role.
   */
  complexity: number;
  /**
   * The number of actor candidates available for this role.
   */
  pool: number;
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: string;
};

/**
 * A movie role's traits, candidate actors, director selections, and casting progress.
 */
export type ActingRole = {
  /**
   * Trait identifiers used for casting requirements.
   */
  traits: string[];
  /**
   * Actor candidates indexed by identifier.
   */
  candidates: Dictionary<SuspectCardData>;
  /**
   * Actor identifiers selected for the role.
   */
  selection: ActorId[];
  /**
   * Identifier of the actor ultimately cast in the role.
   */
  actor?: ActorId;
  /**
   * Whether casting for this role has been completed.
   */
  cast: boolean;
  /**
   * The current casting-attempt number for this role.
   */
  round: number;
  /**
   * Identifiers of players directing this role.
   */
  directors: UID[];
} & Pick<MovieRole, 'id' | 'title' | 'description' | 'type'>;

/**
 * A movie genre and the role definitions available for that genre.
 */
export type MovieGenre = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The localized title displayed for this entry.
   */
  title: DualLanguageValue;
  /**
   * Role definitions or casting entries associated with the movie.
   */
  roles: MovieRole[];
};

/**
 * A generated movie with its title, props, genre, and ordered casting roles.
 */
export type Movie = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The title selected or generated for the movie.
   */
  movieTitle: string;
  /**
   * Item resources selected as props for the movie.
   */
  movieProps: ItemData[];
  /**
   * The genre associated with this book pattern or generated movie.
   */
  genre: DualLanguageValue;
  /**
   * Role definitions or casting entries associated with the movie.
   */
  roles: Dictionary<ActingRole>;
  /**
   * Role identifiers in their casting order.
   */
  rolesOrder: string[];
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * Movie resources available for generating title options.
   */
  moviesSamples: MovieCardData[];
  /**
   * Item resources available for movie props.
   */
  itemsSamples: ItemData[];
  /**
   * The complete card resources available for selection.
   */
  allCards: TestimonyStatementCardData[];
  /**
   * Actor resources available for casting.
   */
  allActors: SuspectCardData[];
}

/**
 * Server-side data retained between phases of a `teste-de-elenco` session.
 */
export interface TesteDeElencoStore extends DefaultStore<TesteDeElencoOptions> {
  /**
   * Trait identifiers used for casting requirements.
   */
  traits: string[];
  /**
   * Actor resources selected for this game.
   */
  actors: SuspectCardData[];
}

/**
 * Public game state shared with players during a `teste-de-elenco` session.
 */
export interface TesteDeElencoState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `teste-de-elenco` session.
 */
export interface TesteDeElencoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: TesteDeElencoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: TesteDeElencoState;
}

/**
 * Player action payload accepted by the `teste-de-elenco` engine.
 */
export interface TesteDeElencoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof TESTE_DE_ELENCO_ACTIONS;
}

/**
 * Firestore document data used when reading the `teste-de-elenco` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | TesteDeElencoState;
/**
 * Firestore document data used when reading the `teste-de-elenco` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TesteDeElencoStore;
