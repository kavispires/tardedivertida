export const AVATAR_IDS = new Array(50).fill(0).map((i, index) => `${i + index}`);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LETTERS_EN = 'ABCDEFGHIJKLM';
export const LETTERS_PT = 'NOPQRSTUVWXYZ';

const GAMES = [
  {
    name: 'arte-ruim',
    code: 'A',
    key: 'ARTE_RUIM',
  },
  {
    name: 'bomba-relogio',
    code: 'B',
    key: 'BOMBA_RELOGIO',
  },
  {
    name: 'caminhos-magicos',
    code: 'C',
    key: 'CAMINHOS_MAGICOS',
  },
  {
    name: 'contadores-historias',
    code: 'C',
    key: 'CONTADORES_HISTORIAS',
  },
  {
    name: 'crimes-hediondos',
    code: 'H',
    key: 'CRIMES_HEDIONDOS',
  },
  {
    name: 'cruza-palavras',
    code: 'X',
    key: 'CRUZA_PALAVRAS',
  },
  {
    name: 'detetives-imaginativos',
    code: 'D',
    key: 'DETETIVES_IMAGINATIVOS',
  },
  {
    name: 'dilema-dos-esquiadores',
    code: 'D',
    key: 'DILEMA_DOS_ESQUIADORES',
  },
  {
    name: 'espiao-entre-nos',
    code: 'E',
    key: 'ESPIAO_ENTRE_NOS',
  },
  {
    name: 'fileira-de-fatos',
    code: 'F',
    key: 'FILEIRA_DE_FATOS',
  },
  {
    name: 'galeria-de-sonhos',
    code: 'G',
    key: 'GALERIA_DE_SONHOS',
  },
  {
    name: 'linhas-cruzadas',
    code: 'L',
    key: 'LINHAS_CRUZADAS',
  },
  {
    name: 'megamix',
    code: 'Z',
    key: 'MEGAMIX',
  },
  {
    name: 'mente-coletiva',
    code: 'M',
    key: 'MENTE_COLETIVA',
  },
  {
    name: 'na-rua-do-medo',
    code: 'N',
    key: 'NA_RUA_DO_MEDO',
  },
  {
    name: 'namoro-ou-amizade',
    code: 'M',
    key: 'NAMORO_OU_AMIZADE',
  },
  {
    name: 'onda-telepatica',
    code: 'O',
    key: 'ONDA_TELEPATICA',
  },
  {
    name: 'palheta-de-cores',
    code: 'K',
    key: 'PALHETA_DE_CORES',
  },
  {
    name: 'polemica-da-vez',
    code: 'P',
    key: 'POLEMICA_DA_VEZ',
  },
  {
    name: 'porta-dos-desesperados',
    code: 'I',
    key: 'PORTA_DOS_DESESPERADOS',
  },
  {
    name: 'quem-nao-mata',
    code: 'Q',
    key: 'QUEM_NAO_MATA',
  },
  {
    name: 'retrato-falado',
    code: 'R',
    key: 'RETRATO_FALADO',
  },
  {
    name: 'sonhos-pesadelos',
    code: 'S',
    key: 'SONHOS_PESADELOS',
  },
  {
    name: 'super-campeonato',
    code: 'W',
    key: 'SUPER_CAMPEONATO',
  },
  {
    name: 'testemunha-ocular',
    code: 'T',
    key: 'TESTEMUNHA_OCULAR',
  },
  {
    name: 'trevo-da-sorte',
    code: 'Y',
    key: 'TREVO_DA_SORTE',
  },
  {
    name: 'ue-so-isso',
    code: 'U',
    key: 'UE_SO_ISSO',
  },
  {
    name: 'vendaval-de-palpite',
    code: 'V',
    key: 'VENDAVAL_DE_PALPITE',
  },
];

const generateGameCodes = (): StringDictionary =>
  GAMES.reduce((acc, entry) => {
    acc[entry.name] = entry.code;
    return acc;
  }, {});

const generateGameKeys = (): StringDictionary =>
  GAMES.reduce((acc, entry) => {
    acc[entry.key] = entry.key;
    return acc;
  }, {});

const generateGameCollections = (): StringDictionary =>
  GAMES.reduce((acc, entry) => {
    acc[entry.key] = entry.name;
    return acc;
  }, {});

export const GAME_CODES = generateGameCodes();
export const GAME_KEYS = generateGameKeys();
export const GAME_NAMES = generateGameCollections();

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
  DATING_CANDIDATE: 'dating-candidate',
  DILEMMAS: 'dilemmas',
  GROUP_QUESTIONS: 'group-questions',
  NAMING_PROMPTS: 'naming-prompts',
  OPPOSING_IDEAS: 'opposing-ideas',
  QUANTITATIVE_QUESTIONS: 'quantitative-questions',
  SINGLE_WORDS: 'single-words',
  SPY_LOCATIONS: 'spy-locations',
  SPY_QUESTIONS: 'spy-questions',
  TESTIMONY_QUESTIONS: 'testimony-questions',
  THEMES: 'themes',
  TOPICS: 'topics',
  WORDS_1: 'galeria-de-sonhos',
  WORDS_2: 'linhas-cruzadas',
  WORDS_3: 'caminhos-magicos',
};

export const SEPARATOR = ';;';

export const USED_GAME_IDS = 'usedGameIds';

export const DOUBLE_ROUNDS_THRESHOLD = 6;

export const NPC = 'NPC';
