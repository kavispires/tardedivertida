// Types
import type { Achievement } from 'types/achievements';
import type { GamePlayer } from 'types/player';
// Internal
import type { TRAPS } from './constants';

export type SubmitPagesPayload = {
  pageIds: CardId[];
};

export type SubmitDoorPayload = {
  doorId: CardId;
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
  answerDoorId: CardId;
  currentCorridor: number;
  difficulty: number;
  doors: CardId[];
  gameOrder: GameOrder;
  magic: number;
  pages: string[];
  possessedId: PlayerId;
  selectedPagesIds: string[];
  trap: Trap | 'NONE';
  trapEntry: TrapEntry | null;
  usedMagic: number;
  winCondition: string;
};

export type PhaseDoorChoiceState = {
  answerDoorId: CardId;
  currentCorridor: number;
  difficulty: number;
  doors: CardId[];
  gameOrder: GameOrder;
  magic: number;
  pages: string[];
  possessedId: PlayerId;
  selectedPagesIds: string[];
  trap: Trap | 'NONE';
  trapEntry: TrapEntry | null;
  usedMagic: number;
  winCondition: string;
};

export type PhaseResolutionState = {
  answerDoorId: CardId;
  currentCorridor: number;
  difficulty: number;
  doors: CardId[];
  gameOrder: GameOrder;
  magic: number;
  pages: string[];
  possessedId: PlayerId;
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
  doors: CardId[];
};
