// Internal
import type { DailyEspionagemEntry } from './types';

export const DEMO: DailyEspionagemEntry[] = [
  {
    id: '2025-06-29',
    type: 'espionagem',
    number: 2,
    isNsfw: true,
    culpritId: 'us-77',
    statements: [
      {
        key: 'testimony.t-73-pt',
        text: 'O(a) suspeito(a) não ouve heavy metal',
        excludes: ['us-13', 'us-20', 'us-16', 'us-35', 'us-10', 'us-53', 'us-38', 'us-87'],
        type: 'testimony',
      },
      {
        key: 'not.feature.longHair',
        text: 'O(a) suspeito(a) não tem cabelo longo',
        excludes: ['us-90', 'us-49', 'us-87'],
        type: 'feature',
      },
      {
        key: 'not.feature.short',
        text: 'O(a) suspeito(a) não é baixinho(a)',
        excludes: ['us-131', 'us-49', 'us-20', 'us-16', 'us-38', 'us-87'],
        type: 'feature',
      },
      {
        key: 'testimony.t-175-pt',
        text: 'O(a) suspeito(a) não tem OnlyFans',
        excludes: ['us-131', 'us-90', 'us-49'],
        type: 'testimony',
      },
      {
        key: 'not.grid.column4',
        text: 'O(a) suspeito(a) não está na quarta coluna',
        excludes: ['us-10', 'us-35', 'us-38'],
        type: 'grid',
      },
      {
        key: 'not.feature.noAccessories',
        text: 'O(a) suspeito(a) não sem nenhum acessório',
        excludes: ['us-131', 'us-90', 'us-35'],
        type: 'feature',
      },
    ],
    additionalStatements: [
      {
        key: 'not.feature.thin',
        text: 'O(a) suspeito(a) não é magrelo(a)',
        excludes: ['us-131', 'us-13', 'us-49', 'us-16', 'us-53'],
        type: 'feature',
      },
      {
        key: 'not.grid.row2',
        text: 'O(a) suspeito(a) não está na segunda linha',
        excludes: ['us-90', 'us-53', 'us-16', 'us-35'],
        type: 'grid',
      },
    ],
    suspects: [
      {
        id: 'us-87',
        name: {
          en: 'Pamela',
          pt: 'Pâmela',
        },
        features: ['female', 'young', 'caucasian', 'short', 'average', 'longHair'],
      },
      {
        id: 'us-20',
        name: {
          en: 'Tonya',
          pt: 'Tânia',
        },
        features: ['female', 'senior', 'caucasian', 'short', 'large'],
      },
      {
        id: 'us-13',
        name: {
          en: 'Megan',
          pt: 'Marta',
        },
        features: ['female', 'adult', 'asian', 'medium', 'thin'],
      },
      {
        id: 'us-10',
        name: {
          en: 'Levi',
          pt: 'Levi',
        },
        features: ['male', 'senior', 'caucasian', 'tall', 'average'],
      },
      {
        id: 'us-90',
        name: {
          en: 'Kathleen',
          pt: 'Kelly',
        },
        features: ['female', 'adult', 'caucasian', 'tall', 'average', 'longHair', 'noAccessories'],
      },
      {
        id: 'us-53',
        name: {
          en: 'Sebastian',
          pt: 'Sebastião',
        },
        features: ['male', 'adult', 'asian', 'tall', 'thin'],
      },
      {
        id: 'us-16',
        name: {
          en: 'Prisca',
          pt: 'Priscila',
        },
        features: ['female', 'adult', 'indian', 'short', 'thin'],
      },
      {
        id: 'us-35',
        name: {
          en: 'Robert',
          pt: 'Roberto',
        },
        features: ['male', 'adult', 'caucasian', 'medium', 'average', 'noAccessories'],
      },
      {
        id: 'us-131',
        name: {
          en: 'Lorraine',
          pt: 'Lorena',
        },
        features: ['female', 'adult', 'caucasian', 'short', 'thin', 'noAccessories'],
      },
      {
        id: 'us-49',
        name: {
          en: 'Kristen',
          pt: 'Cristina',
        },
        features: ['female', 'senior', 'caucasian', 'short', 'thin', 'longHair'],
      },
      {
        id: 'us-77',
        name: {
          en: 'Tanaka',
          pt: 'Tanaka',
        },
        features: ['male', 'senior', 'asian', 'tall', 'average'],
      },
      {
        id: 'us-38',
        name: {
          en: 'Lia',
          pt: 'Lia',
        },
        features: ['female', 'adult', 'asian', 'short', 'large'],
      },
    ],
    reason: {
      en: 'Turned out to be the long-lost twin of a missing villain.',
      pt: 'Era o gêmeo perdido de um vilão desaparecido.',
    },
    setId: 'us-77::cr-013::testimony.t-73-pt',
    level: 1,
  },
  {
    id: '2025-06-30',
    type: 'espionagem',
    number: 3,
    isNsfw: false,
    culpritId: 'us-60',
    statements: [
      {
        key: 'testimony.t-97-pt',
        text: 'O(a) suspeito(a) não tem antecedentes criminais',
        excludes: [
          'us-124',
          'us-83',
          'us-13',
          'us-129',
          'us-97',
          'us-76',
          'us-38',
          'us-57',
          'us-41',
          'us-56',
          'us-49',
        ],
        type: 'testimony',
      },
      {
        key: 'not.feature.blueClothes',
        text: 'O(a) suspeito(a) não está vestindo roupas azuis',
        excludes: ['us-13', 'us-57', 'us-56'],
        type: 'feature',
      },
      {
        key: 'not.feature.thin',
        text: 'O(a) suspeito(a) não é magrelo(a)',
        excludes: ['us-124', 'us-83', 'us-13', 'us-129', 'us-57', 'us-49'],
        type: 'feature',
      },
      {
        key: 'testimony.t-59-pt',
        text: 'O(a) suspeito(a) não faz ioga',
        excludes: [],
        type: 'testimony',
      },
      {
        key: 'not.grid.column4',
        text: 'O(a) suspeito(a) não está na quarta coluna',
        excludes: ['us-13', 'us-56', 'us-38'],
        type: 'grid',
      },
      {
        key: 'not.feature.black',
        text: 'O(a) suspeito(a) não é negro(a)',
        excludes: ['us-129', 'us-41'],
        type: 'feature',
      },
    ],
    additionalStatements: [
      {
        key: 'not.feature.short',
        text: 'O(a) suspeito(a) não é baixinho(a)',
        excludes: ['us-83', 'us-76', 'us-38', 'us-57', 'us-49'],
        type: 'feature',
      },
      {
        key: 'not.grid.row3',
        text: 'O(a) suspeito(a) não está na terceira linha',
        excludes: ['us-83', 'us-41', 'us-97', 'us-38'],
        type: 'grid',
      },
    ],
    suspects: [
      {
        id: 'us-76',
        name: {
          en: 'Abigail',
          pt: 'Abigail',
        },
        features: ['female', 'adult', 'caucasian', 'short', 'large'],
      },
      {
        id: 'us-57',
        name: {
          en: 'Wilma',
          pt: 'Velma',
        },
        features: ['female', 'senior', 'caucasian', 'short', 'thin', 'blueClothes'],
      },
      {
        id: 'us-60',
        name: {
          en: 'James',
          pt: 'Jair',
        },
        features: ['male', 'adult', 'caucasian', 'tall', 'average'],
      },
      {
        id: 'us-13',
        name: {
          en: 'Megan',
          pt: 'Marta',
        },
        features: ['female', 'adult', 'asian', 'medium', 'thin', 'blueClothes'],
      },
      {
        id: 'us-124',
        name: {
          en: 'Joanne',
          pt: 'Joana',
        },
        features: ['female', 'young', 'caucasian', 'medium', 'thin'],
      },
      {
        id: 'us-129',
        name: {
          en: 'Nivea',
          pt: 'Nívea',
        },
        features: ['female', 'adult', 'black', 'medium', 'thin'],
      },
      {
        id: 'us-49',
        name: {
          en: 'Kristen',
          pt: 'Cristina',
        },
        features: ['female', 'senior', 'caucasian', 'short', 'thin'],
      },
      {
        id: 'us-56',
        name: {
          en: 'Natalie',
          pt: 'Natália',
        },
        features: ['female', 'adult', 'caucasian', 'medium', 'average', 'blueClothes'],
      },
      {
        id: 'us-83',
        name: {
          en: 'Eru',
          pt: 'Eru',
        },
        features: ['male', 'adult', 'mixed', 'short', 'thin'],
      },
      {
        id: 'us-41',
        name: {
          en: 'Alexander',
          pt: 'Alexandre',
        },
        features: ['male', 'adult', 'black', 'tall', 'average'],
      },
      {
        id: 'us-97',
        name: {
          en: 'Paxton',
          pt: 'Péricles',
        },
        features: ['male', 'adult', 'caucasian', 'medium', 'average'],
      },
      {
        id: 'us-38',
        name: {
          en: 'Lia',
          pt: 'Lia',
        },
        features: ['female', 'adult', 'asian', 'short', 'large'],
      },
    ],
    reason: {
      en: 'Replaced every church bell in town with dubstep airhorns.',
      pt: 'Trocou todos os sinos da igreja por buzinas de dubstep.',
    },
    setId: 'us-60::cr-118::testimony.t-97-pt',
    level: 2,
  },
  {
    id: '2025-07-01',
    type: 'espionagem',
    number: 4,
    isNsfw: false,
    culpritId: 'us-101',
    statements: [
      {
        key: 'testimony.t-102-pt',
        text: 'O(a) suspeito(a) não acredita em signos e astrologia',
        excludes: ['us-56', 'us-43', 'us-55', 'us-90', 'us-106', 'us-13', 'us-89'],
        type: 'testimony',
      },
      {
        key: 'not.feature.brownHair',
        text: 'O(a) suspeito(a) não tem cabelo castanho',
        excludes: ['us-43', 'us-07', 'us-106', 'us-85'],
        type: 'feature',
      },
      {
        key: 'not.feature.caucasian',
        text: 'O(a) suspeito(a) não é branco(a)',
        excludes: ['us-18', 'us-56', 'us-55', 'us-07', 'us-90', 'us-09'],
        type: 'feature',
      },
      {
        key: 'testimony.t-7-pt',
        text: 'O(a) suspeito(a) não recicla seu lixo',
        excludes: ['us-18', 'us-07', 'us-09', 'us-85'],
        type: 'testimony',
      },
      {
        key: 'not.grid.column3',
        text: 'O(a) suspeito(a) não está na terceira coluna',
        excludes: ['us-89', 'us-18', 'us-106'],
        type: 'grid',
      },
      {
        key: 'not.feature.thin',
        text: 'O(a) suspeito(a) não é magrelo(a)',
        excludes: ['us-07', 'us-13', 'us-09', 'us-85'],
        type: 'feature',
      },
    ],
    additionalStatements: [
      {
        key: 'not.feature.longHair',
        text: 'O(a) suspeito(a) não tem cabelo longo',
        excludes: ['us-43', 'us-55', 'us-90', 'us-106', 'us-09', 'us-89'],
        type: 'feature',
      },
      {
        key: 'not.grid.row3',
        text: 'O(a) suspeito(a) não está na terceira linha',
        excludes: ['us-56', 'us-13', 'us-106', 'us-43'],
        type: 'grid',
      },
    ],
    suspects: [
      {
        id: 'us-101',
        name: {
          en: 'Josiah',
          pt: 'Jaci',
        },
        features: ['male', 'adult', 'asian', 'short', 'average'],
      },
      {
        id: 'us-85',
        name: {
          en: 'Gabrielle',
          pt: 'Gabriela',
        },
        features: ['female', 'young', 'black', 'medium', 'thin', 'brownHair'],
      },
      {
        id: 'us-89',
        name: {
          en: 'Camilla',
          pt: 'Camila',
        },
        features: ['female', 'adult', 'black', 'medium', 'average', 'longHair'],
      },
      {
        id: 'us-07',
        name: {
          en: 'Roger',
          pt: 'Rogério',
        },
        features: ['male', 'young', 'caucasian', 'short', 'thin', 'brownHair'],
      },
      {
        id: 'us-09',
        name: {
          en: 'Janine',
          pt: 'Janine',
        },
        features: ['female', 'senior', 'caucasian', 'medium', 'thin', 'longHair'],
      },
      {
        id: 'us-55',
        name: {
          en: 'Suzanne',
          pt: 'Suzana',
        },
        features: ['female', 'adult', 'caucasian', 'medium', 'average', 'longHair'],
      },
      {
        id: 'us-18',
        name: {
          en: 'Randall',
          pt: 'Ramon',
        },
        features: ['male', 'senior', 'caucasian', 'tall', 'average'],
      },
      {
        id: 'us-90',
        name: {
          en: 'Kathleen',
          pt: 'Kelly',
        },
        features: ['female', 'adult', 'caucasian', 'tall', 'average', 'longHair'],
      },
      {
        id: 'us-56',
        name: {
          en: 'Natalie',
          pt: 'Natália',
        },
        features: ['female', 'adult', 'caucasian', 'medium', 'average'],
      },
      {
        id: 'us-13',
        name: {
          en: 'Megan',
          pt: 'Marta',
        },
        features: ['female', 'adult', 'asian', 'medium', 'thin'],
      },
      {
        id: 'us-106',
        name: {
          en: 'Denise',
          pt: 'Denise',
        },
        features: ['female', 'adult', 'black', 'tall', 'average', 'brownHair', 'longHair'],
      },
      {
        id: 'us-43',
        name: {
          en: 'Felicia',
          pt: 'Felicia',
        },
        features: ['female', 'adult', 'latino', 'medium', 'average', 'longHair', 'brownHair'],
      },
    ],
    reason: {
      en: 'Created a fake orphanage to adopt adults with bad credit.',
      pt: 'Criou um orfanato falso para adotar adultos com nome sujo.',
    },
    setId: 'us-101::cr-127::testimony.t-102-pt',
    level: 1,
  },
  {
    id: '2025-07-02',
    type: 'espionagem',
    number: 5,
    isNsfw: false,
    culpritId: 'us-123',
    statements: [
      {
        key: 'testimony.t-86-pt',
        text: 'O(a) suspeito(a) não é uma pessoa espiritualizada',
        excludes: [
          'us-61',
          'us-92',
          'us-59',
          'us-23',
          'us-24',
          'us-21',
          'us-41',
          'us-104',
          'us-93',
          'us-86',
          'us-78',
        ],
        type: 'testimony',
      },
      {
        key: 'not.feature.earrings',
        text: 'O(a) suspeito(a) não está usando brincos',
        excludes: ['us-61', 'us-92', 'us-86'],
        type: 'feature',
      },
      {
        key: 'not.feature.shortHair',
        text: 'O(a) suspeito(a) não tem cabelo curto',
        excludes: ['us-23', 'us-24', 'us-41', 'us-104', 'us-93', 'us-78'],
        type: 'feature',
      },
      {
        key: 'testimony.t-126-pt',
        text: 'O(a) suspeito(a) não acha que fazer peido com o sovaco é um talento',
        excludes: [],
        type: 'testimony',
      },
      {
        key: 'not.grid.column3',
        text: 'O(a) suspeito(a) não está na terceira coluna',
        excludes: ['us-78', 'us-61', 'us-86'],
        type: 'grid',
      },
      {
        key: 'not.feature.short',
        text: 'O(a) suspeito(a) não é baixinho(a)',
        excludes: ['us-92', 'us-21', 'us-86'],
        type: 'feature',
      },
    ],
    additionalStatements: [
      {
        key: 'not.feature.beard',
        text: 'O(a) suspeito(a) não tem barba',
        excludes: ['us-61', 'us-59', 'us-23', 'us-24', 'us-41', 'us-104'],
        type: 'feature',
      },
      {
        key: 'not.grid.row1',
        text: 'O(a) suspeito(a) não está na primeira linha',
        excludes: ['us-23', 'us-92', 'us-78', 'us-24'],
        type: 'grid',
      },
    ],
    suspects: [
      {
        id: 'us-23',
        name: {
          en: 'Brian',
          pt: 'Benedito',
        },
        features: ['male', 'adult', 'caucasian', 'tall', 'average', 'shortHair', 'beard'],
      },
      {
        id: 'us-92',
        name: {
          en: 'Amelia',
          pt: 'Amélia',
        },
        features: ['female', 'adult', 'caucasian', 'short', 'average', 'earrings'],
      },
      {
        id: 'us-78',
        name: {
          en: 'Kyle',
          pt: 'Caio',
        },
        features: ['male', 'adult', 'caucasian', 'tall', 'muscular', 'shortHair'],
      },
      {
        id: 'us-24',
        name: {
          en: 'Bassam',
          pt: 'Basílio',
        },
        features: ['male', 'senior', 'indian', 'medium', 'average', 'shortHair', 'beard'],
      },
      {
        id: 'us-93',
        name: {
          en: 'Owen',
          pt: 'Otaviano',
        },
        features: ['male', 'adult', 'caucasian', 'tall', 'large', 'shortHair'],
      },
      {
        id: 'us-41',
        name: {
          en: 'Alexander',
          pt: 'Alexandre',
        },
        features: ['male', 'adult', 'black', 'tall', 'average', 'beard', 'shortHair'],
      },
      {
        id: 'us-61',
        name: {
          en: 'Samuel',
          pt: 'Sandoval',
        },
        features: ['male', 'adult', 'caucasian', 'tall', 'thin', 'beard', 'earrings'],
      },
      {
        id: 'us-104',
        name: {
          en: 'Zachary',
          pt: 'Zacarias',
        },
        features: ['male', 'adult', 'caucasian', 'tall', 'average', 'shortHair', 'beard'],
      },
      {
        id: 'us-21',
        name: {
          en: 'Una',
          pt: 'Úrsula',
        },
        features: ['female', 'adult', 'middle-eastern', 'short', 'large'],
      },
      {
        id: 'us-123',
        name: {
          en: 'Stella',
          pt: 'Estela',
        },
        features: ['female', 'adult', 'asian', 'tall', 'thin'],
      },
      {
        id: 'us-86',
        name: {
          en: 'Hariko',
          pt: 'Hariko',
        },
        features: ['female', 'adult', 'asian', 'short', 'thin', 'earrings'],
      },
      {
        id: 'us-59',
        name: {
          en: 'George',
          pt: 'Jorge',
        },
        features: ['male', 'senior', 'caucasian', 'medium', 'large', 'beard'],
      },
    ],
    reason: {
      en: 'Turned out to be the long-lost twin of a missing villain.',
      pt: 'Era o gêmeo perdido de um vilão desaparecido.',
    },
    setId: 'us-123::cr-013::testimony.t-86-pt',
    level: 2,
  },
  {
    id: '2025-06-28',
    type: 'espionagem',
    number: 1,
    isNsfw: true,
    culpritId: 'us-65',
    statements: [
      {
        key: 'testimony.t-90-pt',
        text: 'O(a) suspeito(a) não assiste Jornal Nacional',
        excludes: ['us-56', 'us-28', 'us-27', 'us-108', 'us-63', 'us-10', 'us-15', 'us-35', 'us-24'],
        type: 'testimony',
      },
      {
        key: 'not.feature.beard',
        text: 'O(a) suspeito(a) não tem barba',
        excludes: ['us-10', 'us-15', 'us-24'],
        type: 'feature',
      },
      {
        key: 'not.feature.buttonShirt',
        text: 'O(a) suspeito(a) não está usando camisa com botões',
        excludes: ['us-128', 'us-81', 'us-63', 'us-10', 'us-24'],
        type: 'feature',
      },
      {
        key: 'testimony.t-193-pt',
        text: 'O(a) suspeito(a) não é assexuado(a)',
        excludes: ['us-128', 'us-81'],
        type: 'testimony',
      },
      {
        key: 'not.grid.column3',
        text: 'O(a) suspeito(a) não está na terceira coluna',
        excludes: ['us-35', 'us-24', 'us-27'],
        type: 'grid',
      },
      {
        key: 'not.feature.showTeeth',
        text: 'O(a) suspeito(a) não está mostrando os dentes',
        excludes: ['us-56', 'us-108', 'us-35'],
        type: 'feature',
      },
    ],
    additionalStatements: [
      {
        key: 'not.feature.blueClothes',
        text: 'O(a) suspeito(a) não está vestindo roupas azuis',
        excludes: ['us-56', 'us-27', 'us-128', 'us-63', 'us-35'],
        type: 'feature',
      },
      {
        key: 'not.grid.row2',
        text: 'O(a) suspeito(a) não está na segunda linha',
        excludes: ['us-28', 'us-108', 'us-24', 'us-56'],
        type: 'grid',
      },
    ],
    suspects: [
      {
        id: 'us-10',
        name: {
          en: 'Levi',
          pt: 'Levi',
        },
        features: ['male', 'senior', 'caucasian', 'tall', 'average', 'beard', 'buttonShirt'],
      },
      {
        id: 'us-128',
        name: {
          en: 'Dani',
          pt: 'Dani',
        },
        features: ['non-binary', 'adult', 'caucasian', 'medium', 'thin', 'buttonShirt', 'blueClothes'],
      },
      {
        id: 'us-35',
        name: {
          en: 'Robert',
          pt: 'Roberto',
        },
        features: ['male', 'adult', 'caucasian', 'medium', 'average', 'showTeeth', 'blueClothes'],
      },
      {
        id: 'us-65',
        name: {
          en: 'Carl',
          pt: 'Carlos',
        },
        features: ['male', 'adult', 'asian', 'medium', 'average'],
      },
      {
        id: 'us-28',
        name: {
          en: 'Amanda',
          pt: 'Amanda',
        },
        features: ['female', 'adult', 'caucasian', 'medium', 'thin'],
      },
      {
        id: 'us-108',
        name: {
          en: 'Clayton',
          pt: 'Cleiton',
        },
        features: ['male', 'adult', 'latino', 'tall', 'average', 'showTeeth'],
      },
      {
        id: 'us-24',
        name: {
          en: 'Bassam',
          pt: 'Basílio',
        },
        features: ['male', 'senior', 'indian', 'medium', 'average', 'beard', 'buttonShirt'],
      },
      {
        id: 'us-56',
        name: {
          en: 'Natalie',
          pt: 'Natália',
        },
        features: ['female', 'adult', 'caucasian', 'medium', 'average', 'showTeeth', 'blueClothes'],
      },
      {
        id: 'us-81',
        name: {
          en: 'Jean',
          pt: 'Claudimiro',
        },
        features: ['male', 'senior', 'caucasian', 'tall', 'average', 'buttonShirt'],
      },
      {
        id: 'us-63',
        name: {
          en: 'Louis',
          pt: 'Luís',
        },
        features: ['male', 'adult', 'caucasian', 'medium', 'average', 'buttonShirt', 'blueClothes'],
      },
      {
        id: 'us-27',
        name: {
          en: 'Anthony',
          pt: 'Antônio',
        },
        features: ['male', 'senior', 'caucasian', 'short', 'average', 'blueClothes'],
      },
      {
        id: 'us-15',
        name: {
          en: 'John',
          pt: 'Júlio',
        },
        features: ['male', 'senior', 'caucasian', 'medium', 'average', 'beard'],
      },
    ],
    reason: {
      en: 'Forged friendship certificates to emotionally manipulate victims.',
      pt: 'Falsificava certificados de amizade para manipular emocionalmente as vítimas.',
    },
    setId: 'us-65::cr-128::testimony.t-90-pt',
    level: 3,
  },
];
