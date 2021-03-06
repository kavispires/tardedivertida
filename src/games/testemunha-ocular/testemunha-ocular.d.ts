type SelectWitnessPayload = {
  witnessId: PlayerId;
};

type SelectQuestionPayload = {
  questionId: string;
};

type SubmitTestimonyPayload = {
  testimony: boolean;
};

type EliminatePayload = {
  suspectId: string;
  pass: boolean;
};

type Suspect = {
  id: string;
  name: DualLanguageValue;
  gender: string;
};

type TQuestion = {
  id: string;
  question: string;
};

type THistoryEntry = {
  id: string;
  question: string;
  answer: boolean;
};
