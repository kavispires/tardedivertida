interface Task {
  game: string;
  variant?: string;
  condition: string;
  data: Record<string, any>;
}

interface TaskProps {
  task: Task;
  round: GameRound;
  players: GamePlayers;
  user: GamePlayer;
  onSubmitTask: GenericFunction;
}

type SubmitTaskPayload = {
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
  task: Task;
  winningValues: string[];
  players: GamePlayers;
};
