// Types
import type { Achievement } from 'types/game';
import type { SuspectCardData, TestimonyQuestionCardData } from 'types/tdr';

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
  characters: SuspectCardData[];
  questionsHistory: TestimonyQuestionCardData[];
  activePlayerId: UID;
};

export type PhaseAnsweringState = {
  turnOrder: TurnOrder;
  characters: SuspectCardData[];
  questionsHistory: TestimonyQuestionCardData[];
  activePlayerId: UID;
  currentQuestion: TestimonyQuestionCardData;
};

export type PhaseGuessingState = {
  turnOrder: TurnOrder;
  characters: SuspectCardData[];
  questionsHistory: TestimonyQuestionCardData[];
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
  characters: SuspectCardData[];
  questionsHistory: TestimonyQuestionCardData[];
};
