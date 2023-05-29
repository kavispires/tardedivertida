import { GAME_NAMES } from '../../utils/constants';
import { PossibleTask } from './types';

export const MEGAMIX_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  SEEDING: 'SEEDING',
  TASK: 'TASK',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
};

export const MEGAMIX_ACTIONS = {
  SUBMIT_SEEDS: 'SUBMIT_SEEDS',
  SUBMIT_TASK: 'SUBMIT_TASK',
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
