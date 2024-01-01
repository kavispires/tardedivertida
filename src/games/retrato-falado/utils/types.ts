export type Sketch = {
  sketch: string;
  playerId: PlayerId;
} & MonsterCard;

export type SubmitOrientationPayload = {
  orientation: string;
};

export type SubmitSketchPayload = {
  sketch: string;
};

export type SubmitVotePayload = {
  vote: PlayerId;
};
