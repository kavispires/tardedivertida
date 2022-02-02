type UeSoIssoCard = {
  id: string;
  text: string;
};

type UseSoIssoSuggestion = {
  suggestion: string;
  invalid: boolean;
  playerId: PlayerId;
};

type SubmitVotesPayload = {
  votes: string[];
};

type SubmitSuggestionsPayload = {
  suggestions: string[];
};

type SubmitValidationsPayload = {
  suggestions: UseSoIssoSuggestion[];
};

type ValidateSuggestionPayload = {
  suggestions: UseSoIssoSuggestion[];
};

type SubmitOutcomePayload = {
  outcome: string;
};

type SendGuessPayload = {
  guess: string;
};
