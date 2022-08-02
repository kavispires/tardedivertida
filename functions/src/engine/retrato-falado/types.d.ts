export interface MonsterSketch extends MonsterCard {
  playerId: PlayerId | null;
  sketch: string | null;
}

export interface AllMonsters {
  [key: string]: MonsterCard;
}

export interface ResourceData {
  allMonsters: AllMonsters;
}

export interface RetratoFaladoStore extends DefaultStore {
  deck: MonsterCard[];
  pastSketches: MonsterSketch[];
}

export interface RetratoFaladoState extends DefaultState {
  [key: string]: any;
}
export interface RetratoFaladoInitialState extends InitialState {
  store: RetratoFaladoStore;
  state: RetratoFaladoState;
}

export interface RetratoFaladoSubmitAction extends Payload {
  action: 'SUBMIT_ORIENTATION' | 'SUBMIT_SKETCH' | 'SUBMIT_VOTE';
}

export type FirebaseStoreData = FirebaseFirestore.DocumentData | RetratoFaladoStore;
export type FirebaseStateData = FirebaseFirestore.DocumentData | RetratoFaladoState;
