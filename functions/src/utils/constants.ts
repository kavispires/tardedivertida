export const AVATAR_IDS = new Array(50).fill(0).map((i, index) => `${i + index}`);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const GAMES = [
  {
    code: 'A',
    key: 'ARTE_RUIM',
    collection: 'arte-ruim',
  },
  {
    code: 'B',
    key: 'BOMBA_RELOGIO',
    collection: 'bomba-relogio',
  },
  {
    code: 'C',
    key: 'CONTADORES_HISTORIAS',
    collection: 'contadores-historias',
  },
  {
    code: 'D',
    key: 'DETETIVES_IMAGINATIVOS',
    collection: 'detetives-imaginativos',
  },
  {
    code: 'E',
    key: 'ESPIAO_ENTRE_NOS',
    collection: 'espiao-entre-nos',
  },
  {
    code: 'G',
    key: 'GALERIA_DE_SONHOS',
    collection: 'galeria-de-sonhos',
  },
  {
    code: 'H',
    key: 'CRIMES_HEDIONDOS',
    collection: 'crimes-hediondos',
  },
  {
    code: 'I',
    key: 'PORTA_DOS_DESESPERADOS',
    collection: 'porta-dos-desesperados',
  },
  {
    code: 'K',
    key: 'PALHETA_DE_CORES',
    collection: 'palheta-de-cores',
  },
  {
    code: 'L',
    key: 'LINHAS_CRUZADAS',
    collection: 'linhas-cruzadas',
  },
  {
    code: 'M',
    key: 'MENTE_COLETIVA',
    collection: 'mente-coletiva',
  },
  {
    code: 'N',
    key: 'NA_RUA_DO_MEDO',
    collection: 'na-rua-do-medo',
  },
  {
    code: 'O',
    key: 'ONDA_TELEPATICA',
    collection: 'onda-telepatica',
  },
  {
    code: 'P',
    key: 'POLEMICA_DA_VEZ',
    collection: 'polemica-da-vez',
  },
  {
    code: 'Q',
    key: 'QUEM_NAO_MATA',
    collection: 'quem-nao-mata',
  },
  {
    code: 'R',
    key: 'RETRATO_FALADO',
    collection: 'retrato-falado',
  },
  {
    code: 'S',
    key: 'SONHOS_PESADELOS',
    collection: 'sonhos-pesadelos',
  },
  {
    code: 'T',
    key: 'TESTEMUNHA_OCULAR',
    collection: 'testemunha-ocular',
  },
  {
    code: 'U',
    key: 'UE_SO_ISSO',
    collection: 'ue-so-isso',
  },
  {
    code: 'V',
    key: 'VENDAVAL_DE_PALPITE',
    collection: 'vendaval-de-palpite',
  },
  {
    code: 'W',
    key: 'SUPER_CAMPEONATO',
    collection: 'super-campeonato',
  },
  {
    code: 'X',
    key: 'CRUZA_PALAVRAS',
    collection: 'cruza-palavras',
  },
  {
    code: 'Y',
    key: 'TREVO_DA_SORTE',
    collection: 'trevo-da-sorte',
  },
];

const generateGameCodes = (): StringDictionary =>
  GAMES.reduce((acc, entry) => {
    acc[entry.code] = entry.code;
    return acc;
  }, {});

const generateGameKeys = (): StringDictionary =>
  GAMES.reduce((acc, entry) => {
    acc[entry.key] = entry.key;
    return acc;
  }, {});

const generateGameCollections = (): StringDictionary =>
  GAMES.reduce((acc, entry) => {
    acc[entry.key] = entry.collection;
    return acc;
  }, {});

export const GAME_CODES = generateGameCodes();
export const GAME_KEYS = generateGameKeys();
export const GAME_COLLECTIONS = generateGameCollections();

export const GLOBAL_USED_DOCUMENTS = {
  ARTE_RUIM: 'usedArteRuimCards',
  MENTE_COLETIVA: 'usedMenteColetivaQuestions',
  ONDA_TELEPATICA: 'usedOndaTelepaticaCategories',
  RETRATO_FALADO: 'usedRetratoFaladoCards',
  TESTEMUNHA_OCULAR: 'usedTestemunhaOcularCards',
  SUPER_CAMPEONATO_CHALLENGES: 'usedSuperCampeonatoChallenges',
  SUPER_CAMPEONATO_CONTENDERS: 'usedSuperCampeonatoContenders',
};

export const TDR_RESOURCES = {
  ADJECTIVES: 'adjectives',
  ARTE_RUIM_CARDS: 'arte-ruim-cards',
  ARTE_RUIM_GROUPS: 'arte-ruim-groups',
  ARTE_RUIM_PAIRS: 'arte-ruim-pairs',
  CATEGORIES: 'categories',
  CHALLENGES: 'challenges',
  CHARACTERS: 'characters',
  CONTENDERS: 'contenders', // dual language
  CRIME_TILES: 'crime-tiles', // dual language
  GROUP_QUESTIONS: 'group-questions',
  NAMING_PROMPTS: 'naming-prompts',
  OPPOSING_IDEAS: 'opposing-ideas',
  SINGLE_WORDS: 'single-words',
  SPY_LOCATIONS: 'spy-locations',
  SPY_QUESTIONS: 'spy-questions',
  TESTIMONY_QUESTIONS: 'testimony-questions',
  THEMES: 'themes',
  TOPICS: 'topics',
  WORDS_1: 'galeria-de-sonhos',
  WORDS_2: 'linhas-cruzadas',
};

export const SEPARATOR = ';;';

export const USED_GAME_IDS = 'usedGameIds';

export const DOUBLE_ROUNDS_THRESHOLD = 6;

export const NPC = 'NPC';
