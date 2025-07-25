export const AVATAR_IDS = new Array(50).fill(0).map((i, index) => `${i + index}`);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LETTERS_EN = 'ABCDEFGHIJKLM';
export const LETTERS_PT = 'NOPQRSTUVWXYZ';

const GAMES = [
  {
    name: 'adedanhx',
    code: 'K',
    key: 'ADEDANHX',
  },
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
    name: 'comunicacao-alienigena',
    code: 'C',
    key: 'COMUNICACAO_ALIENIGENA',
  },
  {
    name: 'comunicacao-duo',
    code: 'D',
    key: 'COMUNICACAO_DUO',
  },
  {
    name: 'contadores-historias',
    code: 'C',
    key: 'CONTADORES_HISTORIAS',
  },
  {
    name: 'controle-de-estoque',
    code: 'C',
    key: 'CONTROLE_DE_ESTOQUE',
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
    name: 'duetos',
    code: 'D',
    key: 'DUETOS',
  },
  {
    name: 'espiao-entre-nos',
    code: 'E',
    key: 'ESPIAO_ENTRE_NOS',
  },
  {
    name: 'esquiadores',
    code: 'E',
    key: 'ESQUIADORES',
  },
  {
    name: 'fileira-de-fatos',
    code: 'F',
    key: 'FILEIRA_DE_FATOS',
  },
  {
    name: 'fofoca-quente',
    code: 'F',
    key: 'FOFOCA_QUENTE',
  },
  {
    name: 'galeria-de-sonhos',
    code: 'G',
    key: 'GALERIA_DE_SONHOS',
  },
  {
    name: 'idade-da-preda',
    code: 'I',
    key: 'IDADE_DA_PREDA',
  },
  {
    name: 'labirinto-secreto',
    code: 'Z',
    key: 'LABIRINTO_SECRETO',
  },
  {
    name: 'linhas-cruzadas',
    code: 'L',
    key: 'LINHAS_CRUZADAS',
  },
  {
    name: 'medidas-nao-exatas',
    code: 'M',
    key: 'MEDIDAS_NAO_EXATAS',
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
    name: 'metalinguagem',
    code: 'L',
    key: 'METALINGUAGEM',
  },
  {
    name: 'mesmice',
    code: 'J',
    key: 'MESMICE',
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
    name: 'nao-sou-robo',
    code: 'N',
    key: 'NAO_SOU_ROBO',
  },
  {
    name: 'onda-telepatica',
    code: 'O',
    key: 'ONDA_TELEPATICA',
  },
  {
    name: 'planejamento-urbano',
    code: 'U',
    key: 'PLANEJAMENTO_URBANO',
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
    name: 'qual-quesito',
    code: 'Q',
    key: 'QUAL_QUESITO',
  },
  {
    name: 'quem-nao-mata',
    code: 'Q',
    key: 'QUEM_NAO_MATA',
  },
  {
    name: 'quem-sou-eu',
    code: 'Q',
    key: 'QUEM_SOU_EU',
  },
  {
    name: 'retrato-falado',
    code: 'R',
    key: 'RETRATO_FALADO',
  },
  {
    name: 'sinais-de-alerta',
    code: 'S',
    key: 'SINAIS_DE_ALERTA',
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
    name: 'ta-na-cara',
    code: 'T',
    key: 'TA_NA_CARA',
  },
  {
    name: 'teoria-de-conjuntos',
    code: 'Q',
    key: 'TEORIA_DE_CONJUNTOS',
  },
  {
    name: 'testemunha-ocular',
    code: 'T',
    key: 'TESTEMUNHA_OCULAR',
  },
  {
    name: 'teste-de-elenco',
    code: 'T',
    key: 'TESTE_DE_ELENCO',
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
    name: 'vamos-ao-cinema',
    code: 'V',
    key: 'VAMOS_AO_CINEMA',
  },
  {
    name: 'vendaval-de-palpite',
    code: 'V',
    key: 'VENDAVAL_DE_PALPITE',
  },
  {
    name: 'vice-campeao',
    code: 'V',
    key: 'VICE_CAMPEAO',
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
  ADJECTIVES: 'usedAdjectives',
  ALIEN_ITEMS: 'usedAlienItems',
  ARTE_RUIM: 'usedArteRuimCards',
  CHALLENGES: 'usedChallenges',
  CONTENDERS: 'usedContenders',
  GROUP_QUESTIONS: 'usedGroupQuestions',
  IMAGE_CARDS: 'usedImageCards',
  ITEMS: 'usedItems',
  MONSTERS: 'usedMonsters',
  MOVIES: 'usedMoviesAndReviews',
  MURDER_OBJECTS: 'usedMurderObjects',
  OPPOSING_IDEAS: 'usedOpposingIdeas',
  SINGLE_WORDS: 'usedSingleWords',
  SUSPECTS: 'usedSuspects',
  TESTIMONY_QUESTIONS: 'usedTestimonyQuestions',
};

