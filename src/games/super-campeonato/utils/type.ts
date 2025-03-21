// Types
import type { TextCard } from 'types/tdr';

export type FightingContender = {
  id: CardId;
  name: DualLanguageValue;
  playerId?: PlayerId;
  votes?: PlayerId[];
};

export type BracketTier = 'quarter' | 'semi' | 'final' | 'winner';

export type Bracket = {
  position: number;
  win?: boolean;
  tier: BracketTier;
  votes: PlayerId[];
} & FightingContender;

export type PastBattles = {
  challenge: TextCard;
  contenders: FightingContender[];
}[];

export type Bet = {
  final: CardId;
  semi: CardId;
  quarter: CardId;
};

export type ContenderByTier = Record<BracketTier | string, Record<CardId, boolean>>;

export type SubmitChallengePayload = {
  challengeId: CardId;
};

export type SubmitContendersPayload = {
  contendersId: CardId;
};

export type SubmitBetsPayload = Bet;

export type SubmitBattleVotesPayload = {
  votes: NumberDictionary;
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
