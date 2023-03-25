import { TA_NA_CARA_ACTIONS } from './constants';

export type TaNaCaraOptions = {
  /**
   * Use AI deck or not
   */
  aiDeck?: boolean;
  /**
   * Use alternative AI versions of the cartoon or ai deck
   */
  alternativeVersion?: boolean;
};

export interface CharacterFace extends SuspectCard {
  revealed: boolean;
  playerId?: PlayerId;
}

export interface ResourceData {
  allCards: TestimonyQuestionCard[];
  allSuspects: SuspectCard[];
}

export interface TaNaCaraStore extends DefaultStore {
  [key: string]: any;
}

export interface TaNaCaraState extends DefaultState {
  [key: string]: any;
}

export interface TaNaCaraInitialState extends InitialState {
  store: TaNaCaraStore;
  state: TaNaCaraState;
}

export interface TaNaCaraSubmitAction extends Payload {
  action: keyof typeof TA_NA_CARA_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | TaNaCaraState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TaNaCaraStore;
