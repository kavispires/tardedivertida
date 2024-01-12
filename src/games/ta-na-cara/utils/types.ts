import { SuspectCard } from 'types/tdi';

export type SubmitPromptPayload = {
  questionId: CardId;
};

export type SubmitTargetPayload = {
  targetId: PlayerId;
};

export type SubmitAnswerPayload = {
  targetId: PlayerId;
};

export type SubmitGuessPayload = {
  targetId: PlayerId;
};

export type CharacterFace = {
  revealed: boolean;
  playerId?: PlayerId;
} & SuspectCard;

export type Question = {
  id: CardId;
  question: string;
  used: boolean;
  yes: PlayerId[];
};

export type CharactersDictionary = Dictionary<CharacterFace>;
export type QuestionsDictionary = Dictionary<Question>;
export type GuessHistory = Record<PlayerId, CardId[]>;
