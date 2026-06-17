import type { QUEM_NAO_MATA_ACTIONS } from './constants';

export interface QuemNaoMataStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface QuemNaoMataState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface QuemNaoMataInitialState extends InitialState {
  store: QuemNaoMataStore;
  state: QuemNaoMataState;
}

export interface NaRuaDoMedoSubmitAction extends Payload {
  action: keyof typeof QUEM_NAO_MATA_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | QuemNaoMataState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | QuemNaoMataStore;
