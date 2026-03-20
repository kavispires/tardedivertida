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
  featureId: UID;
  pass: boolean;
  votes: UID[];
  score: number;
};

export type MesmiceGalleryEntry = {
  playerId: UID;
  item: ObjectCardObj;
  clue: string;
  featureId: UID;
  history: HistoryEntry[];
};

/**
 * Result of calculating the most voted option in a voting scenario
 */
export type MostVotesResult = {
  /**
   * The property that signals the vote (usually `vote`)
   */
  property: string;
  /**
   * The value of the property that signals the vote
   */
  value: string;
  /**
   * The players who voted for this result
   */
  votes: UID[];
  /**
   * How many players voted for this result
   */
  count: number;
  /**
   * In case of a tie in most votes (count)
   */
  tie?: boolean;
};
