type VClueId = string;

type SubmitBossPlayerPayload = {
  bossId: PlayerId;
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
  evaluation: Record<ClueId, boolean>;
};

type SubmitOutcomePayload = {
  outcome: string;
};

type SubmitHelpPayload = {
  clueId: ClueId;
};

type VClue = {
  id: VClueId;
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

type VClues = Record<VClueId, VClue>;

type BoardKey = string;

type BoardEntry = {
  clues: VClueId[];
  evaluation?: number;
};

type VBoard = Record<BoardKey, BoardEntry>;
