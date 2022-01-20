type OCategoryCard = {
  id: string;
  left: string;
  right: string;
};

type OCurrentCategory = {
  id: string;
  left: string;
  right: string;
  clue?: string;
  target?: number;
};

type SubmitCategoryPayload = {
  categoryId: string;
};

type SubmitCluePayload = {
  clue: string;
};

type SubmitGuessPayload = {
  guess: string;
};
