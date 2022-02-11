type ELocation = {
  id: string;
  name: string;
};

type GuessLocationPayload = {
  locationId: string;
};

type MakeAccusationPayload = {
  targetId: PlayerId;
};

type SubmitVotePayload = {
  vote: boolean;
};

type SendLastQuestionerPayload = {
  lastPlayerId: PlayerId;
};

type GameProgressPayload = {
  end?: boolean;
  continue?: boolean;
};

type ResolutionStatus = {
  isPlayerVictory: boolean;
  isUserTheSpy: boolean;
  wasABadVoting: boolean;
  wasAnAccusationAttempt: boolean;
  didSpyGuess: boolean;
  didTheSpyWin: boolean;
  phaseIcon: string;
  guess: ELocation | PlainObject;
  currentLocation?: ELocation;
};

type Timer = {
  status: string;
  timeRemaining: number;
  updatedAt: number;
};

type EOutcome = {
  type: string;
  votedYes?: string;
  isFinalAssessment: boolean;
};

type EResolution = {
  type: string;
  isSpyWin: boolean;
  isSpyGuess: boolean;
  guess?: string;
  currentLocation?: ELocation;
};

type FinalAssessment = {
  playerOrder: PlayerId[];
  playerOrderIndex: number;
};
