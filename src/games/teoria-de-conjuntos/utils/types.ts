// Types
import { DiagramTopic } from 'types/tdr';
// Internal
import { OUTCOME } from './constants';

export type SubmitJudgePayload = {
  judgeId: PlayerId;
};

export type SubmitItemPlacementPayload = {
  itemId: CardId;
  position: string;
};

export type SubmitEvaluationPayload = {
  evaluation: string;
};

export type Solutions = {
  attribute: DiagramTopic;
  word: DiagramTopic;
  context?: DiagramTopic;
};

export type DiagramExamples = {
  attribute: DiagramTopic[];
  word: DiagramTopic[];
  context?: DiagramTopic[];
};

export type DiagramArea = {
  key: string; // A | W | C | O and any combination
  itemsIds: CardId[];
};

export type Outcome = keyof typeof OUTCOME;

export type Guess = {
  itemId: CardId;
  playerId: PlayerId;
  suggestedArea: string;
  correctArea: string | null;
  outcome: Outcome | string;
};
