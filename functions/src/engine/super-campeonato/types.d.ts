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

export type Contender = {
  id: CardId;
  name: string;
  playerId: PlayerId | 'CPU';
};

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
  action: 'SUBMIT_CHALLENGE' | 'SUBMIT_CONTENDERS' | 'SUBMIT_BETS' | 'SUBMIT_VOTES';
}

export type FirebaseStateData = FirebaseFirestore.DocumentData | SuperCampeonatoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | SuperCampeonatoStore;
