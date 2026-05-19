// Types
import type { Achievement } from 'types/game';
import type { SuspectCard, TestimonyQuestionCard } from 'types/tdr';

export type SubmitPromptPayload = {
  questionId?: UID;
  question?: string;
};

export type SubmitAnswerPayload = {
  answer: -2 | -1 | 1 | 2;
};

export type SubmitGuessPayload = {
  characterId: UID;
};

export type PhasePromptState = {
  turnOrder: TurnOrder;
  characters: SuspectCard[];
  questionsHistory: TestimonyQuestionCard[];
  activePlayerId: UID;
};

export type PhaseAnsweringState = {
  turnOrder: TurnOrder;
  characters: SuspectCard[];
  questionsHistory: TestimonyQuestionCard[];
  activePlayerId: UID;
  currentQuestion: TestimonyQuestionCard;
};

export type PhaseGuessingState = {
  turnOrder: TurnOrder;
  characters: SuspectCard[];
  questionsHistory: TestimonyQuestionCard[];
  activePlayerId: UID;
};

export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winner player IDs
   */
  winners: UID[];
  /**
   * List of achievements earned during the game
   */
  achievements: Achievement[];
  characters: SuspectCard[];
  questionsHistory: TestimonyQuestionCard[];
};
