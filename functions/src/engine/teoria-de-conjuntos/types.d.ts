import { DiagramTopic, Item } from '../../types/tdr';
import { OUTCOME, TEORIA_DE_CONJUNTOS_ACHIEVEMENTS, TEORIA_DE_CONJUNTOS_ACTIONS } from './constants';

export interface TeoriaDeConjuntosOptions {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   * Use 2 diagrams instead of 3
   */
  easyGame?: boolean;
}

export type TopicsByDiagramType = {
  attribute: DiagramTopic[];
  word: DiagramTopic[];
  context?: DiagramTopic[];
};

export interface ResourceData {
  items: Item[];
  diagrams: {
    attribute: DiagramTopic;
    word: DiagramTopic;
    context?: DiagramTopic;
  };
  examples: TopicsByDiagramType;
}

export type DiagramArea = {
  key: string; // A | W | C | O and any combination
  itemsIds: CardId[];
};

export type Outcome = keyof typeof OUTCOME;

export type Guess = {
  itemId: CardId;
  playerId: PlayerId;
  suggestedArea: string;
  correctArea: string | null;
  outcome: Outcome | string;
};

export type TeoriaDeConjuntosAchievement = keyof typeof TEORIA_DE_CONJUNTOS_ACHIEVEMENTS;

export interface TeoriaDeConjuntosStore extends DefaultStore {
  [key: string]: any;
}

export interface TeoriaDeConjuntosState extends DefaultState {
  [key: string]: any;
}

export interface TeoriaDeConjuntosInitialState extends InitialState {
  store: TeoriaDeConjuntosStore;
  state: TeoriaDeConjuntosState;
}

export interface TeoriaDeConjuntosSubmitAction extends Payload {
  action: keyof typeof TEORIA_DE_CONJUNTOS_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | TeoriaDeConjuntosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TeoriaDeConjuntosStore;
