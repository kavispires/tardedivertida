type SubmitPromptPayload = {
  questionId: CardId;
};

type SubmitTargetPayload = {
  targetId: PlayerId;
};

type SubmitAnswerPayload = {
  targetId: PlayerId;
};

type CharacterFace = {
  revealed: boolean;
  playerId?: PlayerId;
} & SuspectCard;

type TQuestion = {
  id: CardId;
  question: string;
  used: boolean;
  yes: PlayerId[];
};

type CharactersDictionary = Record<CardId, CharacterFace>;
type QuestionsDictionary = Record<CardId, TQuestion>;
type GuessHistory = Record<PlayerId, CardId[]>;
