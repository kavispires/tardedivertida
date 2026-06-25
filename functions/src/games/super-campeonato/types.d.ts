// Types
import type { ContenderCardData, TextCardData } from '../../types/tdr';
import type { SUPER_CAMPEONATO_ACTIONS } from './constants';

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
  contenders: ContenderCardData[];
  challenges: TextCardData[];
}

export type ContendersDeck = ContenderCardData[];

export type ChallengesDeck = TextCardData[];

export type FightingContender = {
  playerId: UID | 'CPU';
} & Pick<ContenderCardData, 'id' | 'name' | 'description'>;

export type PastBattles = {
  challenge: TextCardData;
  contenders: FightingContender[];
}[];

export type BracketTier = 'quarter' | 'semi' | 'final' | 'winner';

export interface Bracket extends FightingContender {
  position: number;
  win?: boolean;
  tier: BracketTier;
  votes: UID[];
}

export interface SuperCampeonatoStore extends DefaultStore {
  [key: string]: AnyOrUnknownPlaceholder;
}

export interface SuperCampeonatoState extends DefaultState {
  [key: string]: AnyOrUnknownPlaceholder;
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
