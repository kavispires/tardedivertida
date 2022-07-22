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
  action: 'LAST_QUESTIONER' | 'MAKE_ACCUSATION' | 'SUBMIT_VOTE' | 'GUESS_LOCATION';
}

export type ResourceData = {
  allLocations: Location[];
};

export type FirebaseStateData = FirebaseFirestore.DocumentData | EspiaoEntreNosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | EspiaoEntreNosStore;
