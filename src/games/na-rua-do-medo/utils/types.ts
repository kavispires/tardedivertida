export type StreetCard = {
  id: string;
  key: string;
  name: DualLanguageValue;
  type: 'horror' | 'candy' | 'jackpot';
  value: number;
};

export type CandyStatus = {
  leftover: number;
  perPlayer: number;
};

export type Decision = 'GO_HOME' | 'CONTINUE' | 'HOME';

export type CandySidewalk = CandyStatus[];

export type SubmitDecisionPayload = {
  decision: Decision;
};
