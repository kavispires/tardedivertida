type WContender = {
  id: CardId;
  name: DualLanguageValue;
  playerId?: PlayerId;
};

type SubmitChallengePayload = {
  challengeId: CardId;
};

type SubmitContendersPayload = {
  contendersIds: CardId[];
};

type SubmitBetsPayload = {
  quarter: CardId;
  semi: CardId;
  final: CardId;
};

type SubmitBattleVotesPayload = {
  votes: CardId[];
};
