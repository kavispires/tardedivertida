export type Monster = {
  id: string;
  orientation: string;
};

export interface Sketch extends Monster {
  sketch: string;
  playerId: PlayerId;
}
