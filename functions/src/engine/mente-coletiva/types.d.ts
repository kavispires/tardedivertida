import type {
  DefaultState,
  DefaultStore,
  InitialState,
  Payload,
  PlayerAvatarId,
  PlayerId,
  PlayerName,
} from '../../utils/types';
import type { GroupQuestionCard } from '../../utils/tdr';

type MenteColetivaOptions = {
  shortPasture: boolean;
};

interface ResourceData {
  allQuestions: {
    [key: string]: GroupQuestionCard;
  };
}

interface AllQuestions {
  [key: string]: GroupQuestionCard;
}

interface PastQuestions {
  id: string;
  answers: string[];
}

type Deck = GroupQuestionCard[];

interface MenteColetivaStore extends DefaultStore {
  deck: Deck;
  gameOrder: PlayerId[];
  pastQuestions: PastQuestions[];
  currentQuestion?: GroupQuestionCard;
  [key: string]: any;
}

interface MenteColetivaState extends DefaultState {
  gameOrder?: PlayerId[];
  roundType?: string;
  activePlayerId?: PlayerId;
  currentQuestions?: any;
  currentQuestion?: any;
  answersList?: any;
  allAnswers?: any;
  ranking?: any;
  pastureChangeStr?: string;
  usedSave?: any;
  announceSave?: any;
  winners?: any;
  losers?: any;
  [key: string]: any;
}

interface MenteColetivaInitialState extends InitialState {
  store: MenteColetivaStore;
  state: MenteColetivaState;
}

interface AnswerEntry {
  id: string;
  playerId: PlayerId;
  answer: string;
  parsedAnswer: string;
  isLocked: boolean;
}

interface MenteColetivaSubmitAction extends Payload {
  action: 'SUBMIT_QUESTION' | 'SUBMIT_ANSWERS' | 'NEXT_ANSWERS' | 'ADD_ANSWER';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | MenteColetivaState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | MenteColetivaStore;

type SheepAnimation = {
  animateRight?: boolean;
  animateLeft?: boolean;
};

interface PastureChangeEntry extends SheepAnimation {
  id: PlayerId;
  name: PlayerName;
  avatarId: PlayerAvatarId;
  level: number;
  [key: string]: any;
}
