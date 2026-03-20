// Types
import type { Achievement, GamePlayer } from 'types/game';
import type { CrimeReason, SuspectCard, TestimonyQuestionCard } from 'types/tdr';
// Internal
import type { OUTCOME } from './constants';

export type SelectWitnessPayload = {
  witnessId: UID;
};

export type SelectQuestionPayload = {
  questionId: UID;
};

export type SubmitTestimonyPayload = {
  testimony: boolean;
};

export type EliminatePayload = {
  suspectId: UID;
  pass: boolean;
};

export type FinalEliminationPayload = {
  suspectId: UID;
};

export type Question = {
  id: UID;
  question: string;
  level: number;
};

export type Outcome = (typeof OUTCOME)[keyof typeof OUTCOME];

export type THistoryEntry = {
  id: UID;
  question: string;
  answer: string;
  statement: boolean;
  eliminated: UID[];
  remaining: UID[];
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
  perpetratorId: UID;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: UID[];
};

export type PhaseQuestionSelectionState = {
  history: THistoryEntry[];
  perpetratorId: UID;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: UID[];
  witnessId: UID;
  questionerId: UID;
  previouslyEliminatedSuspects: UID[];
  questions: Question[];
  outcome: Outcome;
};

export type PhaseQuestioningState = {
  history: THistoryEntry[];
  perpetratorId: UID;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: UID[];
  witnessId: UID;
  questionerId: UID;
  previouslyEliminatedSuspects: UID[];
  question: TestimonyQuestionCard;
  outcome: Outcome;
};

export type PhaseTrialState = {
  history: THistoryEntry[];
  perpetratorId: UID;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: UID[];
  witnessId: UID;
  questionerId: UID;
  previouslyEliminatedSuspects: UID[];
  question: TestimonyQuestionCard;
  eliminatedSuspects: UID[];
  testimony: boolean;
  outcome: Outcome;
};

export type PhaseGameOverState = {
  outcome: Outcome;
  winners: GamePlayer[];
  achievements: Achievement[];
  history: THistoryEntry[];
  perpetratorId: UID;
  status: Status;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: UID[];
  witnessId: UID;
  previouslyEliminatedSuspects: UID[];
  reason: CrimeReason;
};
