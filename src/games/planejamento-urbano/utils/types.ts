// Types
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
  guess: string;
  guessAdjacentLocationsIds: string[];
  cone: string;
  coneAdjacentLocationsIds: string[];
  correctCellId: string;
  result: 'CORRECT' | 'INCORRECT';
  finalCellId: string;
  score: number;
};
