// Types
import type { MEGAMIX_ACTIONS } from './constants';

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

export interface PartyTrackCandidate extends TrackCandidate {
  card: {
    id: UID;
    text: DualLanguageValue;
  };
}

export interface PossibleTask {
  game: string;
  condition: string;
  variants?: string[];
  upcoming?: boolean;
  nsfw?: boolean;
}

export interface AvailableTrack {
  game: string;
  variant?: string;
  upcoming?: boolean;
  nsfw?: boolean;
}

export interface Track {
  game: string;
  variant?: string;
  data: Record<string, any>;
}

export interface MostScoring {
  condition: string;
  winningTeam: UID[];
  losingTeam: UID[];
  winningValues: (string | number)[];
  scoringType: 'NORMAL' | 'TIE' | 'DRAW';
}

type MegamixCard = any;

export type CardsByLevel = Record<string, MegamixCard[]>;

export type ResourceData = {
  tracks: Track[];
};

export interface MegamixDrawing extends MegamixCard {
  playerId: UID | null;
  drawing: string | null;
  successRate: number;
}

export interface MegamixStore extends DefaultStore<MegamixGameOptions> {
  deck: MegamixCard[];
  currentCards: MegamixCard[] | MegamixDrawing[];
  pastDrawings: MegamixDrawing[];
}

export interface MegamixState extends DefaultState {
  drawings?: any;
  gallery?: any;
  cards?: any;
  ranking?: any;
  winners?: any;
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface MegamixPlayer extends Player {
  votes: any;
}

export type MegamixPlayers = Record<UID, MegamixPlayer>;

export interface MegamixInitialState extends InitialState {
  store: MegamixStore;
  state: MegamixState;
}

export interface MegamixSubmitAction extends Payload {
  action: keyof typeof MEGAMIX_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & MegamixState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & MegamixStore;
export type FirebasePlayersData = FirebaseFirestore.DocumentData & MegamixPlayers;
