// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  FEWEST_BUSINESSMAN_CARDS: {
    id: 'FEWEST_BUSINESSMAN_CARDS',
    doc: 'Total Businessman cards played',
    icon: 'tie',
    title: {
      en: 'Casual Friday',
      pt: 'Sexta Casual',
    },
    description: {
      en: 'Lined up the fewest businessman clients',
      pt: 'Colocou menos empresários na fila',
    },
  },
  MOST_BUSINESSMAN_CARDS: {
    id: 'MOST_BUSINESSMAN_CARDS',
    doc: 'Total Businessman cards played',
    icon: 'money-bag',
    title: {
      en: 'Corporate Ladder Climber',
      pt: 'Executivo da Fila',
    },
    description: {
      en: 'Lined up the most businessman clients',
      pt: 'Colocou mais empresários na fila',
    },
  },
  FEWEST_CUT_INS: {
    id: 'FEWEST_CUT_INS',
    doc: 'Total times player cut in line',
    icon: 'stop',
    title: {
      en: 'Patient Citizen',
      pt: 'Cidadão Paciente',
    },
    description: {
      en: 'Used the fewest cut-in-line effects',
      pt: 'Usou menos efeitos de fura-fila',
    },
  },
  MOST_CUT_INS: {
    id: 'MOST_CUT_INS',
    doc: 'Total times player cut in line',
    icon: 'double-arrow-right',
    title: {
      en: 'Queue Jumper',
      pt: 'Fura-Fila Profissional',
    },
    description: {
      en: 'Used the most cut-in-line effects',
      pt: 'Usou mais efeitos de fura-fila',
    },
  },
  FEWEST_GOT_CUT: {
    id: 'FEWEST_GOT_CUT',
    doc: 'Total times player got cut in line',
    icon: 'shield',
    title: {
      en: 'Impenetrable Wall',
      pt: 'Muralha Intocável',
    },
    description: {
      en: 'Got cut in line the fewest times',
      pt: 'Colocou menos gente furando na sua frente',
    },
  },
  MOST_GOT_CUT: {
    id: 'MOST_GOT_CUT',
    doc: 'Total times player got cut in line',
    icon: 'face-crying',
    title: {
      en: 'Professional Doormat',
      pt: 'Otário Oficial',
    },
    description: {
      en: 'Got cut in line the most times',
      pt: 'Colocou mais gente furando na sua frente',
    },
  },
  FEWEST_KID_CARDS: {
    id: 'FEWEST_KID_CARDS',
    doc: 'Total Kid cards played',
    icon: 'face-smiley',
    title: {
      en: 'Adults Only',
      pt: 'Zona de Adultos',
    },
    description: {
      en: 'Lined up the fewest kid clients',
      pt: 'Colocou menos crianças na fila',
    },
  },
  MOST_KID_CARDS: {
    id: 'MOST_KID_CARDS',
    doc: 'Total Kid cards played',
    icon: 'candy',
    title: {
      en: 'Playground Politics',
      pt: 'Política de Recreio',
    },
    description: {
      en: 'Lined up the most kid clients',
      pt: 'Colocou mais crianças na fila',
    },
  },
  FEWEST_MOTHER_CARDS: {
    id: 'FEWEST_MOTHER_CARDS',
    doc: 'Total Mother cards played',
    icon: 'bell',
    title: {
      en: 'Quiet Zone',
      pt: 'Zona Oásis',
    },
    description: {
      en: 'Lined up the fewest mothers with babies',
      pt: 'Colocou menos mães com bebês na fila',
    },
  },
  MOST_MOTHER_CARDS: {
    id: 'MOST_MOTHER_CARDS',
    doc: 'Total Mother cards played',
    icon: 'heart',
    title: {
      en: 'Baby Whisperer Pro',
      pt: 'Especialista em Bebês',
    },
    description: {
      en: 'Lined up the most mothers with babies',
      pt: 'Colocou mais mães com bebês na fila',
    },
  },
  FEWEST_MOTOBOY_CARDS: {
    id: 'FEWEST_MOTOBOY_CARDS',
    doc: 'Total Motoboy cards played',
    icon: 'snail',
    title: {
      en: 'Scenic Route',
      pt: 'Sem Pressa',
    },
    description: {
      en: 'Lined up the fewest Courier clients',
      pt: 'Colocou menos motoboys na fila',
    },
  },
  MOST_MOTOBOY_CARDS: {
    id: 'MOST_MOTOBOY_CARDS',
    doc: 'Total Motoboy cards played',
    icon: 'hare',
    title: {
      en: 'Speedy Delivery King',
      pt: 'Rei das Entregas',
    },
    description: {
      en: 'Lined up the most Courier clients',
      pt: 'Colocou mais motoboys na fila',
    },
  },
  FEWEST_NEUTRAL_COLOR_CARDS: {
    id: 'FEWEST_NEUTRAL_COLOR_CARDS',
    doc: 'Total neutral color cards played',
    icon: 'difference',
    title: {
      en: 'Boldly Biased',
      pt: 'Lado Definido',
    },
    description: {
      en: 'Played the fewest neutral color cards',
      pt: 'Jogou menos cartas de cor neutra',
    },
  },
  MOST_NEUTRAL_COLOR_CARDS: {
    id: 'MOST_NEUTRAL_COLOR_CARDS',
    doc: 'Total neutral color cards played',
    icon: 'equal',
    title: {
      en: 'Fence Sitter',
      pt: 'Em Cima do Muro',
    },
    description: {
      en: 'Played the most neutral color cards',
      pt: 'Jogou mais cartas de cor neutra',
    },
  },
  FEWEST_ONLINE_TRIGGERS: {
    id: 'FEWEST_ONLINE_TRIGGERS',
    doc: 'Total online triggers',
    icon: 'open-book',
    title: {
      en: 'Traditionalist',
      pt: 'À Moda Antiga',
    },
    description: {
      en: 'Triggered online banking the fewest times',
      pt: 'Ativou menos vezes o banco online',
    },
  },
  MOST_ONLINE_TRIGGERS: {
    id: 'MOST_ONLINE_TRIGGERS',
    doc: 'Total online triggers',
    icon: 'siren',
    title: {
      en: 'Online Banking Hero',
      pt: 'Herói do App',
    },
    description: {
      en: 'Triggered online banking the most times',
      pt: 'Ativou mais vezes o banco online',
    },
  },
  FEWEST_OWN_COLOR_CARDS: {
    id: 'FEWEST_OWN_COLOR_CARDS',
    doc: 'Total own color cards played',
    icon: 'paint',
    title: {
      en: 'Chameleon Spirit',
      pt: 'Espírito Camaleão',
    },
    description: {
      en: 'Played the fewest cards of your own color',
      pt: 'Jogou menos cartas da própria cor',
    },
  },
  MOST_OWN_COLOR_CARDS: {
    id: 'MOST_OWN_COLOR_CARDS',
    doc: 'Total own color cards played',
    icon: 'paint-brush',
    title: {
      en: 'True Colors',
      pt: 'Fiel à Raça',
    },
    description: {
      en: 'Played the most cards of your own color',
      pt: 'Jogou mais cartas da própria cor',
    },
  },
  FEWEST_RETIREE_CARDS: {
    id: 'FEWEST_RETIREE_CARDS',
    doc: 'Total Retiree cards played',
    icon: 'speedometer',
    title: {
      en: 'Youthful Energy',
      pt: 'Energia Jovem',
    },
    description: {
      en: 'Lined up the fewest retiree clients',
      pt: 'Colocou menos aposentadas na fila',
    },
  },
  MOST_RETIREE_CARDS: {
    id: 'MOST_RETIREE_CARDS',
    doc: 'Total Retiree cards played',
    icon: 'star',
    title: {
      en: 'The Golden Years',
      pt: 'Aposentada de Ouro',
    },
    description: {
      en: 'Lined up the most retiree clients',
      pt: 'Colocou mais aposentadas na fila',
    },
  },
  FEWEST_STAYS: {
    id: 'FEWEST_STAYS',
    doc: 'Total times player stayed in place',
    icon: 'arrow-rotate',
    title: {
      en: 'Always Moving',
      pt: 'Sempre em Movimento',
    },
    description: {
      en: 'Stayed in line without being moved the fewest times',
      pt: 'Permaneceu na fila sem ser movido menos vezes',
    },
  },
  MOST_STAYS: {
    id: 'MOST_STAYS',
    doc: 'Total times player stayed in place',
    icon: 'house',
    title: {
      en: 'Patience Wins',
      pt: 'Paciência Vence',
    },
    description: {
      en: 'Stayed in line without being moved the most',
      pt: 'Permaneceu na fila sem ser movido mais vezes',
    },
  },
  FEWEST_STUDENT_CARDS: {
    id: 'FEWEST_STUDENT_CARDS',
    doc: 'Total Student cards played',
    icon: 'broken-pencil',
    title: {
      en: 'School Is Out',
      pt: 'Férias Escolares',
    },
    description: {
      en: 'Lined up the fewest student clients',
      pt: 'Colocou menos estudantes na fila',
    },
  },
  MOST_STUDENT_CARDS: {
    id: 'MOST_STUDENT_CARDS',
    doc: 'Total Student cards played',
    icon: 'light-bulb',
    title: {
      en: 'Forever Student',
      pt: 'Estudante Eterno',
    },
    description: {
      en: 'Lined up the most student clients',
      pt: 'Colocou mais estudantes na fila',
    },
  },
  FEWEST_VETERAN_CARDS: {
    id: 'FEWEST_VETERAN_CARDS',
    doc: 'Total Veteran cards played',
    icon: 'broken-shield',
    title: {
      en: 'Rookie Recruiter',
      pt: 'Deficiência Recente',
    },
    description: {
      en: 'Lined up the fewest veteran clients',
      pt: 'Colocou menos veteranos de guerra na fila',
    },
  },
  MOST_VETERAN_CARDS: {
    id: 'MOST_VETERAN_CARDS',
    doc: 'Total Veteran cards played',
    icon: 'person',
    title: {
      en: 'War Story Collector',
      pt: 'Colecionador de Histórias',
    },
    description: {
      en: 'Lined up the most veteran clients',
      pt: 'Colocou mais veteranos de guerra na fila',
    },
  },
};

export default achievementsReference;
