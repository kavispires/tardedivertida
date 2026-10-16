// Types
import type { MEGAMIX_ACTIONS } from './constants';

/**
 * The resource and interaction categories supported by Megamix tracks.
 */
export type MegamixTrackType =
  | 'images'
  | 'characters'
  | 'drawing'
  | 'people'
  | 'icons'
  | 'words'
  | 'pattern'
  | 'consensus'
  | 'input'
  | 'opinions'
  | 'special'
  | 'other';

/**
 * Configuration options used when creating a `megamix` session.
 */
export type MegamixGameOptions = {
  /**
   * Use not safe for work games and cards
   */
  nsfw: boolean;
  /**
   * Use party mode
   */
  partyMode: boolean;
  /**
   * Adds more special tracks to the game (default: 3-5, more: all selected special tracks)
   */
  moreTracks: boolean;
  /**
   * Track categories to include in the game
   */
  tracks: MegamixTrackType[];
};

/**
 * A configurable track candidate with selection weights, variants, and availability flags.
 */
export interface TrackCandidate {
  /**
   * The game name that this track belongs to
   */
  game: string;
  /**
   * The type of track
   */
  type: string;
  /**
   * If it's a not safe for work track
   */
  nsfw: boolean;
  /**
   * The variant of the track (some tracks have variants)
   * @deprecated
   */
  variant: string;
  /**
   * How likely this track is to be selected (higher weight = more likely)
   */
  weight: 1 | 2;
  /**
   * If the track needs to be seeded with data before it can be used (default: false)
   */
  needsSeeding?: boolean;
  /**
   * If the track is disabled and should not be used (default: false)
   */
  disabled?: boolean;
  /**
   * TODO: Temp
   */
  verified?: true;
}

/**
 * A party-mode track candidate with a localized seeding prompt.
 */
export interface PartyTrackCandidate extends TrackCandidate {
  /**
   * The prompt card used to seed the party track.
   */
  card: {
    /**
     * Unique identifier of this game entry.
     */
    id: UID;
    /**
     * The text displayed for this card or entry.
     */
    text: DualLanguageValue;
  };
}

/**
 * A game task and its winning condition, variants, and availability flags.
 */
export interface PossibleTask {
  /**
   * The game identifier used to select the track implementation.
   */
  game: string;
  /**
   * The winning condition used to evaluate the track.
   */
  condition: string;
  /**
   * Track variants available for this task.
   */
  variants?: string[];
  /**
   * Whether the track is marked as an upcoming option.
   */
  upcoming?: boolean;
  /**
   * Whether this content is marked as not safe for work.
   */
  nsfw?: boolean;
}

/**
 * An available game track and its optional variant and content restrictions.
 */
export interface AvailableTrack {
  /**
   * The game identifier used to select the track implementation.
   */
  game: string;
  /**
   * The selected variant of this game track.
   */
  variant?: string;
  /**
   * Whether the track is marked as an upcoming option.
   */
  upcoming?: boolean;
  /**
   * Whether this content is marked as not safe for work.
   */
  nsfw?: boolean;
}

/**
 * A selected game track with its variant-specific resource data.
 */
export interface Track {
  /**
   * The game identifier used to select the track implementation.
   */
  game: string;
  /**
   * The selected variant of this game track.
   */
  variant?: string;
  /**
   * Resource or variant-specific data used to render and resolve the entry.
   */
  data: Record<string, any>;
}

/**
 * The winning values, player teams, and scoring classification for a track.
 */
export interface MostScoring {
  /**
   * The winning condition used to evaluate the track.
   */
  condition: string;
  /**
   * Identifiers of players whose selections satisfied the winning condition.
   */
  winningTeam: UID[];
  /**
   * Identifiers of players whose selections did not satisfy the winning condition.
   */
  losingTeam: UID[];
  /**
   * Answer values that satisfied the track's winning condition.
   */
  winningValues: (string | number)[];
  /**
   * Whether the result is a normal win, a tie, or a full draw.
   */
  scoringType: 'NORMAL' | 'TIE' | 'DRAW';
}

/**
 * A track-dependent card payload used by the Megamix engine.
 */
type MegamixCard = any;

/**
 * Card collections grouped by difficulty level.
 */
export type CardsByLevel = Record<string, MegamixCard[]>;

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * The selected tracks and their initialized resource data.
   */
  tracks: Track[];
};

/**
 * A `megamix` drawing card annotated with its artist, submission, and matching success.
 */
export interface MegamixDrawing extends MegamixCard {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID | null;
  /**
   * The serialized drawing submitted by the player, or null before submission.
   */
  drawing: string | null;
  /**
   * The matching success rate calculated for this drawing.
   */
  successRate: number;
}

/**
 * Server-side data retained between phases of a `megamix` session.
 */
export interface MegamixStore extends DefaultStore<MegamixGameOptions> {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: MegamixCard[];
  /**
   * Cards assigned to the current round.
   */
  currentCards: MegamixCard[] | MegamixDrawing[];
  /**
   * Drawings retained from completed rounds.
   */
  pastDrawings: MegamixDrawing[];
}

/**
 * Public game state shared with players during a `megamix` session.
 */
export interface MegamixState extends DefaultState {
  /**
   * Drawings submitted for the current track.
   */
  drawings?: any;
  /**
   * Resolved entries retained for gallery presentation.
   */
  gallery?: any;
  /**
   * The card resources or identifiers associated with this entry.
   */
  cards?: any;
  /**
   * The ranking produced after resolving player scores.
   */
  ranking?: any;
  /**
   * Players or player identifiers selected as winners.
   */
  winners?: any;
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Player data extended with `megamix` submissions and progress.
 */
export interface MegamixPlayer extends Player {
  /**
   * The player's voting data for the current track.
   */
  votes: any;
}

/**
 * Player records indexed by player identifier for `megamix`.
 */
export type MegamixPlayers = Record<UID, MegamixPlayer>;

/**
 * The initial metadata, server-side store, and public state for a `megamix` session.
 */
export interface MegamixInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: MegamixStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: MegamixState;
}

/**
 * Player action payload accepted by the `megamix` engine.
 */
export interface MegamixSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof MEGAMIX_ACTIONS;
}

/**
 * Firestore document data used when reading the `megamix` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & MegamixState;
/**
 * Firestore document data used when reading the `megamix` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & MegamixStore;
/**
 * Firestore document data used when reading `megamix` player records.
 */
export type FirebasePlayersData = FirebaseFirestore.DocumentData & MegamixPlayers;
