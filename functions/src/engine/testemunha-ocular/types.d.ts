import type { SuspectCard } from '../../utils/tdi';
import type { TestimonyQuestionCard } from '../../utils/tdr';
import type { CardId, DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type SuspectId = CardId;

interface TestemunhaOcularEntry {
  id: string;
  question: string;
  unfit?: SuspectId[];
  fit?: SuspectId[];
}

interface ResourceData {
  allCards: {
    [key: string]: TestimonyQuestionCard;
  };
  allSuspects: SuspectCard[];
}

interface TestemunhaOcularStore extends DefaultStore {
  pastQuestions: TestemunhaOcularEntry[];
  gameOrder: PlayerId[];
  turnOrder: PlayerId[];
  deck: any;
  questionIndex?: number;
  questionerIndex?: number;
}

interface TestemunhaOcularState extends DefaultState {
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

interface TestemunhaOcularInitialState extends InitialState {
  store: TestemunhaOcularStore;
  state: TestemunhaOcularState;
}

interface TestemunhaOcularSubmitAction extends Payload {
  action: 'SELECT_WITNESS' | 'SELECT_QUESTION' | 'GIVE_TESTIMONY' | 'ELIMINATE_SUSPECT';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | TestemunhaOcularState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | TestemunhaOcularStore;
