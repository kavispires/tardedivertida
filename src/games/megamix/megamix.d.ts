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

type AlienSign = {
  id: string;
  name: DualLanguageValue;
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
  tree: never;
  prompts: never;
};

type SeedEntryArteRuim = {
  type: 'arte-ruim';
  card: TextCard;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

type SeedEntryContadoresHistorias = {
  type: 'contadores-historias';
  cards: TextCard[];
  tree: TextCard;
  card: string;
  outfits: never;
  prompts: TextCard[];
};

type SeedEntryLabirintoSecreto = {
  type: 'labirinto-secreto';
  cards: TextCard[];
  tree: TextCard;
  card: never;
  outfits: never;
  prompts: never;
};

type SeedMenteColetiva = {
  type: 'mente-coletiva';
  card: GroupQuestionCard;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

type SeedEntryOndaTelepatica = {
  type: 'onda-telepatica';
  card: OpposingIdeaCard;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

type SeedEntryPolemicaDaVez = {
  type: 'polemica-da-vez';
  card: TweetCard;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

type SeedEntryRetratoFalado = {
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

type SeedEntryUeSoIsso = {
  type: 'ue-so-isso';
  card: TextCard;
  cards: never;
  outfits: never;
  tree: never;
  prompts: never;
};

type SeedEntryParty = {
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

type SeedEntryClubberOutfit = {
  type: 'clubber';
  outfits: string[];
  card: never;
  cards: never;
  tree: never;
  prompts: never;
};

type SeedEntry =
  | SeedEntryArteRuim
  | SeedEntryContadoresHistorias
  | SeedEntryLabirintoSecreto
  | SeedMenteColetiva
  | SeedEntryOndaTelepatica
  | SeedEntryPolemicaDaVez
  | SeedEntryRetratoFalado
  | SeedEntryUeSoIsso
  | SeedEntryParty
  | SeedEntryClubberOutfit;

type VoteComponentProps = {
  track: Track;
  winningValues: string[];
  winningTeam: PlayerId[];
  players: GamePlayers;
  playersList: GamePlayer[];
};

type ResultComponentProps = VoteComponentProps;
