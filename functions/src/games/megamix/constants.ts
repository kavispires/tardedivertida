// Types
import type { PartyTrackCandidate, TrackCandidate } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';

/**
 * Phase identifiers used by the `megamix` engine.
 */
export const MEGAMIX_PHASES = {
  SETUP: 'SETUP',
  SEEDING: 'SEEDING',
  TRACK: 'TRACK',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `megamix` engine.
 */
export const MEGAMIX_ACTIONS = {
  SUBMIT_SEEDS: 'SUBMIT_SEEDS',
  SUBMIT_TRACK_ANSWER: 'SUBMIT_TRACK_ANSWER',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 25,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 15;

/**
 * Identifiers of the teams used by this game.
 */
export const SIDES = {
  LOSER: 'L',
  WINNER: 'W',
} as const;

/**
 * Points awarded for VIP membership changes and catch-up adjustments.
 */
export const SCORING_POINTS = {
  JOIN_VIP: 1,
  TIED_WITH_VIP: 1,
  ALREADY_ON_VIP: 2,
  CATCHUP_BONUS: 2,
  CATCHUP_PENALTY: -2,
} as const;

/**
 * Track candidates for the images category, including their variants and selection settings.
 */
export const IMAGES_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    type: 'images',
    nsfw: false,
    variant: 'impostor',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    type: 'images',
    nsfw: false,
    variant: 'detective',
    weight: 2,
    verified: true,
  },
  {
    game: GAME_NAMES.GALERIA_DE_SONHOS,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 2,
  },
  {
    game: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 2,
    verified: true,
  },
  {
    game: GAME_NAMES.CONTADORES_HISTORIAS,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 1,
    needsSeeding: true,
    verified: true,
  },
  {
    game: GAME_NAMES.NAO_SOU_ROBO,
    type: 'images',
    nsfw: false,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
];

/**
 * Track candidates for the characters category, including their variants and selection settings.
 */
export const CHARACTERS_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.SUPER_CAMPEONATO,
    type: 'characters',
    nsfw: false,
    variant: 'default',
    weight: 2,
    verified: true,
  },
  {
    game: GAME_NAMES.QUEM_SOU_EU,
    type: 'characters',
    nsfw: false,
    variant: 'default',
    weight: 2,
    verified: true,
  },
  {
    game: GAME_NAMES.PALHETA_DE_CORES,
    type: 'characters',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
];

/**
 * Track candidates for the drawing category, including their variants and selection settings.
 */
export const DRAWING_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.ARTE_RUIM,
    type: 'drawing',
    nsfw: false,
    variant: 'cards',
    weight: 2,
    needsSeeding: true,
    verified: true,
  },
  {
    game: GAME_NAMES.ARTE_RUIM,
    type: 'drawing',
    nsfw: false,
    variant: 'drawings',
    weight: 1,
    needsSeeding: true,
    verified: true,
  },
  {
    game: GAME_NAMES.RETRATO_FALADO,
    type: 'drawing',
    nsfw: false,
    variant: 'default',
    weight: 1,
    needsSeeding: true,
    verified: true,
  },
  {
    game: GAME_NAMES.SINAIS_DE_ALERTA,
    type: 'drawing',
    nsfw: false,
    variant: 'default',
    weight: 1,
    needsSeeding: true,
    disabled: true,
  },
];

/**
 * Track candidates for the people category, including their variants and selection settings.
 */
export const PEOPLE_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.TESTEMUNHA_OCULAR,
    type: 'people',
    nsfw: true,
    variant: 'default',
    weight: 2,
    verified: true,
  },
  {
    game: GAME_NAMES.TA_NA_CARA,
    type: 'people',
    nsfw: false,
    variant: 'default',
    weight: 2,
    verified: true,
  },
  {
    game: GAME_NAMES.TESTE_DE_ELENCO,
    type: 'people',
    nsfw: true,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
];

/**
 * Track candidates for the icons category, including their variants and selection settings.
 */
export const ICONS_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.COMUNICACAO_ALIENIGENA,
    type: 'icons',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.DUETOS,
    type: 'icons',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.METALINGUAGEM,
    type: 'icons',
    nsfw: false,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
  {
    game: GAME_NAMES.TEORIA_DE_CONJUNTOS,
    type: 'icons',
    nsfw: false,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
  {
    game: GAME_NAMES.QUAL_QUESITO,
    type: 'icons',
    nsfw: false,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
];

/**
 * Track candidates for the words category, including their variants and selection settings.
 */
export const WORDS_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.CRUZA_PALAVRAS,
    type: 'words',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.UE_SO_ISSO,
    type: 'words',
    nsfw: false,
    variant: 'default',
    weight: 1,
    needsSeeding: true,
    verified: true,
  },
  {
    game: GAME_NAMES.COLEGAS_DE_QUARTO,
    type: 'words',
    nsfw: false,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
];

/**
 * Track candidates for the pattern category, including their variants and selection settings.
 */
