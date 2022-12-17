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
  MAX: 10,
};

export const TOTAL_ROUNDS = 15;

export const WINNING_CONDITION = {
  MOST_VOTED: 'MOST_VOTED',
  STRING_MATCH: 'STRING_MATCH',
};

export const MINI_GAMES_LIST: PossibleTask[] = [
  {
    game: GAME_NAMES.ARTE_RUIM,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.CONTADORES_HISTORIAS,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.CRIMES_HEDIONDOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.CRUZA_PALAVRAS,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.ESPIAO_ENTRE_NOS,
    condition: WINNING_CONDITION.STRING_MATCH,
    upcoming: false,
  },
  {
    game: GAME_NAMES.GALERIA_DE_SONHOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.MENTE_COLETIVA,
    condition: WINNING_CONDITION.STRING_MATCH,
    upcoming: false,
  },
  {
    game: GAME_NAMES.NA_RUA_DO_MEDO,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.ONDA_TELEPATICA,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.POLEMICA_DA_VEZ,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.SUPER_CAMPEONATO,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.TESTEMUNHA_OCULAR,
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: false,
  },
  {
    game: GAME_NAMES.UE_SO_ISSO,
    condition: WINNING_CONDITION.STRING_MATCH,
    upcoming: false,
  },

  {
    game: 'DILEMA_DO_ESQUIADOR',
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
  {
    game: 'MATA_MATA',
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
  {
    game: 'FILEIRA_DE_FATOS',
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
  {
    game: 'NAMORO_OU_AMIZADE',
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
  {
    game: 'CAMINHOS_MAGICOS',
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
  {
    game: 'PALHETA_DE_CORES',
    condition: WINNING_CONDITION.MOST_VOTED,
    upcoming: true,
  },
];
