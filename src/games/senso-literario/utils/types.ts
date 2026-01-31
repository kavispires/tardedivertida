// Types
import type { Achievement } from 'types/achievements';
import type { GameRanking } from 'types/game';

export type SubmitPatternPayload = {
  patternId: string;
};

export type GalleryEntry = {
  sequence: CardId[];
  cards: {
    playersIsd: PlayerId[];
    patternId: CardId;
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
