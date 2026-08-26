// Types
import type { GameRound, GamePlayer, GamePlayers, GameRanking, Achievement } from 'types/game';
import type { GroupQuestionCardData, SpectrumCardData, TextCardData } from 'types/tdr';

export type Track = {
  game: string;
  variant?: string;
  condition: string;
  data: Record<string, any>;
};

export type TrackProps = {
  track: Track;
  round: GameRound;
  players: GamePlayers;
  user: GamePlayer;
  onSubmitAnswer: (payload: SubmitAnswerPayload) => void;
};

export type SubmitSeedPayload = {
  data: unknown;
};

export type SubmitAnswerPayload = {
  data: { value: string | number };
};

export type AlienSign = {
  id: string;
  name: DualLanguageValue;
};

export type StreetCard = {
  id: string;
  key: string;
  name: DualLanguageValue;
  type: 'horror' | 'candy' | 'jackpot';
  value: number;
};

export type Seed = {
  card: never;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryArteRuim = {
  type: 'arte-ruim';
  card: TextCardData;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryContadoresHistorias = {
  type: 'contadores-historias';
  cards: TextCardData[];
  tree: TextCardData;
  card: string;
  outfits: never;
  prompts: TextCardData[];
};

export type SeedEntryLabirintoSecreto = {
  type: 'labirinto-secreto';
  cards: TextCardData[];
  tree: TextCardData;
  card: never;
  outfits: never;
  prompts: never;
};

export type SeedEntryMenteColetiva = {
  type: 'mente-coletiva';
  card: GroupQuestionCardData;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryOndaTelepatica = {
  type: 'onda-telepatica';
  card: SpectrumCardData;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryPolemicaDaVez = {
  type: 'polemica-da-vez';
  card: TextCardData;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryRetratoFalado = {
  type: 'retrato-falado';
  card: {
    id: string;
    orientation: 'horizontal' | 'vertical';
  };
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryUeSoIsso = {
  type: 'ue-so-isso';
  card: TextCardData;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryParty = {
  type: 'party';
  card: never;
  cards: {
    id: UID;
    text: DualLanguageValue;
  }[];
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryClubberOutfit = {
  type: 'clubber';
  outfits: string[];
  card: never;
  cards: never;
  tree: never;
  prompts: never;
};

export type SeedEntry =
  | SeedEntryArteRuim
  | SeedEntryContadoresHistorias
  | SeedEntryLabirintoSecreto
  | SeedEntryMenteColetiva
  | SeedEntryOndaTelepatica
  | SeedEntryPolemicaDaVez
  | SeedEntryRetratoFalado
  | SeedEntryUeSoIsso
  | SeedEntryParty
  | SeedEntryClubberOutfit;

export type VoteComponentProps = {
  track: Track;
  winningValues: string[];
  winningTeam: UID[];
  players: GamePlayers;
  playersList: GamePlayer[];
};

export type ResultComponentProps = VoteComponentProps & { containerWidth: number };

export type MostScoring = {
  condition: string;
  winningTeam: UID[];
  losingTeam: UID[];
  winningValues: string[];
  scoringType: 'NORMAL' | 'TIE' | 'DRAW';
};

export type PhaseSeedingState = {};

export type PhaseTrackState = {
  track: Track;
};

export type PhaseResultState = {
  track: Track;
  bonusPlayers: UID[];
  penaltyPlayers: UID[];
  ranking: GameRanking;
} & MostScoring;

export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Winners of the game
   */
  winners: GamePlayer[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Fair winners of the game (only populated when the player with the highest points is not in the VIP area)
   */
  fairWinners: GamePlayer[];
};
