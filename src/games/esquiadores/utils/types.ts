// Types
import type { Achievement, GameRanking, GamePlayer } from 'types/game';
import type { DilemmaCard } from 'types/tdr';

export type SubmitChoicesPayload = {
  choices: string[];
};

export type SubmitBetsPayload = {
  bets: Dictionary<number>;
  betType: string;
};

export type MountainDilemma = {
  id: number;
  spriteId: string;
  dilemma: DilemmaCard;
  direction: 'left' | 'right' | null;
  selected: boolean;
  players?: string[];
};

export type Lodge = {
  id: number;
  selected: boolean;
  playersIds: UID[];
};

export type GalleryMountainEntry = {
  id: string;
  mountain: MountainDilemma[];
  skierId: UID;
};

export type PhaseBetsState = {
  turnOrder: GameOrder;
  activeSkierId: UID;
  mountain: MountainDilemma[];
  mountainSection: string;
  lodges: Lodge[];
  catchUp: UID[];
  animateFrom: number;
  animateTo: 'left' | 'right' | null;
};

export type PhaseBetsPlayers = {
  initial?: Dictionary<boolean>;
  chips: number;
};

export type PhaseStartingResultsPhase = PhaseBetsState;

export type PhaseBoostState = PhaseBetsState;

export type PhasePreliminaryResultsState = PhaseBetsState;

export type PhaseLastChancePhaseState = PhaseBetsState;

export type PhaseFinalResultsState = PhaseBetsState & {
  ranking: GameRanking;
};

export type PhaseGameOverState = {
  winners: GamePlayer[];
  gallery: GalleryMountainEntry[];
  achievements: Achievement[];
};
