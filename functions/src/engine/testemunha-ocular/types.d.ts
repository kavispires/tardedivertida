import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

export type SuspectId = string;

export type Suspect = {
  id: SuspectId;
  pt: string;
  en: string;
  gender: string;
};

export interface TestemunhaOcularCard {
  id: string;
  question: string;
}

export interface TestemunhaOcularCardsDatabase {
  [key: string]: TestemunhaOcularCard;
}

export interface TestemunhaOcularEntry {
  id: string;
  question: string;
  unfit?: SuspectId[];
  fit?: SuspectId[];
}

export interface TestemunhaOcularStore extends DefaultStore {
  pastQuestions: TestemunhaOcularEntry[];
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  deck: any;
  questionIndex?: number;
  questionerIndex?: number;
}

export interface TestemunhaOcularState extends DefaultState {
  suspects?: Suspect[];
  perpetrator?: any;
  groupScore?: any;
  questionerId?: any;
  questions?: any;
  question?: any;
  witnessId?: PlayerId;
  testimony?: any;
  eliminatedSuspects?: any;
  previouslyEliminatedSuspects?: any;
  outcome?: any;
  [key: string]: any;
}

export interface TestemunhaOcularInitialState extends InitialState {
  store: TestemunhaOcularStore;
  state: TestemunhaOcularState;
}

export interface TestemunhaOcularSubmitAction extends Payload {
  action: 'SELECT_WITNESS' | 'SELECT_QUESTION' | 'GIVE_TESTIMONY' | 'ELIMINATE_SUSPECT';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | TestemunhaOcularState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TestemunhaOcularStore;
