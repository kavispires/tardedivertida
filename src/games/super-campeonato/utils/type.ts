// Types
import type { ContenderCard, TextCard } from 'types/tdr';

export type FightingContender = {
  playerId: UID | 'CPU';
  votes?: UID[];
} & Pick<ContenderCard, 'id' | 'name' | 'description'>;

export type BracketTier = 'quarter' | 'semi' | 'final' | 'winner';

export type Bracket = {
  position: number;
  win?: boolean;
  tier: BracketTier;
  votes: UID[];
} & FightingContender;

export type PastBattles = {
  challenge: TextCard;
  contenders: FightingContender[];
}[];

export type Bet = {
  final: UID;
  semi: UID;
  quarter: UID;
};

export type ContenderByTier = Record<BracketTier | string, Record<UID, boolean>>;

export type SubmitChallengePayload = {
  challengeId: UID;
};

export type SubmitContendersPayload = {
  contendersId: UID;
};

export type SubmitBetsPayload = Bet;

export type SubmitBattleVotesPayload = {
  votes: Dictionary<number>;
};

export type PhaseChallengeSelectionState = {
  challenges: TextCard[];
  brackets?: Bracket[];
};

export type PhaseContendersSelectionState = {
  challenge: TextCard;
};

export type PhaseBetsState = {
  challenge: TextCard;
  brackets: Bracket[];
};

export type PhaseBattleState = {
  challenge: TextCard;
  brackets: Bracket[];
  tier: BracketTier;
};
