// Types
import type { GridMapType } from '../../tool-kits/grid-map';
import type { CityLocationData } from '../../types/tdr';
import type { PLANEJAMENTO_URBANO_ACTIONS } from './constants';

export type PlanejamentoUrbanoOptions = {
  /**
   * If nsfw topics are allowed
   */
  nsfw: boolean;
};

export type ResourceData = {
  allCityLocations: Dictionary<CityLocationData>;
};

export type GalleryEntry = {
  locationId: string;
  architectId: string;
  coneId: string;
  correctCellId: string;
  correctPlayersIds: UID[];
  playersSay: Dictionary<UID[]>;
  playersPoints: Record<UID, number>;
  architectPoints: number;
  finalCellId: string;
};

export interface PlanejamentoUrbanoStore extends DefaultStore<PlanejamentoUrbanoOptions> {
  deck: UID[];
  [key: string]: AnyOrUnknownPlaceholder;
}

export type Construction = {
  locationId: string;
  coneId?: string;
};

export type Cone = {
  coneId: string;
  locationId?: string;
};

export type City = GridMapType<Construction | Cone | null>;

export interface PlanejamentoUrbanoState extends DefaultState {
  // placements?: number;
  // cityLocationsDict?: Dictionary<CityLocationData>;
  // city?: Site[];
  // gameOrder?: UID[];
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface PlanejamentoUrbanoInitialState extends InitialState {
  store: PlanejamentoUrbanoStore;
  state: PlanejamentoUrbanoState;
}

export interface PlanejamentoUrbanoSubmitAction extends Payload {
  action: keyof typeof PLANEJAMENTO_URBANO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & PlanejamentoUrbanoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & PlanejamentoUrbanoStore;
