interface WContender {
  id: CardId;
  name: DualLanguageValue;
  playerId?: PlayerId;
}

type WBracketTier = 'quarter' | 'semi' | 'final' | 'winner';

interface WBracket extends WContender {
  position: number;
  win?: boolean;
  tier: WBracketTier;
}

type SubmitChallengePayload = {
  challengeId: CardId;
};

type SubmitContendersPayload = {
  contendersId: CardId;
};

type SubmitBetsPayload = {
  quarter: CardId;
  semi: CardId;
  final: CardId;
};

type SubmitBattleVotesPayload = {
  votes: NumberDictionary;
};

type WBets = {
  final: CardId;
  semi: CardId;
  quarter: CardId;
};
