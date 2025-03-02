// Types
import type { Achievement } from 'types/achievements';
import type { GameRanking } from 'types/game';
import type { GamePlayer } from 'types/player';
import type { CrimesHediondosCard, CrimeSceneTile } from 'types/tdr';

export type SubmitCrimePayload = {
  weaponId?: string;
  evidenceId?: string;
  causeOfDeathIndex?: number;
  reasonForEvidenceIndex?: number;
  locationIndex?: number;
};

export type SceneTilePayload = {
  tileId: string;
  value: number;
};

export type SubmitMarkPayload = {
  sceneIndex: number;
};

export type SubmitGuessesPayload = {
  guesses: PlainObject;
};

export type GroupedItems = Dictionary<string[]>;

export type ItemsDict = Dictionary<CrimesHediondosCard>;

export type ScenesDict = Dictionary<CrimeSceneTile>;

export type Crime = {
  playerId: PlayerId;
  weaponId: string;
  evidenceId: string;
  scenes: NumberDictionary;
};

export type Guess = {
  weaponId: string;
  evidenceId: string;
  isComplete?: boolean;
};

export type GuessHistoryEntry = {
  weaponId: string;
  evidenceId: string;
  status: string;
  groupIndex: number;
};

export type History = {
  [key: string]: GuessHistoryEntry[];
};

export type Results = {
  [key: string]: StringDictionary;
};

export type PhaseCrimeSelectionState = {
  causeOfDeathTile: CrimeSceneTile;
  reasonForEvidenceTile: CrimeSceneTile;
  locationTile: CrimeSceneTile;
  items: Dictionary<CrimesHediondosCard>;
  groupedItems: GroupedItems;
};

export type BasicState = {
  crimes: Crime[];
  groupedItems: GroupedItems;
  items: Dictionary<CrimesHediondosCard>;
  scenes: Dictionary<CrimeSceneTile>;
  scenesOrder: string[];
};

export type PhaseGuessingState = BasicState;

export type PhaseRevealState = BasicState & {
  results: Results;
  ranking: GameRanking;
  winners: PlayerId[];
};

export type PhaseSceneMarkingState = BasicState & {
  currentScene: CrimeSceneTile;
};

export type PhaseGameOverState = BasicState & {
  winners: GamePlayer[];
  achievements: Achievement[];
};
