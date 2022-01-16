import { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

type MonsterCard = {
  id: string;
  orientation: string;
};

interface MonsterSketch extends MonsterCard {
  playerId: PlayerId | null;
  sketch: string | null;
}

interface AllMonsters {
  [key: string]: MonsterCard;
}

interface RetratoFaladoAdditionalData {
  allMonsters: AllMonsters;
  usedCardsId: string[];
}

interface RetratoFaladoStore extends DefaultStore {
  deck: MonsterCard[];
  pastSketches: MonsterSketch[];
}

interface RetratoFaladoState extends DefaultState {
  [key: string]: any;
}
interface RetratoFaladoInitialState extends InitialState {
  store: RetratoFaladoStore;
  state: RetratoFaladoState;
}

interface RetratoFaladoSubmitAction extends Payload {
  action: 'SUBMIT_ORIENTATION' | 'SUBMIT_SKETCH' | 'SUBMIT_VOTE';
}

type FirebaseStoreData = FirebaseFirestore.DocumentData | RetratoFaladoStore;
type FirebaseStateData = FirebaseFirestore.DocumentData | RetratoFaladoState;
