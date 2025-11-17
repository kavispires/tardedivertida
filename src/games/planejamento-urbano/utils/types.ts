// Types
import type { Achievement } from 'types/achievements';
import type { GameRanking } from 'types/game';
import type { GamePlayer } from 'types/player';
import type { CityLocation } from 'types/tdr';
// Components
import type { GridMapType } from 'components/toolKits/GridMap';

export type SubmitPlanningPayload = {
  planning: Dictionary<string>;
};

export type SubmitPlacingPayload = {
  evaluations: Dictionary<string>;
};

export type Construction = {
  locationId: string;
  coneId?: string;
};

export type Cone = {
  coneId: string;
  locationId?: string;
};

export type City = GridMapType<Construction | Cone | null>;

export type CityLocationsDict = Dictionary<CityLocation>;

export type GalleryEntry = {
  locationId: string;
  architectId: string;
  coneId: string;
  correctCellId: string;
  correctPlayersIds: PlayerId[];
  playersSay: Dictionary<PlayerId[]>;
  playersPoints: Record<PlayerId, number>;
  architectPoints: number;
  finalCellId: string;
};

export type PhasePlanningState = {
  architectId: PlayerId;
  availableProjectsIds: CardId[];
  city: City;
  cityLocationsDict: CityLocationsDict;
  coneCellIds: Dictionary<string>;
  gameOrder: GameOrder;
};

export type PhasePlacingState = {
  architectId: PlayerId;
  availableProjectsIds: CardId[];
  city: City;
  cityLocationsDict: CityLocationsDict;
  coneCellIds: Dictionary<string>;
  planning: Record<string, string>;
  gameOrder: GameOrder;
};

export type PhaseResolutionState = {
  architectId: PlayerId;
  availableProjectsIds: CardId[];
  city: City;
  cityLocationsDict: CityLocationsDict;
  coneCellIds: Dictionary<string>;
  planning: Record<string, string>;
  gameOrder: GameOrder;
  gallery: GalleryEntry[];
  ranking: GameRanking;
};

export type PhaseGameOverState = {
  achievements: Achievement[];
  city: City;
  cityLocationsDict: CityLocationsDict;
  winners: GamePlayer[];
};
