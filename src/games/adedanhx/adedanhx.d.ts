type SubmitGridAnswersPayload = {
  answers: StringDictionary;
  stop?: PlayerId;
};

type SubmitRejectedAnswers = {
  evaluations: string[];
};

type LetterEntry = {
  type: 'starts-with' | 'ends-with' | 'includes';
  letters: string;
  level: number;
};

type AdedanhxGrid = {
  xHeaders: TopicCard[];
  yHeaders: LetterEntry[];
};

type Answer = {
  id: string; // x-y
  answer: string;
  timestamp: number;
};

type AnswerEvaluationEntry = {
  id: string;
  playerId: string;
  answer: string;
  timestamp: number;
  points: number;
  autoRejected: boolean;
  accepted: false;
};

type GroupAnswerEvaluationEntry = {
  id: string;
  topic: TopicCard;
  letter: LetterEntry;
  answers: AnswerEvaluationEntry[];
  points: number;
};

type AnswerGridEntry = {
  id: string;
  main: {
    playerId: PlayerId;
    score: number;
    answer: string;
  };
  playerIds: PlayerId[];
  score: number;
};

type AdedanhxGalleryEntry = {
  id: string;
  topic: TopicCard;
  letter: LetterEntry;
  topAnswer?: AnswerGridEntry['main'];
};
