import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

interface Question {
  id: string;
  number: number;
  prefix: string;
  suffix: string;
}

interface AllQuestions {
  [key: string]: Question;
}

interface PastQuestions {
  id: string;
  answers: string[];
}

type Deck = Question[];

interface MenteColetivaStore extends DefaultStore {
  deck: Deck;
  gameOrder: PlayerId[];
  pastQuestions: PastQuestions[];
  currentQuestion?: Question;
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
