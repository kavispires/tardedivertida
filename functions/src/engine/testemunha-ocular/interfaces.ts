import { Meta, Payload, PlayerId, Players, Round } from '../../utils/interfaces';

export type SuspectId = string;

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

export interface TestemunhaOcularStore {
  pastQuestions: TestemunhaOcularEntry[];
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  [key: string]: any;
}

export interface TestemunhaOcularState {
  phase: string;
  round: Round;
  [key: string]: any;
}

export interface TestemunhaOcularInitialState {
  meta: Meta;
  players: Players;
  store: TestemunhaOcularStore;
  state: TestemunhaOcularState;
}

// TODO
export interface TestemunhaOcularSubmitAction extends Payload {
  action: 'SELECT_WITNESS' | 'SELECT_QUESTION' | 'GIVE_TESTIMONY' | 'ELIMINATE_SUSPECT';
  [key: string]: any;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | TestemunhaOcularState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TestemunhaOcularStore;
