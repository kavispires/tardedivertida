import { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
import { TA_NA_CARA_ACTIONS } from './constants';

export type TaNaCaraOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
} & SuspectCardsOptions;

export interface CharacterFace extends SuspectCard {
  revealed: boolean;
  playerId?: PlayerId;
}

export interface ResourceData {
  allCards: TestimonyQuestionCard[];
  allSuspects: SuspectCard[];
}

export interface TaNaCaraStore extends DefaultStore<TaNaCaraOptions> {
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
