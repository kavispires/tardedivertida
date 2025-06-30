// Internal
import type { DailyEspionagemEntry } from './types';

export const DEMO: DailyEspionagemEntry[] = [
  {
    id: '2025-00-00',
    type: 'espionagem',
    number: 0,
    isNsfw: false,
    culpritId: 'us-136',
    statements: [
      {
        key: 'testimony.t-50-pt',
        text: 'O(a) suspeito(a) não gosta de jogos de azar',
        excludes: ['us-28', 'us-80', 'us-21', 'us-17', 'us-105'],
        type: 'testimony',
      },
      {
        key: 'not.feature.large',
        text: 'O(a) suspeito(a) não é gordo(a)',
        excludes: ['us-38', 'us-45', 'us-21', 'us-17'],
        type: 'feature',
      },
      {
        key: 'not.feature.male',
        text: 'O(a) suspeito(a) não é homem',
        excludes: ['us-27', 'us-107', 'us-15', 'us-17', 'us-30'],
        type: 'feature',
      },
      {
        key: 'testimony.t-2-pt',
        text: 'O(a) suspeito(a) não gosta de música clássica',
        excludes: ['us-27', 'us-107', 'us-15', 'us-38', 'us-45', 'us-30'],
        type: 'testimony',
      },
      {
        key: 'not.grid.column1',
        text: 'O(a) suspeito(a) não está na primeira coluna',
        excludes: ['us-27', 'us-28', 'us-105'],
        type: 'grid',
      },
      {
        key: 'not.feature.short',
        text: 'O(a) suspeito(a) não é baixinho(a)',
        excludes: ['us-27', 'us-38', 'us-80', 'us-21'],
        type: 'feature',
      },
    ],
    additionalStatements: [
      {
        key: 'not.feature.shortHair',
        text: 'O(a) suspeito(a) não tem cabelo curto',
        excludes: ['us-15', 'us-38', 'us-45', 'us-17', 'us-30'],
        type: 'feature',
      },
      {
        key: 'not.grid.row1',
        text: 'O(a) suspeito(a) não está na primeira linha',
        excludes: ['us-27', 'us-80', 'us-21', 'us-30'],
        type: 'grid',
      },
    ],
    suspects: [
      {
        id: 'us-27',
        name: {
          en: 'Anthony',
          pt: 'Antônio',
        },
        gender: 'male',
        features: ['male', 'senior', 'caucasian', 'short', 'average'],
      },
      {
        id: 'us-80',
        name: {
          en: 'Anisha',
          pt: 'Ana',
        },
        gender: 'female',
        features: ['female', 'adult', 'black', 'short', 'thin'],
      },
      {
        id: 'us-21',
        name: {
          en: 'Una',
          pt: 'Úrsula',
        },
        gender: 'female',
        features: ['female', 'adult', 'middle-eastern', 'short', 'large'],
      },
      {
        id: 'us-30',
        name: {
          en: 'Hector',
          pt: 'Heitor',
        },
        gender: 'male',
        features: ['male', 'adult', 'caucasian', 'tall', 'average', 'shortHair'],
      },
      {
        id: 'us-28',
        name: {
          en: 'Amanda',
          pt: 'Amanda',
        },
        gender: 'female',
        features: ['female', 'adult', 'caucasian', 'medium', 'thin'],
      },
      {
        id: 'us-17',
        name: {
          en: 'Flick',
          pt: 'Fagner',
        },
        gender: 'male',
        features: ['male', 'adult', 'latino', 'medium', 'large', 'shortHair'],
      },
      {
        id: 'us-38',
        name: {
          en: 'Lia',
          pt: 'Lia',
        },
        gender: 'female',
        features: ['female', 'adult', 'asian', 'short', 'large', 'shortHair'],
      },
      {
        id: 'us-136',
        name: {
          en: 'Melissa',
          pt: 'Melissa',
        },
        gender: 'female',
        features: ['female', 'adult', 'caucasian', 'medium', 'thin'],
      },
      {
        id: 'us-105',
        name: {
          en: 'Margaret',
          pt: 'Margarete',
        },
        gender: 'female',
        features: ['female', 'adult', 'caucasian', 'tall', 'thin'],
      },
      {
        id: 'us-15',
        name: {
          en: 'John',
          pt: 'Júlio',
        },
        gender: 'male',
        features: ['male', 'senior', 'caucasian', 'medium', 'average', 'shortHair'],
      },
      {
        id: 'us-107',
        name: {
          en: 'Charles',
          pt: 'Clóvis',
        },
        gender: 'male',
        features: ['male', 'senior', 'caucasian', 'tall', 'average'],
      },
      {
        id: 'us-45',
        name: {
          en: 'Marlene',
          pt: 'Marlene',
        },
        gender: 'female',
        features: ['female', 'senior', 'caucasian', 'tall', 'large', 'shortHair'],
      },
    ],
    reason: {
      en: 'Filed 72 name changes to delay sentencing.',
      pt: 'Mudou de nome 72 vezes para adiar a sentença.',
    },
    setId: 'us-136::cr-148::testimony.t-50-pt',
    level: 2,
  },
  {
    id: '2025-00-00',
    type: 'espionagem',
    number: 0,
    isNsfw: false,
    culpritId: 'us-112',
    statements: [
      {
        key: 'testimony.t-142-pt',
        text: 'O(a) suspeito(a) não é tímido',
        excludes: [
          'us-67',
          'us-42',
          'us-35',
          'us-52',
          'us-54',
          'us-07',
          'us-95',
          'us-68',
          'us-51',
          'us-79',
          'us-23',
        ],
        type: 'testimony',
      },
      {
        key: 'not.feature.beard',
        text: 'O(a) suspeito(a) não tem barba',
        excludes: ['us-52', 'us-95', 'us-23'],
        type: 'feature',
      },
      {
        key: 'not.feature.glasses',
        text: 'O(a) suspeito(a) não está usando óculos',
        excludes: ['us-52', 'us-54', 'us-07', 'us-79'],
        type: 'feature',
      },
      {
        key: 'testimony.t-228-pt',
        text: 'O(a) suspeito(a) não está fazendo uma detox de redes sociais',
        excludes: [],
        type: 'testimony',
      },
      {
        key: 'not.grid.column2',
        text: 'O(a) suspeito(a) não está na segunda coluna',
        excludes: ['us-35', 'us-23', 'us-68'],
        type: 'grid',
      },
      {
        key: 'not.feature.showTeeth',
        text: 'O(a) suspeito(a) não está mostrando os dentes',
        excludes: ['us-42', 'us-35', 'us-54'],
        type: 'feature',
      },
    ],
    additionalStatements: [
      {
        key: 'not.feature.avoidingCamera',
        text: 'O(a) suspeito(a) não está evitando olhar para a câmera',
        excludes: ['us-67', 'us-42', 'us-52', 'us-51'],
        type: 'feature',
      },
      {
        key: 'not.grid.row1',
        text: 'O(a) suspeito(a) não está na primeira linha',
        excludes: ['us-67', 'us-35', 'us-07', 'us-95'],
        type: 'grid',
      },
    ],
    suspects: [
      {
        id: 'us-67',
        name: {
          en: 'Walter',
          pt: 'Walter',
        },
        gender: 'male',
        features: ['male', 'senior', 'caucasian', 'medium', 'large', 'avoidingCamera'],
      },
      {
        id: 'us-35',
        name: {
          en: 'Robert',
          pt: 'Roberto',
        },
        gender: 'male',
        features: ['male', 'adult', 'caucasian', 'medium', 'average', 'showTeeth'],
      },
      {
        id: 'us-07',
        name: {
          en: 'Roger',
          pt: 'Rogério',
        },
        gender: 'male',
        features: ['male', 'young', 'caucasian', 'short', 'thin', 'glasses'],
      },
      {
        id: 'us-95',
        name: {
          en: 'Quentin',
          pt: 'Quércio',
        },
        gender: 'male',
        features: ['male', 'adult', 'caucasian', 'medium', 'thin', 'beard'],
      },
      {
        id: 'us-52',
        name: {
          en: 'Ernest',
          pt: 'Ernesto',
        },
        gender: 'male',
        features: ['male', 'adult', 'latino', 'tall', 'average', 'beard', 'glasses', 'avoidingCamera'],
      },
      {
        id: 'us-23',
        name: {
          en: 'Brian',
          pt: 'Benedito',
        },
        gender: 'male',
        features: ['male', 'adult', 'caucasian', 'tall', 'average', 'beard'],
      },
      {
        id: 'us-54',
        name: {
          en: 'Christian',
          pt: 'Cristiano',
        },
        gender: 'male',
        features: ['male', 'adult', 'caucasian', 'tall', 'muscular', 'glasses', 'showTeeth'],
      },
      {
        id: 'us-112',
        name: {
          en: 'Nolan',
          pt: 'Nestor',
        },
        gender: 'male',
        features: ['male', 'adult', 'black', 'tall', 'thin'],
      },
      {
        id: 'us-79',
        name: {
          en: 'Mo',
          pt: 'Márcia',
        },
        gender: 'female',
        features: ['female', 'adult', 'caucasian', 'tall', 'large', 'glasses'],
      },
      {
        id: 'us-68',
        name: {
          en: 'Powa',
          pt: 'Pequi',
        },
        gender: 'male',
        features: ['male', 'senior', 'indigenous', 'medium', 'average'],
      },
      {
        id: 'us-42',
        name: {
          en: 'Katherine',
          pt: 'Catarina',
        },
        gender: 'female',
        features: ['female', 'adult', 'caucasian', 'medium', 'average', 'avoidingCamera', 'showTeeth'],
      },
      {
        id: 'us-51',
        name: {
          en: 'Edgard',
          pt: 'Edgar',
        },
        gender: 'male',
        features: ['male', 'adult', 'caucasian', 'tall', 'thin', 'avoidingCamera'],
      },
    ],
    reason: {
      en: 'Trained seagulls to attack specific people on command.',
      pt: 'Treinou gaivotas para atacar pessoas específicas sob comando.',
    },
    setId: 'us-112::cr-116::testimony.t-142-pt',
    level: 3,
  },
];
