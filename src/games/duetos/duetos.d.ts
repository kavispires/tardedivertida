type SubmitPairsPayload = {
  pairs: string[];
};

type ItemEntry = {
  id: string;
  type: string;
  value: any;
};

type DuetosGalleryEntry = {
  pairId: string;
  players: PlayerId[];
  pair: ItemEntry[];
};

type LefOutEntry = {
  id: string;
  item: ItemEntry;
  players: PlayerId[];
};
