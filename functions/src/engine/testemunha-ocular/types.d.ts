import type { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
import type { TESTEMUNHA_OCULAR_ACHIEVEMENTS, TESTEMUNHA_OCULAR_ACTIONS } from './constants';

export type TestemunhaOcularOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
  /**
   * Harder game (more suspects)
   */
  harderGame?: boolean;
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

export type Status = {
  questions: number;
  totalTime: number;
  suspects: number;
  released: number;
  score: number;
};

export interface TestemunhaOcularStore extends DefaultStore<TestemunhaOcularOptions> {
  pastQuestions: TestemunhaOcularEntry[];
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  questionIndex?: number;
  questionerIndex?: number;
}

export interface TestemunhaOcularState extends DefaultState {
  suspects?: SuspectCard[];
}

export interface TestemunhaOcularInitialState extends InitialState {
  store: TestemunhaOcularStore;
  state: TestemunhaOcularState;
}

export interface TestemunhaOcularSubmitAction extends Payload {
  action: keyof typeof TESTEMUNHA_OCULAR_ACTIONS;
}

export type TestemunhaOcularAchievement = keyof typeof TESTEMUNHA_OCULAR_ACHIEVEMENTS;

export type FirebaseStateData = FirebaseFirestore.DocumentData & TestemunhaOcularState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & TestemunhaOcularStore;
