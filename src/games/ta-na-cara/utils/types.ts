// Types
import type { SuspectCard } from 'types/tdr';

export type SubmitPromptPayload = {
  questionId: UID;
};

export type SubmitTargetPayload = {
  targetId: UID;
};

export type SubmitAnswerPayload = {
  targetId: UID;
};

export type SubmitGuessPayload = {
  targetId: UID;
};

export type CharacterFace = {
  revealed: boolean;
  playerId?: UID;
} & SuspectCard;

export type Question = {
  id: UID;
  question: string;
  used: boolean;
  yes: UID[];
};

export type CharactersDictionary = Dictionary<CharacterFace>;
export type QuestionsDictionary = Dictionary<Question>;
export type GuessHistory = Record<UID, UID[]>;
