// Types
import type { TextCard } from 'types/tdr';

export type Suggestion = {
  suggestion: string;
  invalid: boolean;
  playerId: PlayerId;
};

export type GalleryEntry = {
  suggestions: Suggestion[];
  votes: number;
  guesserId: PlayerId;
  outcome: string;
} & TextCard;

export type SubmitVotesPayload = {
  votes: string[];
};

export type SubmitSuggestionsPayload = {
  suggestions: string[];
};

export type SubmitValidationsPayload = {
  suggestions: Suggestion[];
};

export type ValidateSuggestionPayload = {
  suggestions: Suggestion[];
};

export type SubmitOutcomePayload = {
  outcome: string;
};

export type SendGuessPayload = {
  guess: string;
};
