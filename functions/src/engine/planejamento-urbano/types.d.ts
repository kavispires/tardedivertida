import type { CityLocation } from '../../types/tdr';
import type { GridMapType } from '../../utils/tool-kits/grid-map';
import type { PLANEJAMENTO_URBANO_ACHIEVEMENTS, PLANEJAMENTO_URBANO_ACTIONS } from './constants';

export type PlanejamentoUrbanoOptions = {
  /**
   * If nsfw topics are allowed
   */
  nsfw: boolean;
};

export type ResourceData = {
  allCityLocations: Dictionary<CityLocation>;
};

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

export type PlanejamentoUrbanoAchievement = keyof typeof PLANEJAMENTO_URBANO_ACHIEVEMENTS;

export interface PlanejamentoUrbanoStore extends DefaultStore<PlanejamentoUrbanoOptions> {
  deck: CardId[];
  [key: string]: any;
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
  // cityLocationsDict?: Dictionary<CityLocation>;
  // city?: Site[];
  // gameOrder?: PlayerId[];
  [key: string]: any;
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
