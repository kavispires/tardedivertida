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

export type SubmitChallengePayload = {
  challengeId: CardId;
};

export type SubmitContendersPayload = {
  contendersId: CardId;
};

export type PastBattles = {
  challenge: TextCard;
  contenders: FightingContender[];
}[];

export type Bet = {
  final: CardId;
  semi: CardId;
  quarter: CardId;
};

export type SubmitBetsPayload = Bet;

export type SubmitBattleVotesPayload = {
  votes: NumberDictionary;
};

export type ContenderByTier = Record<BracketTier | string, Record<CardId, boolean>>;
