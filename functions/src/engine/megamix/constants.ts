import { GAME_NAMES } from '../../utils/constants';
import { PartyTrackCandidate, TrackCandidate } from './types';

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
  SOLITARY_VIP: 'SOLITARY_VIP',
  SOLITARY_LOSER: 'SOLITARY_LOSER',
  LONGEST_VIP: 'LONGEST_VIP',
  LONGEST_LOSER: 'LONGEST_LOSER',
  MOST_SWITCHED: 'MOST_SWITCHED',
  LEAST_SWITCHED: 'LEAST_SWITCHED',
  MOST_JOIN: 'MOST_JOIN',
  MOST_LEFT: 'MOST_LEFT',
};

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 25,
};

export const TOTAL_ROUNDS = 15;

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
    weight: 3,
  },
  {
    game: GAME_NAMES.GALERIA_DE_SONHOS,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 4,
  },
  {
    game: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 4,
  },
  {
    game: GAME_NAMES.CONTADORES_HISTORIAS,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 2,
    needsSeeding: true,
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
    needsSeeding: true,
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
    needsSeeding: true,
  },
  {
    game: GAME_NAMES.ARTE_RUIM,
    type: 'drawing',
    nsfw: false,
    variant: 'drawings',
    weight: 1,
    needsSeeding: true,
  },
  {
    game: GAME_NAMES.RETRATO_FALADO,
    type: 'drawing',
    nsfw: false,
    variant: 'default',
    weight: 1,
    needsSeeding: true,
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
    weight: 2,
    needsSeeding: true,
  },
  {
    game: GAME_NAMES.LABIRINTO_SECRETO,
    type: 'words',
    nsfw: false,
    variant: 'default',
    weight: 1,
    needsSeeding: true,
  },
  {
    game: GAME_NAMES.MENTE_COLETIVA,
    type: 'special',
    nsfw: false,
    variant: 'default',
    weight: 2,
    needsSeeding: true,
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
    needsSeeding: true,
  },
  {
    game: GAME_NAMES.COMUNICACAO_ALIENIGENA,
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

export const PARTY_GAMES = {
  CUSTOM_THIS_THAT: 'CUSTOM_THIS_THAT',
  CUSTOM_BEST_OF_THREE: 'CUSTOM_BEST_OF_THREE',
  WHO_SAID_THIS: 'WHO_SAID_THIS',
};

export const PARTY_GAMES_NAMES = {
  [PARTY_GAMES.CUSTOM_THIS_THAT]: 'megamix-this-that',
  [PARTY_GAMES.CUSTOM_BEST_OF_THREE]: 'megamix-best-of-three',
  [PARTY_GAMES.WHO_SAID_THIS]: 'megamix-who-said-this',
};

export const PARTY_TRACKS: PartyTrackCandidate[] = [
  {
    game: PARTY_GAMES.CUSTOM_THIS_THAT,
    type: 'party',
    nsfw: false,
    variant: 'good-food',
    weight: 1,
    card: {
      id: 'good-food',
      text: {
        en: 'Favorite food',
        pt: 'Comida favorita',
      },
    },
  },
  {
    game: PARTY_GAMES.CUSTOM_THIS_THAT,
    type: 'party',
    nsfw: false,
    variant: 'bad-food',
    weight: 1,
    card: {
      id: 'bad-food',
      text: {
        en: 'Food you dislike',
        pt: 'Comida que você não gosta',
      },
    },
  },
  {
    game: PARTY_GAMES.CUSTOM_THIS_THAT,
    type: 'party',
    nsfw: false,
    variant: 'object',
    weight: 1,
    card: {
      id: 'object',
      text: {
        en: 'Favorite object',
        pt: 'Objeto favorito',
      },
    },
  },
  {
    game: PARTY_GAMES.CUSTOM_THIS_THAT,
    type: 'party',
    nsfw: false,
    variant: 'sport',
    weight: 1,
    card: {
      id: 'sport',
      text: {
        en: 'Favorite sport',
        pt: 'Esporte favorito',
      },
    },
  },
  {
    game: PARTY_GAMES.CUSTOM_BEST_OF_THREE,
    type: 'party',
    nsfw: false,
    variant: 'skill',
    weight: 1,
    card: {
      id: 'skill',
      text: {
        en: 'A skill you have',
        pt: 'Uma habilidade que você tem',
      },
    },
  },
  {
    game: PARTY_GAMES.CUSTOM_BEST_OF_THREE,
    type: 'party',
    nsfw: false,
    variant: 'hobby',
    weight: 1,
    card: {
      id: 'hobby',
      text: {
        en: 'A hobby',
        pt: 'Hobby favorito',
      },
    },
  },
  {
    game: PARTY_GAMES.WHO_SAID_THIS,
    type: 'party',
    nsfw: false,
    variant: 'fact',
    weight: 1,
    card: {
      id: 'fact',
      text: {
        en: 'A fact about yourself',
        pt: 'Um fato sobre você',
      },
    },
  },
];

export const WINNING_CONDITION = {
  MOST_VOTED: 'MOST_VOTED',
  STRING_MATCH: 'STRING_MATCH',
};
