import { TextCard } from '../../utils/tdr';
import { DefaultState, DefaultStore, GameOrder, InitialState, Payload, PlayerId } from '../../utils/types';

type AllWords = {
  [key: string]: TextCard;
};

type ResourceData = {
  allWords: AllWords;
};

type ImageCardId = {
  id: string;
  used: boolean;
  matchedPlayers?: PlayerId[];
};

type PlayerCard = {
  cardId: string;
  used: boolean;
  matchedPlayers: PlayerId[];
  score: number;
};

interface GaleriaDeSonhosStore extends DefaultStore {
  tableDeck: ImageCardId[];
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