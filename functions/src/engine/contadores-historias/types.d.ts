import { DefaultState, DefaultStore, ImageCardId, InitialState, Payload, PlayerId } from '../../utils/types';

type ContadoresHistoriasOptions = {
  fixedRounds: boolean;
};

interface ContadoresHistoriasStore extends DefaultStore {
  gameOrder: PlayerId[];
  tableDeck: ImageCardId[];
  deckIndex: number;
  solutionCardId?: string;
  story?: string;
  [key: string]: any;
}

interface ContadoresHistoriasState extends DefaultState {
  storytellerId?: PlayerId;
  nextStorytellerId?: PlayerId;
  story?: string;
  table?: any;
  outcome?: any;
  ranking?: any;
  winners?: any;
  [key: string]: any;
}

interface ContadoresHistoriasInitialState extends InitialState {
  store: ContadoresHistoriasStore;
  state: ContadoresHistoriasState;
}

interface TableEntry {
  cardId: ImageCardId;
  playerId: PlayerId;
  votes: PlayerId[];
  isSolution: boolean;
}

type Table = TableEntry[];

interface ContadoresHistoriasSubmitAction extends Payload {
  action: 'SUBMIT_STORY' | 'PLAY_CARD' | 'SUBMIT_VOTE';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | ContadoresHistoriasState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | ContadoresHistoriasStore;