export const DATA_DOCUMENTS = {
  CONTENDERS_GLYPHS: 'contendersGlyphs',
  ALIEN_ITEMS: 'alienItems',
  CARDS_CLUES_EN: 'cardsCluesEN',
  CARDS_CLUES_PT: 'cardsCluesPT',
  IMAGE_CARDS_CLUES_EN: 'imageCardsCluesEN',
  IMAGE_CARDS_CLUES_PT: 'imageCardsCluesPT',
  IMAGE_CARDS_RELATIONSHIPS: 'imageCardsRelationships',
  OPPOSING_IDEAS_CLUES: 'opposingIdeasClues',
  SUFFIX_COUNTS: 'suffixCounts',
  SUSPECT_ANSWERS: 'suspectAnswers',
  DRAWINGS: 'drawings', // requires language suffix
  MONSTER_DRAWINGS: 'monsterDrawings',
  PAIRS: 'pairs',
  SIGNS: 'signs', // requires language suffix
};

export const TDR_RESOURCES = {
  ADJECTIVES: 'adjectives',
  ALIEN_ITEMS: 'alien-items', // dual-language
  ARTE_RUIM_CARDS: 'arte-ruim-cards',
  ARTE_RUIM_GROUPS: 'arte-ruim-groups',
  ARTE_RUIM_PAIRS: 'arte-ruim-pairs',
  CATEGORIES: 'categories',
  CHALLENGES: 'challenges',
  CHARACTERS: 'characters',
  CHOICES: 'choices',
  CITY_LOCATIONS: 'city-locations', // dual-language
  COLORS: 'colors',
  CONCEPTS: 'concepts',
  CONTENDERS: 'contenders', // dual-language
  CRIME_EVIDENCE: 'crime-evidence', // dual-language
  CRIME_LOCATIONS: 'crime-locations', // dual-language
  CRIME_SCENES: 'crime-scenes', // dual-language
  CRIME_VICTIMS: 'crime-victims', // dual-language
  CRIME_WEAPONS: 'crime-weapons', // dual-language
  DATING_CANDIDATE: 'dating-candidate',
  DATING_CANDIDATE_BODIES: 'dating-candidate-bodies', // dual-language
  DATING_CANDIDATE_HEADS: 'dating-candidate-heads', // dual-language
  DESCRIPTORS: 'descriptors',
  DIAGRAM_TOPICS: 'diagram-topics',
  DILEMMAS: 'dilemmas',
  DRAWING_WORDS: 'drawing-words',
  EMOTIONS: 'emotions',
  GROUP_QUESTIONS: 'group-questions',
  ITEMS: 'items', // dual-language
  ITEMS_ATTRIBUTES: 'items-attributes', // dual-language
  ITEMS_ATTRIBUTE_VALUES: 'items-attribute-values', // dual-language
  MONSTER_ORIENTATION: 'monster-orientation',
  MOVIE_GENRES: 'movie-genres', // dual-language
  MOVIE_REVIEWS: 'movie-reviews',
  MOVIES: 'movies',
  NAMING_PROMPTS: 'naming-prompts',
  OBJECT_FEATURES: 'object-features', // dual-language
  QUANTITATIVE_QUESTIONS: 'quantitative-questions',
  SCENARIOS: 'scenarios',
  SINGLE_WORDS: 'single-words',
  SPECTRUMS: 'spectrums',
  SPY_LOCATIONS: 'spy-locations',
  SPY_QUESTIONS: 'spy-questions',
  SUSPECTS: 'suspects', // dual-language
  TEENAGE_MOTIVATIONS: 'teenage-motivations', // dual-language
  TEENAGE_RUMORS: 'teenage-rumors', // dual-language
  TEENAGE_STUDENTS: 'teenage-students', // dual-language
  TESTIMONY_QUESTIONS: 'testimony-questions',
  THEME_WORDS: 'theme-words',
  THING_PROMPTS: 'thing-prompts',
  THINGS_QUALITIES: 'things-qualities',
  TOPICS: 'topics',
  TREE_WORDS: 'tree-words',
  TWEETS: 'tweets',
  WAREHOUSE_BOSS_IDEAS: 'warehouse-boss-ideas',
  WARNING_SIGNS_DESCRIPTORS: 'warning-signs-descriptors',
  WARNING_SIGNS_SUBJECTS: 'warning-signs-subjects',
};

export const SEPARATOR = ';;';

export const USED_GAME_IDS = 'usedGameIds';

export const DOUBLE_ROUNDS_THRESHOLD = 6;

export const NPC = 'NPC';

/**
 * Avatar Sprite libraries
 * Libraries that also display an avatar
 */
export const AVATAR_SPRITE_LIBRARIES = {
  CLUBBERS: 60,
  COSTUMES: 50,
  SHEEP: 25,
  SUPER_HEROES: 50,
};

/**
 * Sprite libraries
 * Libraries that are only sprites
 */
export const SPRITE_LIBRARIES = {
  GLYPHS: 365,
  ITEMS: 512,
  TREES: 15,
  EMOJIS: 30,
  ALIEN_SIGNS: 32,
};
