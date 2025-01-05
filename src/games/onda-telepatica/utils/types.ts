export type CurrentCategory = {
  id: string;
  left: string;
  right: string;
  clue?: string;
  target?: number;
};

export type SubmitCategoryPayload = {
  categoryId: string;
};

export type SubmitCluePayload = {
  clue: string;
};

export type SubmitGuessPayload = {
  guess: number | boolean;
};
