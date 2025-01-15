import type { GameRanking } from 'types/game';
import type { DilemmaCard } from 'types/tdr';

export type SubmitChoicesPayload = {
  choices: string[];
};

export type SubmitBetsPayload = {
  bets: NumberDictionary;
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
  playersIds: PlayerId[];
};

export type PhaseBetsState = {
  turnOrder: GameOrder;
  activeSkierId: PlayerId;
  mountain: MountainDilemma[];
  mountainSection: string;
  lodges: Lodge[];
  catchUp: PlayerId[];
  animateFrom: number;
  animateTo: 'left' | 'right' | null;
};

export type PhaseBetsPlayers = {
  initial?: BooleanDictionary;
  chips: number;
};

export type PhaseStartingResultsPhase = PhaseBetsState;

export type PhaseBoostState = PhaseBetsState;

export type PhasePreliminaryResultsState = PhaseBetsState;

export type PhaseLastChancePhaseState = PhaseBetsState;

export type PhaseFinalResultsState = PhaseBetsState & {
  ranking: GameRanking;
};
