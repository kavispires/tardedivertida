import { GAME_NAMES } from '../../utils/constants';
import { PossibleTask, TrackCandidate } from './types';

export const MEGAMIX_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  SEEDING: 'SEEDING',
  TRACK: 'TRACK',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
};

export const MEGAMIX_ACTIONS = {
  SUBMIT_SEEDS: 'SUBMIT_SEEDS',
  SUBMIT_TRACK_ANSWER: 'SUBMIT_TRACK_ANSWER',
};

export const MEGAMIX_ACHIEVEMENTS = {
  LONGEST_LOSER: 'LONGEST_LOSER',
  LONGEST_WINNER: 'LONGEST_WINNER',
  MOST_JOIN: 'MOST_JOIN',
  MOST_LEFT: 'MOST_LEFT',
  MOST_SOLITARY: 'MOST_SOLITARY',
};

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 16,
};

export const TOTAL_ROUNDS = 15;

export const TOTAL_CLUBBERS = 60;

export const IMAGES_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    type: 'images',
    nsfw: false,
    variant: 'impostor',
    weight: 1,
  },
  {
    game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    type: 'images',
    nsfw: false,
    variant: 'detective',
    weight: 2,
  },
  {
    game: GAME_NAMES.GALERIA_DE_SONHOS,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 3,
  },
  {
    game: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 3,
  },
  {
    game: GAME_NAMES.CONTADORES_HISTORIAS,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
];

export const CHARACTERS_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.SUPER_CAMPEONATO,
    type: 'characters',
    nsfw: false,
    variant: 'default',
    weight: 3,
  },
  {
    game: GAME_NAMES.QUEM_SOU_EU,
    type: 'characters',
    nsfw: false,
    variant: 'default',
    weight: 2,
  },
  {
    game: GAME_NAMES.PALHETA_DE_CORES,
    type: 'characters',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
];

export const OPINIONS_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.POLEMICA_DA_VEZ,
    type: 'opinions',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
  {
    game: GAME_NAMES.FILEIRA_DE_FATOS,
    type: 'opinions',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
  {
    game: GAME_NAMES.DILEMA_DOS_ESQUIADORES,
    type: 'opinions',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
];

export const DRAWING_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.ARTE_RUIM,
    type: 'drawing',
    nsfw: false,
    variant: 'cards',
    weight: 2,
  },
  {
    game: GAME_NAMES.ARTE_RUIM,
    type: 'drawing',
    nsfw: false,
    variant: 'drawings',
    weight: 1,
  },
  {
    game: GAME_NAMES.RETRATO_FALADO,
    type: 'drawing',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
];

export const WORDS_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.CRUZA_PALAVRAS,
    type: 'words',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
  {
    game: GAME_NAMES.UE_SO_ISSO,
    type: 'words',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
  {
    game: GAME_NAMES.LABIRINTO_SECRETO,
    type: 'words',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
];

export const JUDGING_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.NAMORO_OU_AMIZADE,
    type: 'judging',
    nsfw: true,
    variant: 'default',
    weight: 1,
  },
  {
    game: GAME_NAMES.TESTEMUNHA_OCULAR,
    type: 'judging',
    nsfw: true,
    variant: 'default',
    weight: 1,
  },
  {
    game: GAME_NAMES.TA_NA_CARA,
    type: 'judging',
    nsfw: true,
    variant: 'default',
    weight: 1,
  },
];

export const SPECIAL_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.ONDA_TELEPATICA,
    type: 'special',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
  {
    game: GAME_NAMES.COMUNICACAO_ALIENIGENA,
    type: 'special',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
  {
    game: GAME_NAMES.MENTE_COLETIVA,
    type: 'special',
    nsfw: false,
    variant: 'default',
    weight: 1,
  },
];

