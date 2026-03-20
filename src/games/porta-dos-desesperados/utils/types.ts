// Types
import type { Achievement, GamePlayer } from 'types/game';
// Internal
import type { TRAPS } from './constants';

export type SubmitPagesPayload = {
  pageIds: UID[];
};

export type SubmitDoorPayload = {
  doorId: UID;
  ready?: boolean;
};

export type Trap = keyof typeof TRAPS;

export type TrapEntry = {
  id: string;
  setup: 'backend' | 'frontend' | 'fullstack';
  level: number;
  target: 'clue' | 'guess' | 'all';
  note: string;
  icon:
    | 'dreamCatcher'
    | 'magicCandles'
    | 'magicDivination'
    | 'magicHamsa'
    | 'magicRunes'
    | 'magicTarotCards'
    | 'magicVoodooDoll';
  title: DualLanguageValue;
  description: DualLanguageValue;
};

export type PhaseBookPossessionState = {
  answerDoorId: UID;
  currentCorridor: number;
  difficulty: number;
  doors: UID[];
  gameOrder: GameOrder;
  magic: number;
  pages: string[];
  possessedId: UID;
  selectedPagesIds: string[];
  trap: Trap | 'NONE';
  trapEntry: TrapEntry | null;
  usedMagic: number;
  winCondition: string;
};

export type PhaseDoorChoiceState = {
  answerDoorId: UID;
  currentCorridor: number;
  difficulty: number;
  doors: UID[];
  gameOrder: GameOrder;
  magic: number;
  pages: string[];
  possessedId: UID;
  selectedPagesIds: string[];
  trap: Trap | 'NONE';
  trapEntry: TrapEntry | null;
  usedMagic: number;
  winCondition: string;
};

export type PhaseResolutionState = {
  answerDoorId: UID;
  currentCorridor: number;
  difficulty: number;
  doors: UID[];
  gameOrder: GameOrder;
  magic: number;
  pages: string[];
  possessedId: UID;
  selectedPagesIds: string[];
  trap: Trap | 'NONE';
  trapEntry: TrapEntry | null;
  usedMagic: number;
  winCondition: string;
  outcome: string;
};

export type PhaseGameOverState = {
  achievements: Achievement[];
  winners: GamePlayer[];
  winCondition: string;
  currentCorridor: number;
  magic: number;
  doors: UID[];
};
