import type { ContenderCard, TextCard } from '../../types/tdr';
import type { SUPER_CAMPEONATO_ACHIEVEMENTS, SUPER_CAMPEONATO_ACTIONS } from './constants';

export type SuperCampeonatoOptions = {
  /**
   * Possibly include nsfw contenders
   */
  nsfw?: boolean;
  /**
   * Automatically select contenders for the round (for games over 8 players)
   */
  autoContenders?: boolean;
} & ContendersDecksOptions;

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

export type PastBattles = {
  challenge: TextCard;
  contenders: Contender[];
}[];

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

export type SuperCampeonatoAchievement = keyof typeof SUPER_CAMPEONATO_ACHIEVEMENTS;

export type FirebaseStateData = FirebaseFirestore.DocumentData | SuperCampeonatoState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData | SuperCampeonatoStore;
