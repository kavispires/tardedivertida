export interface InstrumentosCodificadosStore extends DefaultStore {
  [key: string]: any;
}

export interface InstrumentosCodificadosState extends DefaultState {
  [key: string]: any;
}

export interface InstrumentosCodificadosInitialState extends InitialState {
  store: InstrumentosCodificadosStore;
  state: InstrumentosCodificadosState;
}

export interface Hint {
  hint: string;
  targetId: PlayerId;
  position: number;
}

export interface InstrumentosCodificadosSubmitAction extends Payload {
  action: 'SUBMIT_HINT' | 'SUBMIT_CONCLUSIONS' | 'SUBMIT_CODE';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | InstrumentosCodificadosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | InstrumentosCodificadosStore;
