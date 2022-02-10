type NCard = {
  id: string;
  key: string;
  name: DualLanguageValue;
  type: 'horror' | 'candy' | 'jackpot';
  value: number;
};

type NStreet = NCard[];

type CandyStatus = {
  leftover: number;
  perPlayer: number;
};

type NDecision = 'GO_HOME' | 'CONTINUE' | 'HOME';

type CandySidewalk = CandyStatus[];

type SubmitDecisionPayload = {
  decision: NDecision;
};
