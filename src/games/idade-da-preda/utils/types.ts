// Types
import type { GameRanking } from 'types/game';
import type { Item } from 'types/tdr';

export type SubmitConceptsPayload = {
  proposedConcepts: Pick<Concept, 'itemsIds' | 'meaning'>[];
};

export type SubmitDownvoteConceptsPayload = {
  downvotedConceptIds: string[];
};

export type SubmitNamePayload = {
  itemId: string;
  name: string;
  conceptsIds: string[];
};

export type SubmitGuessesPayload = {
  guesses: Dictionary<string>;
};

export type Concept = {
  id: string;
  key: string;
  type: 'basic' | 'custom';
  soundId: string;
  syllable: DualLanguageValue;
  meaning: string;
  itemsIds: string[];
  playerId: PlayerId;
  age: number;
};

export type NewNameEntry = {
  id: string;
  playerId: PlayerId;
  name: string;
  itemId: string;
  conceptsIds: string[];
};

export type GalleryEntry = NewNameEntry & {
  correctPlayersIds: PlayerId[];
  guesses: Dictionary<PlayerId[]>;
};

export type PhaseCreatingConceptsState = {
  basicConcepts: Concept[];
  concepts: Concept[];
  items: Dictionary<Item>;
  maxProposals: number;
};

export type PhaseConceptsRevealState = {
  items: Dictionary<Item>;
  basicConcepts: Concept[];
  concepts: Concept[];
};

export type PhaseCommunicatingThingsState = {
  basicConcepts: Concept[];
  concepts: Concept[];
  items: Dictionary<Item>;
  pool: Item[];
};

export type PhaseGuessingState = {
  basicConcepts: Concept[];
  concepts: Concept[];
  items: Dictionary<Item>;
  newNames: NewNameEntry[];
  pool: Item[];
};

export type PhaseResultsState = {
  basicConcepts: Concept[];
  concepts: Concept[];
  items: Dictionary<Item>;
  newNames: NewNameEntry[];
  gallery: GalleryEntry[];
  ranking: GameRanking;
};

export type PhaseGameOverState = {
  gallery: GalleryEntry[];
  // achievements: Achievement[];
};
