interface Track {
  game: string;
  variant?: string;
  condition: string;
  data: Record<string, any>;
}

interface TrackProps {
  track: Track;
  round: GameRound;
  players: GamePlayers;
  user: GamePlayer;
  onSubmitAnswer: GenericFunction;
}

type SubmitAnswerPayload = {
  data: any;
};

type SceneTile = {
  id: string;
  type: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  values: DualLanguageValue[];
  specific?: string | null;
  tags?: Record<number | string, string[]>;
};

type HCard = {
  id: string;
  type: string;
  name: DualLanguageValue;
  tags?: string[];
};

type Seed = {
  card: never;
  cards: never;
  outfits: never;
  portal: never;
};

type SeedEntryArteRuim = {
  type: 'arte-ruim';
  card: TextCard;
  cards: never;
  outfits: never;
  portal: never;
};

type SeedEntryCaminhosMagicos = {
  type: 'caminhos-magicos';
  cards: TextCard[];
  portal: TextCard;
  card: never;
  outfits: never;
};

type SeedEntryFileiraDeFatos = {
  type: 'fileira-de-fatos';
  card: QuantitativeQuestionCard;
  cards: never;
  outfits: never;
  portal: never;
};

type SeedEntryOndaTelepatica = {
  type: 'onda-telepatica';
  card: OpposingIdeaCard;
  cards: never;
  outfits: never;
  portal: never;
};

type SeedEntryPolemicaDaVez = {
  type: 'polemica-da-vez';
  card: TopicCard;
  cards: never;
  outfits: never;
  portal: never;
};

type SeedEntryRetratoFalado = {
  type: 'retrato-falado';
  card: {
    id: string;
    orientation: 'horizontal' | 'vertical';
  };
  cards: never;
  outfits: never;
  portal: never;
};

type SeedEntryClubberOutfit = {
  type: 'clubber';
  outfits: string[];
  card: never;
  cards: never;
  portal: never;
};

type SeedEntry =
  | SeedEntryArteRuim
  | SeedEntryCaminhosMagicos
  | SeedEntryFileiraDeFatos
  | SeedEntryOndaTelepatica
  | SeedEntryPolemicaDaVez
  | SeedEntryRetratoFalado
  | SeedEntryClubberOutfit;

type ResultComponentProps = {
  track: Track;
  winningValues: string[];
  winningTeam: PlayerId[];
  players: GamePlayers;
};

type VoteComponentProps = {
  track: Track;
  winningValues: string[];
  winningTeam: PlayerId[];
  players: GamePlayers;
  playersList: GamePlayer[];
};
