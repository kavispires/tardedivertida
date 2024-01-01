export type Location = {
  id: string;
  name: string;
};

export type GuessLocationPayload = {
  locationId: string;
};

export type MakeAccusationPayload = {
  targetId: PlayerId;
};

export type SubmitVotePayload = {
  vote: boolean;
};

export type SendLastQuestionerPayload = {
  lastPlayerId: PlayerId;
};

export type GameProgressPayload = {
  end?: boolean;
  continue?: boolean;
};

export type ResolutionStatus = {
  isPlayerVictory: boolean;
  isUserTheSpy: boolean;
  wasABadVoting: boolean;
  wasAnAccusationAttempt: boolean;
  didSpyGuess: boolean;
  didTheSpyWin: boolean;
  phaseIcon: 'nuclear-explosion' | 'handcuffs';
  guess: Location | PlainObject;
  currentLocation?: Location;
};

export type TimerType = {
  status: string;
  timeRemaining: number;
  updatedAt: number;
};

export type Outcome = {
  type: string;
  votedYes?: string;
  isFinalAssessment: boolean;
};

export type Resolution = {
  type: string;
  isSpyWin: boolean;
  isSpyGuess: boolean;
  guess?: string;
  currentLocation?: Location;
};

export type FinalAssessment = {
  playerOrder: PlayerId[];
  playerOrderIndex: number;
};
