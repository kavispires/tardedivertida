type Monster = {
  id: string;
  orientation: string;
};

interface Sketch extends Monster {
  sketch: string;
  playerId: PlayerId;
}

type SubmitOrientationPayload = {
  orientation: string;
};

type SubmitSketchPayload = {
  sketch: string;
};

type SubmitVotePayload = {
  vote: PlayerId;
};
