type SubmitMovieSelectionPayload = {
  movieId: string;
};

type SubmitMovieEliminationPayload = {
  movieId: string;
};

type MovieCard = {
  id: CardId;
  prefix: string;
  suffix: string;
};

type MovieReviewCard = {
  id: CardId;
  text: string;
  type: 'good' | 'bad';
  highlights?: string[];
};
