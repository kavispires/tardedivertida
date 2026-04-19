export const NA_FILA_DO_BANCO_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  CARD_PLAY: 'CARD_PLAY',
  ROUND_RESOLUTION: 'ROUND_RESOLUTION',
  GAME_OVER: 'GAME_OVER',
};

export const NA_FILA_DO_BANCO_ACTIONS = {
  PLAY_CARD: 'PLAY_CARD',
};

export const OUTCOME = {
  SETUP: 'SETUP',
  CONTINUE: 'CONTINUE',
  END_ROUND: 'END_ROUND',
};

export const TELLER_EFFECT_TYPE = {
  STAY: 'STAY',
  CUT_IN_FRONT: 'CUT_IN_FRONT',
  BRING_NEXT_TO_ME: 'BRING_NEXT_TO_ME',
  REMOVE_THREE: 'REMOVE_THREE',
  BRING_NEXT_TO_ME_AND_REMOVE_THREE: 'BRING_NEXT_TO_ME_AND_REMOVE_THREE',
};

export const CHARACTER_TYPES: Dictionary<{
  id: string;
  imageId: string;
  spriteId: number;
  name: DualLanguageValue;
  cutIn: string | null;
  cutSpeech: DualLanguageValue;
  description: DualLanguageValue;
  thankYouSpeech?: DualLanguageValue;
}> = {
  RETIREE: {
    id: 'RETIREE',
    imageId: 'nfdb-neutral-1',
    spriteId: 1,
    name: {
      pt: 'Aposentada',
      en: 'Retiree',
    },
    cutIn: 'VETERAN',
    description: {
      en: "The Retiree goes in front of the Old Veteran, after all she's old and a woman",
      pt: 'A Aposentada vai na frente do Velho Deficiente, afinal ela é idosa e vei acha ela gostosa',
    },
    cutSpeech: {
      pt: 'Aquele senhor ali com certeza me deixa passar na frente, olha a carinha dele',
      en: 'That old man there will definitely let me cut in front of him, just look at his face',
    },
    thankYouSpeech: {
      pt: 'Obrigada, queridão',
      en: 'Thank you, hot stuff',
    },
  },
  VETERAN: {
    id: 'VETERAN',
    imageId: 'nfdb-neutral-2',
    spriteId: 2,
    name: {
      pt: 'Velho Deficiente',
      en: 'War Veteran',
    },
    cutIn: 'MOTHER',
    description: {
      en: 'The Veteran goes in front of the Pregnant woman, after all he has served the country',
      pt: 'O Deficiente vai na frente da Gestante, afinal ele tem mais dificuldade de locomoção',
    },
    cutSpeech: {
      pt: 'Minha perna é meio ruim, minha filha, deixa eu passar na sua frente?',
      en: 'My leg is a bit bad, miss, can I cut in front of you?',
    },
    thankYouSpeech: {
      pt: 'Obrigado por me deixar passar na frente, moça',
      en: "Thank you for letting me cut in front of you, ma'am",
    },
  },
  MOTHER: {
    id: 'MOTHER',
    imageId: 'nfdb-neutral-3',
    spriteId: 3,
    name: {
      pt: 'Gestante',
      en: 'Pregnant Woman',
    },
    cutIn: 'BUSINESSMAN',
    description: {
      en: 'The Pregnant woman goes in front of the Businessman, after all she is expecting a child',
      pt: 'A Gestante vai na frente do Empresário, afinal ela está esperando um filho',
    },
    cutSpeech: {
      pt: 'Será que aquele empresário me deixa passar na frente dele?',
      en: 'Do you think that businessman will let me cut in front of him?',
    },
    thankYouSpeech: {
      pt: 'Obrigada por me deixar passar na frente',
      en: 'Thank you for letting me cut in front of you',
    },
  },
  BUSINESSMAN: {
    id: 'BUSINESSMAN',
    imageId: 'nfdb-neutral-4',
    spriteId: 4,
    name: {
      pt: 'Empresário',
      en: 'Businessman',
    },
    cutIn: 'STUDENT',
    description: {
      en: "The Businessman goes in front of the Student, after all he a busy man and she's just a kid",
      pt: 'O Empresário vai na frente da Estudante, afinal ele é um homem ocupado e ela ainda é nova',
    },
    cutSpeech: {
      pt: 'Sou uma pessoa muito ocupada!',
      en: 'I am a very busy person!',
    },
    thankYouSpeech: {
      pt: 'Continue estudando e um dia será rica como eu',
      en: 'Keep studying and one day you will be as rich as me',
    },
  },
  STUDENT: {
    id: 'STUDENT',
    imageId: 'nfdb-neutral-5',
    spriteId: 5,
    name: {
      pt: 'Estudante',
      en: 'Student',
    },
    cutIn: 'STUDENT',
    description: {
      en: "The Student goes in front of the Courier, after all she's super hot",
      pt: 'A Estudante vai na frente do Motoboy, afinal ela é super gata',
    },
    cutSpeech: {
      pt: 'Eu sou gostosa e vou entrar na frente do motoboy',
      en: "I'm hot and I'm cutting in front of the motoboy",
    },
    thankYouSpeech: {
      pt: 'Obrigada por me deixar passar na frente, gatinho',
      en: 'Thank you for letting me cut in front of you, cutie',
    },
  },
  MOTOBOY: {
    id: 'MOTOBOY',
    imageId: 'nfdb-neutral-6',
    spriteId: 6,
    name: {
      pt: 'Motoboy',
      en: 'Courier',
    },
    cutIn: 'RETIREE',
    description: {
      en: "The Courier goes in front of the Retiree, after all he's in a hurry and the Retiree is slow",
      pt: 'O Motoboy vai na frente da Aposentada, afinal ele está com pressa e a Aposentada é devagar',
    },
    cutSpeech: {
      pt: 'Nossa, estou com muita pressa',
      en: "Wow, I'm in a hurry",
    },
    thankYouSpeech: {
      pt: 'Essa veia que espere!',
      en: 'This old lady can wait!',
    },
  },
  KID: {
    id: 'KID',
    imageId: 'nfdb-neutral-0',
    spriteId: 0,
    name: {
      pt: 'Criança',
      en: 'Kid',
    },
    cutIn: null,
    description: {
      en: "When a kid joins the line, if there's another person of the same color as the kid in line, that person will leave the line and be behind the kid taking care of her. Also, the kid scores 0 points if they are served by the teller.",
      pt: 'Quando uma criança entra na fila, se já tiver outra pessoa da mesma cor na fila, essa pessoa sai da fila e fica atrás da criança cuidando dela. Além disso, não ganha nenhum ponto se for atendida pelo caixa.',
    },
    cutSpeech: {
      pt: 'Estou sozinha e desamparada',
      en: "I'm alone and helpless",
    },
    thankYouSpeech: {
      pt: 'Que bom que você me viu',
      en: "I'm glad you noticed me",
    },
  },
};

export const ORDER = [
  CHARACTER_TYPES.RETIREE,
  CHARACTER_TYPES.VETERAN,
  CHARACTER_TYPES.MOTHER,
  CHARACTER_TYPES.BUSINESSMAN,
  CHARACTER_TYPES.STUDENT,
  CHARACTER_TYPES.MOTOBOY,
  CHARACTER_TYPES.KID,
];

export const TELLER_TYPES = {
  ATM: 'ATM', // High capacity, low points
  HUMAN: 'HUMAN', // Normal capacity, normal points
  MANAGER: 'MANAGER', // Low capacity, double points
};
