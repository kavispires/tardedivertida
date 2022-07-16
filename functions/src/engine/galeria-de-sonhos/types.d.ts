import type { TextCard } from '../../utils/tdr';
import type {
  DefaultState,
  DefaultStore,
  GameOrder,
  InitialState,
  Payload,
  PlayerId,
} from '../../utils/types';

type AllWords = {
  [key: string]: TextCard;
};

type ResourceData = {
  allWords: AllWords;
};

type ImageCard = {
  id: string;
  used: boolean;
  matchedPlayers?: PlayerId[];
  text?: string;
};

type PlayerCard = {
  cardId: string;
  used: boolean;
  matchedPlayers: PlayerId[];
  score: number;
};

interface GaleriaDeSonhosStore extends DefaultStore {
  tableDeck: ImageCard[];
  deck: TextCard[];
  gameOrder: GameOrder;
  [key: string]: any;
}

interface GaleriaDeSonhosState extends DefaultState {
  [key: string]: any;
}

interface GaleriaDeSonhosInitialState extends InitialState {
  store: GaleriaDeSonhosStore;
  state: GaleriaDeSonhosState;
}

interface GaleriaDeSonhosSubmitAction extends Payload {
  action: 'SUBMIT_WORD' | 'SUBMIT_CARDS' | 'PLAY_CARD';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | GaleriaDeSonhosState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | GaleriaDeSonhosStore;
