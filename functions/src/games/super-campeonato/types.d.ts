// Types
import type { ContenderCardData, TextCardData } from '../../types/tdr';
import type { SUPER_CAMPEONATO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `super-campeonato` session.
 */
export type SuperCampeonatoOptions = {
  /**
   * Possibly include nsfw contenders
   */
  nsfw?: boolean;
  /**
   * Automatically select contenders for the round (for games over 8 players)
   */
  autoContenders?: boolean;
} & ContendersDecksOptions;

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * Contender resources available for selection or battle.
   */
  contenders: ContenderCardData[];
  /**
   * Challenge prompts available for tournament rounds.
   */
  challenges: TextCardData[];
}

/**
 * The contender resources available for tournament selection.
 */
export type ContendersDeck = ContenderCardData[];

/**
 * The challenge prompts available for tournament rounds.
 */
export type ChallengesDeck = TextCardData[];

/**
 * A tournament contender associated with a player or the CPU.
 */
export type FightingContender = {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID | 'CPU';
} & Pick<ContenderCardData, 'id' | 'name' | 'description'>;

/**
 * Previously played challenges and their competing contenders.
 */
export type PastBattles = {
  /**
   * The challenge used to compare the competing contenders.
   */
  challenge: TextCardData;
  /**
   * Contender resources available for selection or battle.
   */
  contenders: FightingContender[];
}[];

/**
 * The quarterfinal, semifinal, final, or winner position in a tournament bracket.
 */
export type BracketTier = 'quarter' | 'semi' | 'final' | 'winner';

/**
 * A tournament contender's bracket position, votes, tier, and outcome.
 */
export interface Bracket extends FightingContender {
  /**
   * The contender's position within the tournament bracket.
   */
  position: number;
  /**
   * Whether this bracket entry won its battle.
   */
  win?: boolean;
  /**
   * The tournament stage represented by this bracket entry.
   */
  tier: BracketTier;
  /**
   * Identifiers of players who voted for this contender.
   */
  votes: UID[];
}

/**
 * Server-side data retained between phases of a `super-campeonato` session.
 */
export interface SuperCampeonatoStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `super-campeonato` session.
 */
export interface SuperCampeonatoState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `super-campeonato` session.
 */
export interface SuperCampeonatoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: SuperCampeonatoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: SuperCampeonatoState;
}

/**
 * Player action payload accepted by the `super-campeonato` engine.
 */
export interface SuperCampeonatoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof SUPER_CAMPEONATO_ACTIONS;
}

/**
 * Firestore document data used when reading the `super-campeonato` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | SuperCampeonatoState;
/**
 * Firestore document data used when reading the `super-campeonato` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | SuperCampeonatoStore;
