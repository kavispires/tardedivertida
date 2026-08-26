export const MEGAMIX_PHASES = {
  SEEDING: 'SEEDING',
  TRACK: 'TRACK',
  RESULT: 'RESULT',
} as const;

export const MEGAMIX_ACTIONS = {
  SUBMIT_SEEDS: 'SUBMIT_SEEDS',
  SUBMIT_TRACK_ANSWER: 'SUBMIT_TRACK_ANSWER',
} as const;

export const SIDES = {
  LOSER: 'L',
  WINNER: 'W',
} as const;

export const SCORING_POINTS = {
  JOIN_VIP: 1,
  TIED_WITH_VIP: 1,
  ALREADY_ON_VIP: 2,
  CATCHUP_BONUS: 2,
  CATCHUP_PENALTY: -2,
} as const;

export const MEGAMIX_TRACKS: Dictionary<{ title: DualLanguageValue; tagline: DualLanguageValue }> = {
  'arte-ruim': {
    title: {
      pt: 'Arte Ruim Pra Dedéu',
      en: 'Questionable Art',
    },
    tagline: {
      pt: 'Uma imagem vale mais que mil palavras',
      en: "That's art!",
    },
  },
  'comunicacao-alienigena': {
    title: {
      pt: 'Comunicação Alienígena',
      en: 'Alien Communication',
    },
    tagline: {
      pt: 'Vamos falar com os ETs',
      en: 'Let us talk to the aliens',
    },
  },
  'contadores-historias': {
    title: {
      pt: 'Contadores de Histórias',
      en: 'Storytellers',
    },
    tagline: {
      pt: 'Conte uma história',
      en: 'Tell us a story',
    },
  },
  'crimes-hediondos': {
    title: {
      pt: 'Crimes Hediondos',
      en: 'Horrific Crimes',
    },
    tagline: {
      pt: 'Desvenda o crime!',
      en: 'Solve the crime!',
    },
  },
  'cruza-palavras': {
    title: {
      pt: 'Cruza Palavras',
      en: 'Mixed Clues',
    },
    tagline: {
      pt: 'Coloque a dica na grade de palavras!',
      en: 'Place the clue in the word grid!',
    },
  },
  'detetives-imaginativos': {
    title: {
      pt: 'Detetives Imaginativos',
      en: 'Detective Agency',
    },
    tagline: {
      pt: 'Há um impostor entre a gente!',
      en: 'There is an impostor among us!',
    },
  },
  duetos: {
    title: {
      pt: 'Duetos',
      en: 'Duets',
    },
    tagline: {
      pt: 'Faça pares com as cartas como os outros jogadores',
      en: 'Pair the cards like the other players',
    },
  },
  esquiadores: {
    title: {
      pt: 'Esquiadores',
      en: 'Ski Resort',
    },
    tagline: {
      pt: 'Escolha uma montanha para esquiar!',
      en: 'Choose a mountain to ski!',
    },
  },
  'espiao-entre-nos': {
    title: {
      pt: 'Espião Entre Nós',
      en: 'Spy the Spies',
    },
    tagline: {
      pt: 'Onde você está?',
      en: 'Where are we?',
    },
  },
  'fileira-de-fatos': {
    title: {
      pt: 'Fileira de Fatos',
      en: 'Facts Lineup',
    },
    tagline: {
      pt: 'Coloque a fila de números na ordem!',
      en: 'Place the line of numbers in order!',
    },
  },
  'galeria-de-sonhos': {
    title: {
      pt: 'Galeria de Sonhos',
      en: 'Dream Gallery',
    },
    tagline: {
      pt: 'Um tema, um sonho, várias images',
      en: 'A theme, a dream, many images',
    },
  },
  'labirinto-secreto': {
    title: {
      pt: 'Labirinto Secreto',
      en: 'Secret Labyrinth',
    },
    tagline: {
      pt: 'Vamos andar pela floresta',
      en: "Let's walk into the woods",
    },
  },
  'medidas-nao-exatas': {
    title: {
      pt: 'Medidas Não Exatas',
      en: 'Creative Metrics',
    },
    tagline: {
      pt: 'Avalie sua palavra secreta com métricas malucas e veja se outros jogadores conseguem adivinhá-la.',
      en: 'Evaluate your secret word with crazy metrics and see if other players can guess it.',
    },
  },
  'megamix-best-of-three': {
    title: {
      pt: 'Melhor de 3',
      en: 'Best of 3',
    },
    tagline: {
      pt: 'Qual opção você escolhe?',
      en: 'Which option do you choose?',
    },
  },
  'megamix-this-that': {
    title: {
      pt: 'Isso ou Aquilo?',
      en: 'This or That?',
    },
    tagline: {
      pt: 'Qual opção você escolhe?',
      en: 'Which option do you choose?',
    },
  },
  'megamix-who-said-this': {
    title: {
      pt: 'Quem Disse Isso?',
      en: 'Who Said This?',
    },
    tagline: {
      pt: 'Quem tem mais cara de ter disso isso?',
      en: "Who could've possibly said this?",
    },
  },
  'mente-coletiva': {
    title: {
      pt: 'Mente Coletiva',
      en: 'Herd Mind',
    },
    tagline: {
      pt: 'Junte-se as ovelhas!',
      en: 'Join the herd!',
    },
  },
  'na-rua-do-medo': {
    title: {
      pt: 'Na Rua do Medo',
      en: 'Fear Street',
    },
    tagline: {
      pt: 'Gostosuras ou travessuras?',
      en: 'Trick or treat?',
    },
  },
  'namoro-ou-amizade': {
    title: {
      pt: 'Namoro ou Amizade',
      en: 'Awkward Dates',
    },
    tagline: {
      pt: 'Selecione o melhor partido',
      en: "Who's the best catch?",
    },
  },
  'onda-telepatica': {
    title: {
      pt: 'Ondas Telepáticas',
      en: 'Telepathic Waves',
    },
    tagline: {
      pt: 'Para onde o ponteiro está apontando?',
      en: 'Where is the pointer pointing to?',
    },
  },
  'palheta-de-cores': {
    title: {
      pt: 'Palheta de Cores',
      en: 'Color Palette',
    },
    tagline: {
      pt: 'Selecione a melhor cor',
      en: 'Select the best color swatch',
    },
  },
  'polemica-da-vez': {
    title: {
      pt: 'Polêmica da Vez',
      en: "That's Polemic!",
    },
    tagline: {
      pt: 'Quantas curtidas isso ganha?',
      en: 'How many likes, huh?',
    },
  },
  'porta-dos-desesperados': {
    title: {
      pt: 'Porta dos Desesperados',
      en: 'Obscure Doors',
    },
    tagline: {
      pt: 'Qual a porta é a saída?',
      en: 'What door is the exit?',
    },
  },
  'retrato-falado': {
    title: {
      pt: 'Retrato Falado Monstruoso',
      en: 'Monster Sketch',
    },
    tagline: {
      pt: 'Qual o melhor monstro?',
      en: 'What is the best monster?',
    },
  },
  'quem-nao-mata': {
    title: {
      pt: 'Quem Não Mata, Morre',
      en: 'Mortal Standoff',
    },
    tagline: {
      pt: 'Mate alguém...',
      en: 'Kill someone...',
    },
  },
  'quem-sou-eu': {
    title: {
      pt: 'Quem Sou Eu?',
      en: 'Who Am I?',
    },
    tagline: {
      pt: 'Decifre os símbolos!',
      en: 'Decipher the glyphs',
    },
  },
  'senso-literario': {
    title: {
      pt: 'Senso Literário',
      en: 'Book Sense',
    },
    tagline: {
      pt: 'Qual é a ordem dos livros?',
      en: 'What is the order of the books?',
    },
  },
  'super-campeonato': {
    title: {
      pt: 'Super Campeonato',
      en: 'Ultimate Championship',
    },
    tagline: {
      pt: 'Quem ganha essa batalha?',
      en: 'Who will win this battle?',
    },
  },
  'ta-na-cara': {
    title: {
      pt: 'Tá Na Cara',
      en: 'Guess Who What?',
    },
    tagline: {
      pt: 'E esse aí? O que acha?',
      en: 'What about this one? What do you think?',
    },
  },
  'testemunha-ocular': {
    title: {
      pt: 'Testemunha Ocular',
      en: 'Eye Witness',
    },
    tagline: {
      pt: 'Quem é o criminoso?',
      en: 'Who is the perpetrator?',
    },
  },
  'ue-so-isso': {
    title: {
      pt: 'Ué, só isso?',
      en: "That's it?",
    },
    tagline: {
      pt: 'Escreva uma dica para ser eliminada',
      en: 'Write a clue to be eliminated',
    },
  },
  'vamos-ao-cinema': {
    title: {
      pt: 'Vamos no cinema?',
      en: 'Movie night!',
    },
    tagline: {
      pt: 'Vamos ver qual filme?',
      en: 'But what movie?',
    },
  },
};
