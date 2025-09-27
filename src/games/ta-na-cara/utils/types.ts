// Types
import type { GameRanking } from 'types/game';
import type { SuspectCard, TestimonyQuestionCard } from 'types/tdr';

export type SubmitIdentityPayload = {
  identityId: CardId;
};

export type SubmitPromptPayload = {
  questionId: CardId;
  customQuestion: string;
  customAnswer: string;
};

export type SubmitAnswerPayload = {
  questionId: CardId;
  answer: boolean;
};

export type SubmitGuessesPayload = {
  guesses: Dictionary<CardId>;
};

export type PhaseIdentitySelectionState = {
  grid: CardId[];
  identitiesDict: Dictionary<SuspectCard>;
  newRound: boolean;
};

export type PhasePromptingState = {
  turnOrder: GameOrder;
  grid: CardId[];
  identitiesDict: Dictionary<SuspectCard>;
  newRound?: boolean;
  activePlayerId: string;
  turnQuestions: TestimonyQuestionCard[];
  questionCount: number;
  vibesMode: boolean;
  questionsDict: Dictionary<TestimonyQuestionCard>;
};

export type PhaseAnsweringState = {
  turnOrder: GameOrder;
  grid: CardId[];
  identitiesDict: Dictionary<SuspectCard>;
  activePlayerId: string;
  questionCount: number;
  vibesMode: boolean;
  currentQuestionId: CardId;
  questionsDict: Dictionary<TestimonyQuestionCard>;
};

export type PhaseGuessingState = {
  turnOrder: GameOrder;
  grid: CardId[];
  identitiesDict: Dictionary<SuspectCard>;
  activePlayerId: string;
  questionCount: number;
  questionsDict: Dictionary<TestimonyQuestionCard>;
};

export type PhaseRevealState = {
  turnOrder: GameOrder;
  grid: CardId[];
  identitiesDict: Dictionary<SuspectCard>;
  questionsDict: Dictionary<TestimonyQuestionCard>;
  questionCount: number;
  ranking: GameRanking;
  gallery: GalleryEntry[];
};

export type Votes = Record<
  string,
  {
    identityId: string;
    eliminated: BooleanDictionary;
  }
>;

export type GalleryEntry = {
  playerId: PlayerId;
  identityId: CardId;
  answers: BooleanDictionary;
  correctPlayersIds: PlayerId[];
  wrongVotes: {
    identityId: CardId;
    playerIds: PlayerId[];
  }[];
};
