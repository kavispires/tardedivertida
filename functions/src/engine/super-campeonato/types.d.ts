import { SUPER_CAMPEONATO_ACTIONS } from './constants';

export type SuperCampeonatoOptions = {
  fixedRounds: boolean;
};

export interface CategoryCard extends OpposingIdeaCard {
  target?: number;
  clue?: string;
  psychicId?: string;
}

export interface ResourceData {
  contenders: ContenderCard[];
  challenges: TextCard[];
}

export type ContendersDeck = ContenderCard[];

export type ChallengesDeck = TextCard[];

export interface Contender {
  id: CardId;
  name: DualLanguageValue;
  playerId: PlayerId | 'CPU';
}

type BracketTier = 'quarter' | 'semi' | 'final' | 'winner';

interface Bracket extends Contender {
  position: number;
  win?: boolean;
  tier: BracketTier;
  votes: PlayerId[];
}

export interface SuperCampeonatoStore extends DefaultStore {
  [key: string]: any;
}

export interface SuperCampeonatoState extends DefaultState {
  [key: string]: any;
}

export interface SuperCampeonatoInitialState extends InitialState {
  store: SuperCampeonatoStore;
  state: SuperCampeonatoState;
}

export interface SuperCampeonatoSubmitAction extends Payload {
  action: keyof typeof SUPER_CAMPEONATO_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | SuperCampeonatoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | SuperCampeonatoStore;
