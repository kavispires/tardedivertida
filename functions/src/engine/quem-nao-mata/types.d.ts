export interface QuemNaoMataStore extends DefaultStore {
  [key: string]: any;
}

export interface QuemNaoMataState extends DefaultState {
  [key: string]: any;
}

export interface QuemNaoMataInitialState extends InitialState {
  store: QuemNaoMataStore;
  state: QuemNaoMataState;
}

export interface NaRuaDoMedoSubmitAction extends Payload {
  action: 'SUBMIT_TARGET' | 'SUBMIT_MESSAGE' | 'SUBMIT_DECISION';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | QuemNaoMataState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | QuemNaoMataStore;
