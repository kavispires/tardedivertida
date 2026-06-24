// Types
import type { MonsterImageData } from '../../types/tdr';
import type { RETRATO_FALADO_ACTIONS } from './constants';

export interface MonsterSketch extends MonsterImageData {
  playerId: UID | null;
  sketch: string | null;
}

export interface AllMonsters {
  [key: string]: MonsterImageData;
}

export interface ResourceData {
  allMonsters: AllMonsters;
}

export interface RetratoFaladoStore extends DefaultStore {
  deck: MonsterImageData[];
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
