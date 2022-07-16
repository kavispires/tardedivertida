import type { DefaultState, DefaultStore, InitialState, Payload, PlayerId } from '../../utils/types';

interface InstrumentosCodificadosStore extends DefaultStore {
  [key: string]: any;
}

interface InstrumentosCodificadosState extends DefaultState {
  [key: string]: any;
}

interface InstrumentosCodificadosInitialState extends InitialState {
  store: InstrumentosCodificadosStore;
  state: InstrumentosCodificadosState;
}

interface Hint {
  hint: string;
  targetId: PlayerId;
  position: number;
}

interface InstrumentosCodificadosSubmitAction extends Payload {
  action: 'SUBMIT_HINT' | 'SUBMIT_CONCLUSIONS' | 'SUBMIT_CODE';
}

type FirebaseStateData = FirebaseFirestore.DocumentData | InstrumentosCodificadosState;
type FirebaseStoreData = FirebaseFirestore.DocumentData | InstrumentosCodificadosStore;