export const UNPOPULAR_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.CRIMES_HEDIONDOS,
    type: 'unpopular',
    nsfw: false,
    variant: 'weapon',
    weight: 2,
  },
  {
    game: GAME_NAMES.CRIMES_HEDIONDOS,
    type: 'unpopular',
    nsfw: false,
    variant: 'evidence',
    weight: 2,
  },
  {
    game: GAME_NAMES.VAMOS_AO_CINEMA,
    type: 'unpopular',
    nsfw: false,
    variant: 'default',
    weight: 4,
  },
  {
    game: GAME_NAMES.NA_RUA_DO_MEDO,
    type: 'unpopular',
    nsfw: false,
    variant: 'default',
    weight: 2,
  },
  {
    game: GAME_NAMES.QUEM_NAO_MATA,
    type: 'unpopular',
    nsfw: false,
    variant: 'kill',
    weight: 1,
  },
];

export const WINNING_CONDITION = {
  MOST_VOTED: 'MOST_VOTED',
  STRING_MATCH: 'STRING_MATCH',
};

export const MINI_GAMES_LIST: PossibleTask[] = [
  {
    game: GAME_NAMES.ARTE_RUIM,
    condition: WINNING_CONDITION.MOST_VOTED,
    variants: ['cards', 'drawings'],
  },
  {
    game: GAME_NAMES.CONTADORES_HISTORIAS,
    condition: WINNING_CONDITION.MOST_VOTED,
  },
  {
    game: GAME_NAMES.CRIMES_HEDIONDOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    variants: ['weapon', 'evidence'],
  },
  {
    game: GAME_NAMES.CRUZA_PALAVRAS,
    condition: WINNING_CONDITION.MOST_VOTED,
  },
  {
    game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    variants: ['impostor', 'detective'],
  },
  // {
  //   game: GAME_NAMES.ESPIAO_ENTRE_NOS,
  //   condition: WINNING_CONDITION.STRING_MATCH,
  // },
  {
    game: GAME_NAMES.GALERIA_DE_SONHOS,
    condition: WINNING_CONDITION.MOST_VOTED,
  },
  // {
  //   game: GAME_NAMES.MENTE_COLETIVA,
  //   condition: WINNING_CONDITION.STRING_MATCH,
  // },
  // {
  //   game: GAME_NAMES.NA_RUA_DO_MEDO,
  //   condition: WINNING_CONDITION.MOST_VOTED,
  //   variants: ['kids', 'house'],
  // },
  {
    game: GAME_NAMES.ONDA_TELEPATICA,
    condition: WINNING_CONDITION.MOST_VOTED,
  },
  {
    game: GAME_NAMES.POLEMICA_DA_VEZ,
    condition: WINNING_CONDITION.MOST_VOTED,
  },
  {
    game: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    variants: ['normal', 'hard'],
  },
  {
    game: GAME_NAMES.SUPER_CAMPEONATO,
    condition: WINNING_CONDITION.MOST_VOTED,
  },
  {
    game: GAME_NAMES.TESTEMUNHA_OCULAR,
    condition: WINNING_CONDITION.MOST_VOTED,
    variants: ['suspects', 'answer'],
    nsfw: true,
  },
  // {
  //   game: GAME_NAMES.UE_SO_ISSO,
  //   condition: WINNING_CONDITION.STRING_MATCH,
  // },
  {
    game: GAME_NAMES.DILEMA_DOS_ESQUIADORES,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
  {
    game: GAME_NAMES.QUEM_NAO_MATA,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
    variants: [
      'kill',
      // 'gold'
    ],
  },
  {
    game: GAME_NAMES.FILEIRA_DE_FATOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
  {
    game: GAME_NAMES.NAMORO_OU_AMIZADE,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
    nsfw: true,
  },
  {
    game: GAME_NAMES.CAMINHOS_MAGICOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
  {
    game: GAME_NAMES.PALHETA_DE_CORES,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
  {
    game: GAME_NAMES.VAMOS_AO_CINEMA,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
];
