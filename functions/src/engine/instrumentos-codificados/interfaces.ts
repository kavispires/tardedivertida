import { Language, Meta, Payload, PlayerId, Players, Round } from '../../utils/interfaces';

export interface InstrumentosCodificadosStore {
  language: Language;
  [key: string]: any;
}

export interface InstrumentosCodificadosState {
  phase: string;
  round: Round;
  [key: string]: any;
}

export interface InstrumentosCodificadosInitialState {
  meta: Meta;
  players: Players;
  store: InstrumentosCodificadosStore;
  state: InstrumentosCodificadosState;
}

export interface InstrumentosCodificadosSubmitAction extends Payload {
  action: 'SUBMIT_HINT' | 'SUBMIT_CONCLUSIONS' | 'SUBMIT_CODE';
  [key: string]: any;
  // hint?: string;
  // targetId?: PlayerId;
  // position?: number;
  // conclusions?: PlainObject;
  // code?: string;
}

export interface Hint {
  hint: string;
  targetId: PlayerId;
  position: number;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | InstrumentosCodificadosState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | InstrumentosCodificadosStore;
