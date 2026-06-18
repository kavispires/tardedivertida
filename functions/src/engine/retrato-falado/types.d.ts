import type { MonsterImage } from '../../types/tdr';
import type { RETRATO_FALADO_ACTIONS } from './constants';

export interface MonsterSketch extends MonsterImage {
  playerId: UID | null;
  sketch: string | null;
}

export interface AllMonsters {
  [key: string]: MonsterImage;
}

export interface ResourceData {
  allMonsters: AllMonsters;
}

export interface RetratoFaladoStore extends DefaultStore {
  deck: MonsterImage[];
  pastSketches: MonsterSketch[];
}

export interface RetratoFaladoState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}
export interface RetratoFaladoInitialState extends InitialState {
  store: RetratoFaladoStore;
  state: RetratoFaladoState;
}

export interface RetratoFaladoSubmitAction extends Payload {
  action: keyof typeof RETRATO_FALADO_ACTIONS;
}

export type FirebaseStoreData = FirebaseFirestore.DocumentData | RetratoFaladoStore;
export type FirebaseStateData = FirebaseFirestore.DocumentData | RetratoFaladoState;
