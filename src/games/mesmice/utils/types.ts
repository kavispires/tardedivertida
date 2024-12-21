// Types
import type { Item, ObjectFeatureCard } from 'types/tdr';

export enum Phase {
  CLUE_WRITING = 'CLUE_WRITING',
  OBJECT_FEATURE_ELIMINATION = 'OBJECT_FEATURE_ELIMINATION',
  RESULT = 'RESULT',
}

export type SubmitObjectPayload = {
  itemId: string;
  clue: string;
};

export type SubmitFeaturePayload = {
  featureId: string;
};

export type ObjectCardObj = Pick<Item, 'id' | 'name'>;

export type ExtendedObjectFeatureCard = ObjectFeatureCard & { eliminated?: boolean };

export type HistoryEntry = {
  featureId: CardId;
  pass: boolean;
  votes: PlayerId[];
  score: number;
};

export type MesmiceGalleryEntry = {
  playerId: PlayerId;
  item: ObjectCardObj;
  clue: string;
  featureId: CardId;
  history: HistoryEntry[];
};
