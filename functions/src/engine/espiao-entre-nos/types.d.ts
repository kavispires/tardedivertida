import type { ESPIAO_ENTRE_NOS_ACTIONS } from './constants';

export type TimerAction = 'START' | 'STOP' | 'RESUME' | 'PAUSE';

export type Outcome = {
  type: string;
  votedYes?: string;
  isFinalAssessment: boolean;
};

export type Resolution = {
  type: string;
  isSpyWin: boolean;
  isSpyGuess: boolean;
  guess?: string;
  currentLocation?: Location;
};

export interface EspiaoEntreNosStore extends DefaultStore {
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  [key: string]: any;
}

export interface EspiaoEntreNosState extends DefaultState {
  [key: string]: any;
}

export interface EspiaoEntreNosInitialState extends InitialState {
  store: EspiaoEntreNosStore;
  state: EspiaoEntreNosState;
}

export interface EspiaoEntreNosSubmitAction extends Payload {
  action: keyof typeof ESPIAO_ENTRE_NOS_ACTIONS;
}

export type ResourceData = {
  allLocations: Location[];
};

export type FirebaseStateData = FirebaseFirestore.DocumentData | EspiaoEntreNosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | EspiaoEntreNosStore;