export const PATTERN_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.CONTROLE_DE_ESTOQUE,
    type: 'pattern',
    nsfw: false,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
  {
    game: GAME_NAMES.SENSO_LITERARIO,
    type: 'pattern',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.NA_FILA_DO_BANCO,
    type: 'pattern',
    nsfw: false,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
];

/**
 * Track candidates for the consensus category, including their variants and selection settings.
 */
export const CONSENSUS_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.VAMOS_AO_CINEMA,
    type: 'consensus',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.PLANEJAMENTO_URBANO,
    type: 'consensus',
    nsfw: false,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
  {
    game: GAME_NAMES.MEDIDAS_NAO_EXATAS,
    type: 'consensus',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.MESMICE,
    type: 'consensus',
    nsfw: false,
    variant: 'default',
    weight: 1,
    disabled: true,
  },
];

/**
 * Track candidates for the input category, including their variants and selection settings.
 */
export const INPUT_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.LABIRINTO_SECRETO,
    type: 'input',
    nsfw: false,
    variant: 'default',
    weight: 1,
    needsSeeding: true,
    verified: true,
  },
  {
    game: GAME_NAMES.ONDA_TELEPATICA,
    type: 'input',
    nsfw: false,
    variant: 'default',
    weight: 1,
    needsSeeding: true,
    verified: true,
  },
  {
    game: GAME_NAMES.MENTE_COLETIVA,
    type: 'input',
    nsfw: false,
    variant: 'default',
    weight: 2,
    needsSeeding: true,
    verified: true,
  },
];

/**
 * Track candidates for the opinions category, including their variants and selection settings.
 */
export const OPINIONS_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.POLEMICA_DA_VEZ,
    type: 'opinions',
    nsfw: false,
    variant: 'default',
    weight: 1,
    needsSeeding: true,
    verified: true,
  },
  {
    game: GAME_NAMES.FILEIRA_DE_FATOS,
    type: 'opinions',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.ESQUIADORES,
    type: 'opinions',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
];

/**
 * Track candidates for the special category, including their variants and selection settings.
 */
export const SPECIAL_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.CRIMES_HEDIONDOS,
    type: 'special',
    nsfw: false,
    variant: 'weapon',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.CRIMES_HEDIONDOS,
    type: 'special',
    nsfw: false,
    variant: 'evidence',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.NA_RUA_DO_MEDO,
    type: 'special',
    nsfw: false,
    variant: 'default',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.QUEM_NAO_MATA,
    type: 'special',
    nsfw: false,
    variant: 'kill',
    weight: 1,
    verified: true,
  },
  {
    game: GAME_NAMES.BOMBA_RELOGIO,
    type: 'special',
    nsfw: false,
    variant: 'kill',
    weight: 1,
    disabled: true,
  },
];

/**
 * Track candidates for the other category, including their variants and selection settings.
 */
export const OTHER_TRACKS: TrackCandidate[] = [
  {
    game: GAME_NAMES.NAMORO_OU_AMIZADE,
    type: 'other',
    nsfw: true,
    variant: 'default',
    weight: 1,
    verified: true,
  },
];

/**
 * Identifiers of the custom party-mode track implementations.
 */
export const PARTY_GAMES = {
  CUSTOM_THIS_THAT: 'CUSTOM_THIS_THAT',
  CUSTOM_BEST_OF_THREE: 'CUSTOM_BEST_OF_THREE',
  WHO_SAID_THIS: 'WHO_SAID_THIS',
};

/**
 * Display-name lookup keys for the custom party-mode games.
 */
export const PARTY_GAMES_NAMES = {
  [PARTY_GAMES.CUSTOM_THIS_THAT]: 'megamix-this-that',
  [PARTY_GAMES.CUSTOM_BEST_OF_THREE]: 'megamix-best-of-three',
  [PARTY_GAMES.WHO_SAID_THIS]: 'megamix-who-said-this',
};

/**
 * Track candidates for the party category, including their variants and selection settings.
 */
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
        en: 'Food you dislike but others generally like',
        pt: 'Comida que você não gosta, mas que outros geralmente gostam',
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
        en: 'Favorite object that you have but others might not find it interesting',
        pt: 'Objeto favorito que você possui, mas que outros podem não achar interessante',
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
        en: 'Favorite sport you prefer watching over playing',
        pt: 'Esporte favorito que você prefere assistir do que praticar',
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
        en: 'A skill you have that would make others surprised',
        pt: 'Uma habilidade que você tem que surpreenderia os outros',
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
        en: 'A unique hobby you have that others might not know about',
        pt: 'Hobby único que outros podem não conhecer',
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
        en: "Write a curious fact about yourself that others generally don't know. It can be something related to your personality, your past, or even a secret talent. Try to be gender neutral.",
        pt: 'Um fato curioso sobre você que os outros geralmente não sabem pode ser algo relacionado à sua personalidade, seu passado ou até mesmo um talento secreto. Tente ser neutro em relação ao gênero.',
      },
    },
  },
];

/**
 * Winning-condition identifiers used to evaluate track results.
 */
export const WINNING_CONDITION = {
  MOST_VOTED: 'MOST_VOTED',
  STRING_MATCH: 'STRING_MATCH',
};
