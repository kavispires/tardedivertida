type SubmitMasterPlayerPayload = {
  masterId: PlayerId;
};

type SubmitSecretWordPayload = {
  secretWord: string;
  categories: string[];
};

type SubmitPlayerCluesPayload = {
  clues: string[];
  guesses?: string[];
};

type SubmitEvaluationPayload = {
  evaluation: number;
};

type SubmitOutcomePayload = {
  outcome: string;
};

type SubmitHelpPayload = {
  clue: string;
  evaluation: boolean;
};

type VClue = {
  playerId: PlayerId;
  clue: string;
  isGuess?: boolean;
};

type VBoard = {
  [key: string]: {
    clues: VClue[];
    evaluation?: number;
  };
};
