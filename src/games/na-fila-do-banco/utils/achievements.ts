// Types
import type { AchievementReference } from 'types/game';

const ACHIEVEMENTS = {
  MOST_RETIREE_CARDS: 'MOST_RETIRE_CARDS',
  MOST_VETERAN_CARDS: 'MOST_VETERAN_CARDS',
  MOST_MOTHER_CARDS: 'MOST_MOTHER_CARDS',
  MOST_BUSINESSMAN_CARDS: 'MOST_BUSINESSMAN_CARDS',
  MOST_STUDENT_CARDS: 'MOST_STUDENT_CARDS',
  MOST_MOTOBOY_CARDS: 'MOST_MOTOBOY_CARDS',
  MOST_KID_CARDS: 'MOST_KID_CARDS',
  MOST_OWN_COLOR_CARDS: 'MOST_OWN_COLOR_CARDS',
  MOST_NEUTRAL_COLOR_CARDS: 'MOST_NEUTRAL_COLOR_CARDS',
  MOST_CUT_INS: 'MOST_CUT_INS',
  MOST_GOT_CUT: 'MOST_GOT_CUT',
  MOST_STAYS: 'MOST_STAYS',
  MOST_ONLINE_TRIGGERS: 'MOST_ONLINE_TRIGGERS',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_RETIREE_CARDS]: {
    icon: 'star',
    title: {
      pt: 'Aposentado de Ouro',
      en: 'The Golden Years',
    },
    description: {
      pt: 'Colocou mais idosos aposentados na fila',
      en: 'Lined up the most retiree clients',
    },
  },
  [ACHIEVEMENTS.MOST_VETERAN_CARDS]: {
    icon: 'person',
    title: {
      pt: 'Colecionador de Histórias',
      en: 'War Story Collector',
    },
    description: {
      pt: 'Colocou mais veteranos de guerra na fila',
      en: 'Lined up the most veteran clients',
    },
  },
  [ACHIEVEMENTS.MOST_MOTHER_CARDS]: {
    icon: 'heart',
    title: {
      pt: 'Especialista em Bebês',
      en: 'Baby Whisperer Pro',
    },
    description: {
      pt: 'Colocou mais mães com bebês na fila',
      en: 'Lined up the most mothers with babies',
    },
  },
  [ACHIEVEMENTS.MOST_BUSINESSMAN_CARDS]: {
    icon: 'money-bag',
    title: {
      pt: 'Executivo da Fila',
      en: 'Corporate Ladder Climber',
    },
    description: {
      pt: 'Colocou mais empresários na fila',
      en: 'Lined up the most businessman clients',
    },
  },
  [ACHIEVEMENTS.MOST_STUDENT_CARDS]: {
    icon: 'light-bulb',
    title: {
      pt: 'Estudante Eterno',
      en: 'Forever Student',
    },
    description: {
      pt: 'Colocou mais estudantes na fila',
      en: 'Lined up the most student clients',
    },
  },
  [ACHIEVEMENTS.MOST_MOTOBOY_CARDS]: {
    icon: 'hare',
    title: {
      pt: 'Rei das Entregas',
      en: 'Speedy Delivery King',
    },
    description: {
      pt: 'Colocou mais motoboys na fila',
      en: 'Lined up the most Courier clients',
    },
  },
  [ACHIEVEMENTS.MOST_KID_CARDS]: {
    icon: 'candy',
    title: {
      pt: 'Política de Recreio',
      en: 'Playground Politics',
    },
    description: {
      pt: 'Colocou mais crianças na fila',
      en: 'Lined up the most kid clients',
    },
  },
  [ACHIEVEMENTS.MOST_OWN_COLOR_CARDS]: {
    icon: 'paint-brush',
    title: {
      pt: 'Fiel à Raça',
      en: 'True Colors',
    },
    description: {
      pt: 'Jogou mais cartas da própria cor',
      en: 'Played the most cards of your own color',
    },
  },
  [ACHIEVEMENTS.MOST_NEUTRAL_COLOR_CARDS]: {
    icon: 'equal',
    title: {
      pt: 'Em Cima do Muro',
      en: 'Fence Sitter',
    },
    description: {
      pt: 'Jogou mais cartas de cor neutra',
      en: 'Played the most neutral color cards',
    },
  },
  [ACHIEVEMENTS.MOST_CUT_INS]: {
    icon: 'double-arrow-right',
    title: {
      pt: 'Fura-Fila Profissional',
      en: 'Queue Jumper',
    },
    description: {
      pt: 'Usou mais efeitos de fura-fila',
      en: 'Used the most cut-in-line effects',
    },
  },
  [ACHIEVEMENTS.MOST_GOT_CUT]: {
    icon: 'face-crying',
    title: {
      pt: 'Otário Oficial',
      en: 'Professional Doormat',
    },
    description: {
      pt: 'Colocou mais gente furando na sua frente',
      en: 'Got cut in line the most times',
    },
  },
  [ACHIEVEMENTS.MOST_STAYS]: {
    icon: 'house',
    title: {
      pt: 'Paciência Vence',
      en: 'Patience Wins',
    },
    description: {
      pt: 'Permaneceu na fila sem ser movido mais vezes',
      en: 'Stayed in line without being moved the most',
    },
  },
  [ACHIEVEMENTS.MOST_ONLINE_TRIGGERS]: {
    icon: 'siren',
    title: {
      pt: 'Herói do App',
      en: 'Online Banking Hero',
    },
    description: {
      pt: 'Ativou mais vezes o banco online',
      en: 'Triggered online banking the most times',
    },
  },
};

export default achievementsReference;
