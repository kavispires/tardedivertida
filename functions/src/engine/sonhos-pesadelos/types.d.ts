import { DefaultState, DefaultStore, ImageCardId, Meta, Payload, PlayerId, Players } from '../../utils/types';

interface SonhosPesadelosStore extends DefaultStore {
  themes?: any;
  results?: any;
  [key: string]: any;
}

interface SonhosPesadelosState extends DefaultState {
  table?: any;
  dreamsCount?: number;
  nightmaresCount?: number;
  theme?: any;
  clues?: any;
  results?: any;
  isLastChance?: boolean;
  winners?: any;
  [key: string]: any;
}

interface SonhosPesadelosInitialState {
  meta: Meta;
  players: Players;
  store: SonhosPesadelosStore;
  state: SonhosPesadelosState;
}

interface TableEntry {
  cardId: ImageCardId;
  dreamer: PlayerId | null;
  nightmares: PlayerId[];
}

type Table = TableEntry[];

type Result = {
  playerId: PlayerId;
  dreamGuesses: {
    [key: string]: boolean;
  };
  correct: number;
  nightmareHits: string[];
  win: boolean;
  previousScore: number;
};

type Results = {
  [key: string]: Result;
};

interface SonhosPesadelosSubmitAction extends Payload {
  action: 'SUBMIT_DREAMS' | 'SUBMIT_VOTING';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | SonhosPesadelosState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | SonhosPesadelosStore;
