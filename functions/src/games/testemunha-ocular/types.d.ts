// Types
import type { CrimeReasonData, SuspectCardData, TestimonyStatementCardData } from '../../types/tdr';
import type { OUTCOME, TESTEMUNHA_OCULAR_ACTIONS } from './constants';

export type TestemunhaOcularOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
  /**
   * Larger pool of suspects
   */
  largePool?: boolean;
  /**
   * Targeted pool of suspects
   */
  targetedPool?: boolean;
  /**
   * Exclusive use of the new batch of suspects
   */
  gbExclusive?: boolean;
} & SuspectCardsOptions;

export type SuspectId = UID;

export type Outcome = (typeof OUTCOME)[keyof typeof OUTCOME];

export type TestemunhaOcularHistoryEntry = {
  id: UID;
  testimony: boolean;
  eliminated: UID[];
  remaining: UID[];
} & TestimonyStatementCardData;

export interface ResourceData {
  allCards: TestimonyStatementCardData[];
  allSuspects: SuspectCardData[];
  allReasons: Dictionary<CrimeReasonData>;
}

export type Status = {
  questions: number;
  totalTime: number;
  suspects: number;
  released: number;
  score: number;
};

export interface TestemunhaOcularStore extends DefaultStore<TestemunhaOcularOptions> {
  gameOrder: UID[];
  turnOrder: UID[];
  questionIndex?: number;
  questionerIndex?: number;
}

export interface TestemunhaOcularState extends DefaultState {
  suspectsDict?: Dictionary<SuspectCardData>;
  suspectsIds?: UID[];
  perpetratorId?: UID;
}

export interface TestemunhaOcularInitialState extends InitialState {
  store: TestemunhaOcularStore;
  state: TestemunhaOcularState;
}

export interface TestemunhaOcularSubmitAction extends Payload {
  action: keyof typeof TESTEMUNHA_OCULAR_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & TestemunhaOcularState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & TestemunhaOcularStore;
