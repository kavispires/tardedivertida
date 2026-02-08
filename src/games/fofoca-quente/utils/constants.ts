export const FOFOCA_QUENTE_PHASES = {
  ROLES_SELECTION: 'ROLES_SELECTION',
  BOARD_SETUP: 'BOARD_SETUP',
  INTIMIDATION: 'INTIMIDATION',
  RUMOR: 'RUMOR',
  RESPONSE: 'RESPONSE',
  INVESTIGATION: 'INVESTIGATION',
  SCHOOL: 'SCHOOL',
  RESOLUTION: 'RESOLUTION',
} as const;

export const FOFOCA_QUENTE_ACTIONS = {
  SUBMIT_PLAYERS_ROLES: 'SUBMIT_PLAYERS_ROLES',
  SUBMIT_SOCIAL_GROUP: 'SUBMIT_SOCIAL_GROUP',
  SUBMIT_INTIMIDATION: 'SUBMIT_INTIMIDATION',
  SUBMIT_RUMOR: 'SUBMIT_RUMOR',
  SUBMIT_SKIP_RUMOR: 'SUBMIT_SKIP_RUMOR',
  SUBMIT_RESPONSE: 'SUBMIT_RESPONSE',
  UPDATE_DETECTIVE_POSITION: 'UPDATE_DETECTIVE_POSITION',
  UPDATE_STUDENT_POSITION: 'MOVE_STUDENTS',
  // TODO: do I need more specific?
  SUBMIT_INVESTIGATION: 'SUBMIT_INVESTIGATION',
};

export const AGE_NUMBER: NumberDictionary = {
  junior: 15,
  sophomore: 16,
  senior: 17,
};

export const HEIGHT: Dictionary<DualLanguageValue> = {
  short: {
    en: 'Short',
    pt: 'Baixa',
  },
  medium: {
    en: 'Medium',
    pt: 'Média',
  },
  tall: {
    en: 'Tall',
    pt: 'Alta',
  },
};

export const BUILD: Dictionary<DualLanguageValue> = {
  small: {
    en: 'Small',
    pt: 'Pequeno',
  },
  medium: {
    en: 'Medium',
    pt: 'Mediano',
  },
  large: {
    en: 'Large',
    pt: 'Grande',
  },
};

export const GENDER: Dictionary<DualLanguageValue> = {
  female: {
    en: 'Female',
    pt: 'Feminino',
  },
  male: {
    en: 'Male',
    pt: 'Masculino',
  },
  both: {
    en: 'Non-binary',
    pt: 'Não-binário',
  },
};

export const ACTION_TYPES = {
  INTIMIDATE: 'INTIMIDATE',
  RUMOR: 'RUMOR',
};

export const QUESTIONS: Dictionary<DualLanguageValue> = {
  1: {
    en: 'Is the Gossiper male?',
    pt: 'O fofoqueiro é do sexo masculino?',
  },
  2: {
    en: 'Is the Gossiper female?',
    pt: 'O fofoqueiro é do sexo feminino?',
  },
  3: {
    en: 'Is the Gossiper young?',
    pt: 'O fofoqueiro é jovem?',
  },
  4: {
    en: 'Is the Gossiper middle-aged?',
    pt: 'O fofoqueiro é de meia-idade?',
  },
  5: {
    en: 'Is the Gossiper senior?',
    pt: 'O fofoqueiro é idoso?',
  },
  6: {
    en: 'Is the Gossiper of thin build?',
    pt: 'O fofoqueiro é de estrutura magra?',
  },
  7: {
    en: 'Is the Gossiper of medium build?',
    pt: 'O fofoqueiro é de estrutura mediana?',
  },
  8: {
    en: 'Is the Gossiper of heavy build?',
    pt: 'O fofoqueiro é de estrutura pesada?',
  },
  9: {
    en: 'Is the Gossiper tall?',
    pt: 'O fofoqueiro é alto?',
  },
  10: {
    en: 'Is the Gossiper of medium height?',
    pt: 'O fofoqueiro é de altura média?',
  },
  11: {
    en: 'Is the Gossiper short?',
    pt: 'O fofoqueiro é baixo?',
  },
};

export const PHASES_DESCRIPTIONS: {
  phase: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
}[] = [
  {
    phase: FOFOCA_QUENTE_PHASES.BOARD_SETUP,
    title: {
      en: 'Board Setup',
      pt: 'Configuração do Tabuleiro',
    },
    description: {
      en: 'Only in the beginning of the game: The gossiper decides among 3 options what social group is their follower while the detective chooses their starting position.',
      pt: 'Apenas no início do jogo: O fofoqueiro decide entre 3 opções qual grupo social é seu seguidor enquanto o detetive escolhe sua posição inicial.',
    },
  },
  {
    phase: FOFOCA_QUENTE_PHASES.INTIMIDATION,
    title: {
      en: 'Intimidation',
      pt: 'Intimidação',
    },
    description: {
      en: 'The gossiper can intimidate up to 2 students making them unavailable for the detective to ask them any questions later.',
      pt: 'O fofoqueiro pode intimidar até 2 estudantes, tornando-os indisponíveis para o detetive fazer perguntas a eles posteriormente.',
    },
  },
  {
    phase: FOFOCA_QUENTE_PHASES.RUMOR,
    title: {
      en: 'Rumor',
      pt: 'Boato',
    },
    description: {
      en: 'The gossiper must spread a rumor about a student following their motivation. The gossiper wins when they spread the 5th rumor. The gossiper can choose to skip this step once during the game in case there are not good options, if they had to skip one more time later, they lose the game.',
      pt: 'O fofoqueiro deve espalhar um boato sobre um estudante seguindo sua motivação. O fofoqueiro ganha quando espalha o 5º boato. O fofoqueiro pode escolher pular esta etapa uma vez durante o jogo caso não haja boas opções, se ele tiver que pular mais uma vez depois, ele perde o jogo.',
    },
  },
  {
    phase: FOFOCA_QUENTE_PHASES.RESPONSE,
    title: {
      en: 'Response',
      pt: 'Resposta',
    },
    description: {
      en: 'After the gossiper spreads a rumor, the detective must go to the location investigate it. They decide where any other student there should move.',
      pt: 'Após o fofoqueiro espalhar um boato, o detetive pode escolher investigar ou tentar pegar o fofoqueiro. O detetive vence se pegar o fofoqueiro ou se sobreviver até o final da rodada 5. O detetive perde se acusar o estudante errado 3 vezes ou se não conseguir pegar o fofoqueiro até o final da rodada 5.',
    },
  },
  {
    phase: FOFOCA_QUENTE_PHASES.INVESTIGATION,
    title: {
      en: 'Investigation',
      pt: 'Investigação',
    },
    description: {
      en: 'The detective can take 2 actions (and maybe move 2 spaces before or after each action). Actions are: 1) Ask a student a question about the gossiper. 2) Use Red Heart staff member action. 3) Use a Blue Help staff member action. 4) Use a Yellow Megaphone staff member action. 5) Use a Green Location Pin staff member action.',
      pt: 'O detetive pode realizar 2 ações (e talvez mover 2 espaços antes ou depois de cada ação). As ações são: 1) Perguntar a um estudante uma questão sobre o fofoqueiro. 2) Usar a ação do membro da equipe Coração Vermelho. 3) Usar a ação do membro da equipe Ajuda Azul. 4) Usar a ação do membro da equipe Megafone Amarelo. 5) Usar a ação do membro da equipe Pin de Localização Verde.',
    },
  },
];
