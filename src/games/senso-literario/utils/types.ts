// Types
import type { Achievement, GameRanking } from 'types/game';

export type SubmitPatternPayload = {
  patternId: string;
};

export type GalleryEntry = {
  sequence: UID[];
  cards: {
    playersIsd: UID[];
    patternId: UID;
  }[];
};

export type PhasePatternCreationState = {
  sequence: string[];
};

export type PhaseResultState = {
  sequence: string[];
  gallery: GalleryEntry;
  ranking: GameRanking;
};

export type PhaseGameOverState = {
  achievements: Achievement[];
  gallery: GalleryEntry[];
};
