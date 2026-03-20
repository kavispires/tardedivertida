// Types
import type { TextCard } from 'types/tdr';

export type Suggestion = {
  suggestion: string;
  invalid: boolean;
  playerId: UID;
};

export type GalleryEntry = {
  suggestions: Suggestion[];
  votes: number;
  guesserId: UID;
  outcome: string;
} & TextCard;

export type SubmitVotesPayload = {
  votes: string[];
};

export type SubmitSuggestionsPayload = {
  suggestions: string[];
};

export type SubmitValidationsPayload = {
  validSuggestions: Suggestion[];
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

export interface SecretWord {
  id: string;
  text: string;
  // playerName?: string | null;
  // uniqueSuggestions?: string[] | [];
  // commonSuggestions?: string[] | [];
  votes: 0;
}
