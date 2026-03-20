// Types
import type { MonsterImage } from 'types/tdr';

export type Sketch = {
  sketch: string;
  playerId: UID;
} & MonsterImage;

export type SubmitOrientationPayload = {
  orientation: string;
};

export type SubmitSketchPayload = {
  sketch: string;
};

export type SubmitVotePayload = {
  vote: UID;
};
