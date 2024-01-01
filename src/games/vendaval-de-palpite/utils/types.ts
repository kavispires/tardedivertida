type ClueId = string;

export type SubmitBossPlayerPayload = {
  bossId: PlayerId;
};

export type SubmitSecretWordPayload = {
  secretWord: string;
  categories: string[];
};

export type SubmitPlayerCluesPayload = {
  clues: string[];
  guesses?: string[];
};

export type SubmitEvaluationPayload = {
  evaluation: Record<ClueId, boolean>;
};

export type SubmitOutcomePayload = {
  outcome: string;
};

export type SubmitHelpPayload = {
  clueId: ClueId;
};

export type Clue = {
  id: ClueId;
  playerId: PlayerId;
  clue: string;
  /**
   * Indicates if the boss has already evaluated this clue against the secret word
   */
  evaluation?: boolean;
  /**
   * Indicates if clue is a final guess
   */
  isGuess?: boolean;
  /**
   * Indicates if the boss has used help to reveal the resolution of this clue
   */
  isResolved?: boolean;
};

export type Clues = Dictionary<Clue>;

export type BoardKey = string;

export type BoardEntry = {
  clues: ClueId[];
  evaluation?: number;
};

export type BoardObject = Record<BoardKey, BoardEntry>;
