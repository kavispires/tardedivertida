// Types
import type { Achievement } from 'types/achievements';
import type { GamePlayer } from 'types/player';
import type { SuspectCard, TestimonyQuestionCard } from 'types/tdr';
// Internal
import type { OUTCOME } from './constants';

export type SelectWitnessPayload = {
  witnessId: PlayerId;
};

export type SelectQuestionPayload = {
  questionId: CardId;
};

export type SubmitTestimonyPayload = {
  testimony: boolean;
};

export type EliminatePayload = {
  suspectId: CardId;
  pass: boolean;
};

export type FinalEliminationPayload = {
  suspectId: CardId;
};

export type Question = {
  id: CardId;
  question: string;
  level: number;
};

export type Outcome = (typeof OUTCOME)[keyof typeof OUTCOME];

export type THistoryEntry = {
  id: CardId;
  question: string;
  answer: string;
  statement: boolean;
  eliminated: CardId[];
  remaining: CardId[];
};

export type Status = {
  questions: number;
  totalTime: number;
  suspects: number;
  released: number;
  score: number;
};

export type PhaseWitnessSelectionState = {
  history: THistoryEntry[];
  perpetratorId: CardId;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
};

export type PhaseQuestionSelectionState = {
  history: THistoryEntry[];
  perpetratorId: CardId;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
  witnessId: PlayerId;
  questionerId: PlayerId;
  previouslyEliminatedSuspects: CardId[];
  questions: Question[];
  outcome: Outcome;
};

export type PhaseQuestioningState = {
  history: THistoryEntry[];
  perpetratorId: CardId;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
  witnessId: PlayerId;
  questionerId: PlayerId;
  previouslyEliminatedSuspects: CardId[];
  question: TestimonyQuestionCard;
  outcome: Outcome;
};

export type PhaseTrialState = {
  history: THistoryEntry[];
  perpetratorId: CardId;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
  witnessId: PlayerId;
  questionerId: PlayerId;
  previouslyEliminatedSuspects: CardId[];
  question: TestimonyQuestionCard;
  eliminatedSuspects: CardId[];
  testimony: boolean;
  outcome: Outcome;
};

export type PhaseGameOverState = {
  outcome: Outcome;
  winners: GamePlayer[];
  achievements: Achievement[];
  history: THistoryEntry[];
  perpetratorId: CardId;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
  witnessId: PlayerId;
  previouslyEliminatedSuspects: CardId[];
};
