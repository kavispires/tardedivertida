export type SubmitPairsPayload = {
  pairs: string[];
};

export type Item = {
  id: string;
  type: string;
  value: any;
};

export type DuetosGalleryEntry = {
  pairId: string;
  players: PlayerId[];
  pair: Item[];
};

export type LefOutEntry = {
  id: string;
  item: Item;
  players: PlayerId[];
};
