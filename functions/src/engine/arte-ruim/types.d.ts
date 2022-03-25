import { DefaultState, DefaultStore, InitialState, Payload, PlainObject, PlayerId } from '../../utils/types';

type ArteRuimGameOptions = {
  useAllCards: boolean;
  shortGame: boolean;
};

type ArteRuimCard = {
  id: string;
  text: string;
  level: number;
};

type ArteRuimLevel4Card = {
  id: string;
  theme: string;
  cards: PlainObject;
};

type PerLevelCards = {
  [key: string]: ArteRuimCard[];
};

interface ArteRuimDrawing extends ArteRuimCard {
  playerId: PlayerId | null;
  drawing: string | null;
  successRate: number;
}

interface ArteRuimStore extends DefaultStore {
  deck: Record<string, ArteRuimCard>;
  currentCards: string[];
  pastDrawings: ArteRuimDrawing[];
}

interface ArteRuimState extends DefaultState {
  drawings?: any;
  gallery?: any;
  cards?: any;
  ranking?: any;
  winners?: any;
  [key: string]: any;
}
interface ArteRuimInitialState extends InitialState {
  store: ArteRuimStore;
  state: ArteRuimState;
}

interface ArteRuimSubmitAction extends Payload {
  action: 'SUBMIT_DRAWING' | 'SUBMIT_VOTING';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | ArteRuimState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | ArteRuimStore;
