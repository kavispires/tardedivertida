// Types
import type { GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
import type { GroupQuestionCard, SpectrumCard, TextCard } from 'types/tdr';

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
  onSubmitAnswer: GenericFunction;
};

export type SubmitAnswerPayload = {
  data: any;
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
  card: TextCard;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryContadoresHistorias = {
  type: 'contadores-historias';
  cards: TextCard[];
  tree: TextCard;
  card: string;
  outfits: never;
  prompts: TextCard[];
};

export type SeedEntryLabirintoSecreto = {
  type: 'labirinto-secreto';
  cards: TextCard[];
  tree: TextCard;
  card: never;
  outfits: never;
  prompts: never;
};

export type SeedEntryMenteColetiva = {
  type: 'mente-coletiva';
  card: GroupQuestionCard;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryOndaTelepatica = {
  type: 'onda-telepatica';
  card: SpectrumCard;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryPolemicaDaVez = {
  type: 'polemica-da-vez';
  card: TextCard;
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
  card: TextCard;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

export type SeedEntryParty = {
  type: 'party';
  card: never;
  cards: {
    id: CardId;
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
  winningTeam: PlayerId[];
  players: GamePlayers;
  playersList: GamePlayer[];
};

export type ResultComponentProps = VoteComponentProps & { containerWidth: number };
