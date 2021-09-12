import { ImageCard, Language, Meta, PlayerId, Players, Round } from '../../utils/interfaces';

export interface SonhosPesadelosStore {
  language: Language;
  deck: ImageCard[];
  deckIndex: number;
  [key: string]: any;
}

export interface SonhosPesadelosState {
  phase: string;
  round: Round;
  [key: string]: any;
}

export interface SonhosPesadelosInitialState {
  meta: Meta;
  players: Players;
  store: SonhosPesadelosStore;
  state: SonhosPesadelosState;
}

export interface TableEntry {
  cardId: ImageCard;
  dreamer: PlayerId | null;
  nightmares: PlayerId[];
}

export type Table = TableEntry[];

// export interface ContadoresHistoriasSubmitAction extends Payload {
//   action: 'SUBMIT_STORY' | 'PLAY_CARD' | 'SUBMIT_VOTE';
//   [key: string]: any;
// }

export type FirebaseStateData = FirebaseFirestore.DocumentData | SonhosPesadelosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | SonhosPesadelosStore;
