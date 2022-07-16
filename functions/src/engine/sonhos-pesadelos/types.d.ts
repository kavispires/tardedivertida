import type { NamingPromptCard } from '../../utils/tdr';
import type {
  DefaultState,
  DefaultStore,
  ImageCardId,
  Meta,
  Payload,
  PlayerId,
  Players,
} from '../../utils/types';

type SonhosPesadelosCards = {
  2: NamingPromptCard[];
  3: NamingPromptCard[];
  4: NamingPromptCard[];
};

type ThemeDeck = {
  1: NamingPromptCard[];
  2: NamingPromptCard[];
  3: NamingPromptCard[];
  4: NamingPromptCard[];
  5: NamingPromptCard[];
};

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
  dreamId: ImageCardId;
  dream: string;
  cards: {
    cardId: ImageCardId;
    votes: PlayerId[];
    isDream: boolean;
    isNightmare: boolean;
  }[];
};

interface SonhosPesadelosSubmitAction extends Payload {
  action: 'SUBMIT_DREAM' | 'SUBMIT_VOTING';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | SonhosPesadelosState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | SonhosPesadelosStore;
