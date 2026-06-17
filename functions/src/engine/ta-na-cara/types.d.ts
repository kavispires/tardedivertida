import type { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
import type { TA_NA_CARA_ACTIONS } from './constants';

export type TaNaCaraOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
  /**
   * Use everyone instead of just adults
   */
  everyoneDeck?: boolean;
} & SuspectCardsOptions;

export interface ResourceData {
  questions: TestimonyQuestionCard[];
  characters: SuspectCard[];
}

export type AnswerValue = -2 | -1 | 1 | 2;

export interface TaNaCaraStore extends DefaultStore<TaNaCaraOptions> {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface TaNaCaraState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
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
