interface WContender {
  id: CardId;
  name: DualLanguageValue;
  playerId?: PlayerId;
  votes?: PlayerId[];
}

type WBracketTier = 'quarter' | 'semi' | 'final' | 'winner';

interface WBracket extends WContender {
  position: number;
  win?: boolean;
  tier: WBracketTier;
  votes: PlayerId[];
}

type SubmitChallengePayload = {
  challengeId: CardId;
};

type SubmitContendersPayload = {
  contendersId: CardId;
};

type PastBattles = {
  challenge: TextCard;
  contenders: WContender[];
}[];

type WBets = {
  final: CardId;
  semi: CardId;
  quarter: CardId;
};

type SubmitBetsPayload = WBets;

type SubmitBattleVotesPayload = {
  votes: NumberDictionary;
};

type WContenderByTier = Record<WBracketTier | string, Record<CardId, boolean>>;
