// Types
import type { GameRanking } from 'types/game';
import type { ItemData } from 'types/tdr';

export type SubmitConceptsPayload = {
  proposedConcepts: Pick<ConceptData, 'itemsIds' | 'meaning'>[];
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

export type ConceptData = {
  id: string;
  key: string;
  type: 'basic' | 'custom';
  soundId: string;
  syllable: DualLanguageValue;
  meaning: string;
  itemsIds: string[];
  playerId: UID;
  age: number;
};

export type NewNameEntry = {
  id: string;
  playerId: UID;
  name: string;
  itemId: string;
  conceptsIds: string[];
};

export type GalleryEntry = NewNameEntry & {
  correctPlayersIds: UID[];
  guesses: Dictionary<UID[]>;
};

export type PhaseCreatingConceptsState = {
  basicConcepts: ConceptData[];
  concepts: ConceptData[];
  items: Dictionary<ItemData>;
  maxProposals: number;
};

export type PhaseConceptsRevealState = {
  items: Dictionary<ItemData>;
  basicConcepts: ConceptData[];
  concepts: ConceptData[];
};

export type PhaseCommunicatingThingsState = {
  basicConcepts: ConceptData[];
  concepts: ConceptData[];
  items: Dictionary<ItemData>;
  pool: ItemData[];
};

export type PhaseGuessingState = {
  basicConcepts: ConceptData[];
  concepts: ConceptData[];
  items: Dictionary<ItemData>;
  newNames: NewNameEntry[];
  pool: ItemData[];
};

export type PhaseResultsState = {
  basicConcepts: ConceptData[];
  concepts: ConceptData[];
  items: Dictionary<ItemData>;
  newNames: NewNameEntry[];
  gallery: GalleryEntry[];
  ranking: GameRanking;
};

export type PhaseGameOverState = {
  gallery: GalleryEntry[];
  // achievements: Achievement[];
};
