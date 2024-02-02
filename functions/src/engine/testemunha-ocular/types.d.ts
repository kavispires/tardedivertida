import { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
import { TESTEMUNHA_OCULAR_ACTIONS } from './constants';

export type TestemunhaOcularOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
} & SuspectCardsOptions;

export type SuspectId = CardId;

export interface TestemunhaOcularEntry {
  id: string;
  question: string;
  unfit?: SuspectId[];
}

export interface ResourceData {
  allCards: TestimonyQuestionCard[];
  allSuspects: SuspectCard[];
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
  suspects?: SuspectCard[];
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
  action: keyof typeof TESTEMUNHA_OCULAR_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | TestemunhaOcularState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TestemunhaOcularStore;
