import type { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type TimerAction = 'START' | 'STOP' | 'RESUME' | 'PAUSE';

type Outcome = {
  type: string;
  votedYes?: string;
  isFinalAssessment: boolean;
};

type Resolution = {
  type: string;
  isSpyWin: boolean;
  isSpyGuess: boolean;
  guess?: string;
  currentLocation?: Location;
};

interface EspiaoEntreNosStore extends DefaultStore {
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  [key: string]: any;
}

interface EspiaoEntreNosState extends DefaultState {
  [key: string]: any;
}

interface EspiaoEntreNosInitialState extends InitialState {
  store: EspiaoEntreNosStore;
  state: EspiaoEntreNosState;
}

interface EspiaoEntreNosSubmitAction extends Payload {
  action: 'LAST_QUESTIONER' | 'MAKE_ACCUSATION' | 'SUBMIT_VOTE' | 'GUESS_LOCATION';
}

type ResourceData = {
  allLocations: Location[];
};

type FirebaseStateData = FirebaseFirestore.DocumentData | EspiaoEntreNosState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | EspiaoEntreNosStore;
