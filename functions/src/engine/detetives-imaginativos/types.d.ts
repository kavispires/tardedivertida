import type {
  DefaultState,
  DefaultStore,
  ImageCardId,
  InitialState,
  Payload,
  PlayerId,
} from '../../utils/types';

interface DetetivesImaginativosStore extends DefaultStore {
  usedCards: ImageCardId[];
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  [key: string]: any;
}

interface DetetivesImaginativosState extends DefaultState {
  leaderId?: PlayerId;
  impostorId?: PlayerId;
  phaseOrder?: PlayerId[];
  phaseIndex?: number;
  currentPlayerId?: PlayerId;
  table?: any;
  ranking?: any;
  impostorVotes?: any;
  winners?: any;
  [key: string]: any;
}

interface DetetivesImaginativosInitialState extends InitialState {
  store: DetetivesImaginativosStore;
  state: DetetivesImaginativosState;
}

interface DetetivesImaginativosSubmitAction extends Payload {
  action: 'SUBMIT_CLUE' | 'PLAY_CARD' | 'DEFEND' | 'SUBMIT_VOTE';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | DetetivesImaginativosState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | DetetivesImaginativosStore;
