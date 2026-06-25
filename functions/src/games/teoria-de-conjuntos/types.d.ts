// Types
import type { DiagramTopicData, ItemData } from '../../types/tdr';
import type { OUTCOME, TEORIA_DE_CONJUNTOS_ACTIONS } from './constants';

export type TeoriaDeConjuntosOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   * Use 2 diagrams instead of 3
   */
  easyGame?: boolean;
};

export type TopicsByDiagramType = {
  attribute: DiagramTopicData[];
  word: DiagramTopicData[];
  context?: DiagramTopicData[];
};

export interface ResourceData {
  items: ItemData[];
  diagrams: {
    attribute: DiagramTopicData;
    word: DiagramTopicData;
    context?: DiagramTopicData;
  };
  examples: TopicsByDiagramType;
}

export type DiagramArea = {
  key: string; // A | W | C | O and any combination
  itemsIds: UID[];
};

export type Outcome = keyof typeof OUTCOME;

export type Guess = {
  itemId: UID;
  playerId: UID;
  suggestedArea: string;
  correctArea: string | null;
  outcome: Outcome | string;
};

export interface TeoriaDeConjuntosStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface TeoriaDeConjuntosState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
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
