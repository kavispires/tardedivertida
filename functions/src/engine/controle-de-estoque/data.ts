// Types
import type { BossIdeaCardData } from '../../types/tdr';
import type { ResourceData } from './types';
// Constants
import { GOODS_LIBRARY_COUNT } from './constants';

// import * as resourceUtils from '../resource';

import utils from '../../utils';

/**
 * Get warehouse boss ideas and goods IDs
 * @returns Resource data containing boss ideas and goods IDs
 */
export const getData = async (): Promise<ResourceData> => {
  // Get full deck
  // const allBossIdeas = await fetchResource<Dictionary<BossIdeaCardData>>(
  //   TDR_RESOURCES.WAREHOUSE_BOSS_IDEAS,
  // );
  const allBossIdeas = BOSS_IDEAS;

  const goodsIds = utils.helpers.makeArray(GOODS_LIBRARY_COUNT, 1).map((i) => `good-${i}`);

  return { allBossIdeas, goodsIds };
};

export const BOSS_IDEAS: Dictionary<BossIdeaCardData> = {
  FIRST_DAY: {
    id: 'FIRST_DAY',
    type: 'default',
    title: {
      en: 'First Day',
      pt: 'Primeiro Dia',
    },
    subtitle: {
      en: "Welcome to the warehouse! It's time to get to work.",
      pt: 'Bem-vindo ao galpão! É hora de começar a trabalhar.',
    },
    description: {
      en: 'For your first day, everything works are normal. You discuss and place goods in the warehouse one at a time, in an organized manner, always adjacent to the previously placed good. Team work!',
      pt: 'Para o seu primeiro dia, tudo funciona normalmente. Vocês discutem e colocam as mercadorias no galpão uma de cada vez, de maneira organizada, sempre adjacente a uma mercadoria previamente colocada. Trabalho em equipe!',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    ogRule: 'None',
    difficulty: 0,
  },
  WALLS: {
    id: 'WALLS',
    type: 'placement',
    title: {
      en: 'Walls',
      pt: 'Paredes',
    },
    subtitle: {
      en: 'What if we put everything on the walls to save space?',
      pt: 'E se colocarmos tudo nas paredes para economizar espaço?',
    },
    description: {
      en: 'All goods this round must be placed on the outer edges of the warehouse. They do not need to be adjacent to each other.',
      pt: 'Todas as mercadorias desta rodada devem ser colocadas nas bordas externas do galpão. Elas não precisam ser adjacentes umas às outras.',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    ogRule: 'Outside Contractor',
    difficulty: 1,
  },
  AISLE: {
    id: 'AISLE',
    type: 'placement',
    title: {
      en: 'The aisle',
      pt: 'O corredor',
    },
    subtitle: {
      en: 'What if we put everything in a single aisle to save space?',
      pt: 'E se colocarmos tudo em um único corredor para economizar espaço?',
    },
    description: {
      en: 'All goods this round must be placed in a single row or column of the warehouse. They do not need to be adjacent to each other.',
      pt: 'Todas as mercadorias desta rodada devem ser colocadas em uma única linha ou coluna do galpão. Elas não precisam ser adjacentes umas às outras.',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    ogRule: 'None',
    difficulty: 2,
  },
  FOCUS: {
    id: 'FOCUS',
    type: 'communication',
    title: {
      en: 'Provisional measure: Silence',
      pt: 'Medida provisória: Silêncio',
    },
    subtitle: {
      pt: 'Conversa fiada faz mal ao trabalho!',
      en: 'Chit-chat is bad for work!',
    },
    description: {
      en: 'Each worker can only say the letter where they want the good to be placed',
      pt: 'Cada trabalhador só pode dizer a letra onde deseja que a mercadoria seja colocada, nada mais!',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected! Talk freely now',
      pt: 'Embalar os produtos os deixam protegidos! Conversem livremente agora',
    },
    ogRule: 'Could have been an email',
    difficulty: 3,
  },
  TIMER_EFFICIENCY: {
    id: 'TIMER_EFFICIENCY',
    type: 'communication',
    title: {
      en: 'Time is Money',
      pt: 'Tempo é Dinheiro',
    },
    subtitle: {
      en: 'We need to be faster! You have only 15 seconds to decide!',
      pt: 'Precisamos ser mais rápidos! Vocês têm apenas 15 segundos para decidir!',
    },
    description: {
      en: 'You have only 15 seconds to discuss and place the good. Once placed, it cannot be changed!',
      pt: 'Vocês têm apenas 15 segundos para discutir e colocar a mercadoria. Uma vez colocada, não pode ser alterada!',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    difficulty: 2,
    disabled: true,
  },
  EYE_EXAM: {
    id: 'EYE_EXAM',
    type: 'supervisor-visualization',
    title: {
      en: 'The Eye Exame',
      pt: 'O exame de vista',
    },
    subtitle: {
      en: "The Supervisor had an eye exam this morning and can't see the goods. I trust you can handle this.",
      pt: 'O Supervisor fez um exame de vista esta manhã e não pode ver as mercadorias. Eu tenho certeza que vocês conseguem lidar com isso.',
    },
    description: {
      en: 'The Supervisor cannot see the good, but the workers can. The workers can see and talk freely to help the Supervisor place it correctly.',
      pt: 'O Supervisor não pode ver a mercadoria, mas os trabalhadores podem e podem falar livremente para ajudar o Supervisor a colocá-la corretamente.',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    ogRule: 'Management Guru-ish',
    difficulty: 2,
  },
  CRANE: {
    id: 'CRANE',
    type: 'supervisor-visualization',
    title: {
      en: 'The Crane',
      pt: 'O Guindaste',
    },
    subtitle: {
      en: 'I bought this crane to help, you must guide the Supervisor!',
      pt: 'Comprei este guindaste para ajudar, vocês devem guiar o Supervisor!',
    },
    description: {
      en: 'The Supervisor cannot see the good. The workers can see it but may NOT say what it is - they can only tell the Supervisor WHERE to place it!',
      pt: 'O Supervisor não pode ver a mercadoria. Os trabalhadores podem vê-la, mas NÃO podem dizer o que é - apenas ONDE colocá-la!',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected! Talk freely now',
      pt: 'Embalar os produtos os deixam protegidos! Conversem livremente agora',
    },
    ogRule: 'Crane Training',
    difficulty: 2,
  },
  CONFIDENTIAL: {
    id: 'CONFIDENTIAL',
    type: 'worker-visualization',
    title: {
      en: 'Confidential Goods',
      pt: 'Mercadorias Confidenciais',
    },
    subtitle: {
      en: 'These products are very important and must be kept secret!',
      pt: 'Esses produtos são muito importantes e devem ser mantidos em segredo!',
    },
    description: {
      en: 'Only the Supervisor can see the goods this round. The Supervisor can see and talk freely before placing.',
      pt: 'Apenas o Supervisor pode ver as mercadorias desta rodada. O Supervisor pode ver e falar livremente antes de colocar.',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected! Talk freely now',
      pt: 'Embalar os produtos os deixam protegidos! Conversem livremente agora',
    },
    ogRule: 'Confidential Material',
    difficulty: 2,
  },
  BLIND_BOX: {
    id: 'BLIND_BOX',
    type: 'worker-visualization',
    title: {
      en: 'Blind Box',
      pt: 'A Caixa Surpresa',
    },
    subtitle: {
      en: 'These new products are a surprise! Nobody can see them!',
      pt: 'Esses novos produtos são uma surpresa! Ninguém pode vê-los!',
    },
    description: {
      en: 'Workers cannot see the good. The Supervisor can see it but CANNOT talk before placing it. After placement, everyone can see and discuss.',
      pt: 'Os trabalhadores não podem ver a mercadoria. O Supervisor pode vê-la, mas NÃO PODE falar antes de colocá-la. Após colocar, todos podem ver e discutir.',
    },
    afterPlacement: {
      en: "Let's take a peak before we store it and talk about it",
      pt: 'Vamos dar uma olhada antes de armazenar e conversar sobre o produto',
    },
    ogRule: 'Unexpected ItemData in Area',
    difficulty: 2,
  },
  FENG_SHUI: {
    id: 'FENG_SHUI',
    type: 'reorganization',
    title: {
      en: 'Feng Shui',
      pt: 'Feng Shui',
    },
    subtitle: {
      en: 'This warehouse was not built with good Feng Shui. I rotated everything to fix it!',
      pt: 'Este galpão não foi projetado com bom Feng Shui. Girei tudo para ficar melhor!',
    },
    description: {
      en: 'The warehouse grid has been rotated 90 degrees! All previously placed goods have been rotated. Can you remember where everything was?',
      pt: 'A grade do galpão foi rotacionada 90 graus! Todas as mercadorias colocadas anteriormente foram rotacionadas. Você consegue se lembrar de onde estava tudo?',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    ogRule: 'U Turn',
    difficulty: 3,
    disabled: true,
  },
  MIRROR: {
    id: 'MIRROR',
    type: 'reorganization',
    title: {
      en: 'Mirror Warehouse',
      pt: 'Galpão Espelhado',
    },
    subtitle: {
      en: 'I installed mirrors to make the warehouse look bigger!',
      pt: 'Instalei espelhos para fazer o galpão parecer maior!',
    },
    description: {
      en: 'The warehouse has been mirrored horizontally! All previously placed goods are now on the opposite side. Can you adapt?',
      pt: 'O galpão foi espelhado horizontalmente! Todas as mercadorias colocadas anteriormente estão agora no lado oposto. Conseguem se adaptar?',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    difficulty: 3,
    disabled: true,
  },
  TINTED_GLASS: {
    id: 'TINTED_GLASS',
    type: 'any-visualization',
    title: {
      en: 'The tinted glass boxes',
      pt: 'As caixas de vidro fumê',
    },
    subtitle: {
      en: "We're getting extremely important goods that come in special boxes.",
      pt: 'Estamos recebendo mercadorias extremamente importantes que vêm em caixas especiais.',
    },
    description: {
      en: "The goods are inside tinted glass boxes, making it difficult to see what's inside.",
      pt: 'As mercadorias estão dentro de caixas de vidro fumê, tornando difícil ver o que está dentro.',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    ogRule: 'Our Precious Secrets',
    difficulty: 3,
  },
  POWER_OUTAGE: {
    id: 'POWER_OUTAGE',
    type: 'any-visualization',
    title: {
      en: 'Power Outage',
      pt: 'Queda de Energia',
    },
    subtitle: {
      en: 'The power went out! We only have emergency lights.',
      pt: 'A energia caiu! Temos apenas luzes de emergência.',
    },
    description: {
      en: 'Everything is in black and white with low contrast. Both Supervisor and workers can only see a dim version of the goods.',
      pt: 'Tudo está em preto e branco com baixo contraste. Tanto o Supervisor quanto os trabalhadores só conseguem ver uma versão escura das mercadorias.',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    difficulty: 2,
    disabled: false,
  },
  DAMAGED_GOOD: {
    id: 'DAMAGED_GOOD',
    type: 'any-visualization',
    title: {
      en: 'Damaged Shipment',
      pt: 'Entrega Danificada',
    },
    subtitle: {
      en: 'The delivery truck had an accident! Some boxes are damaged.',
      pt: 'O caminhão de entrega teve um acidente! Algumas caixas estão danificadas.',
    },
    description: {
      en: 'The goods arrived damaged - only part of each good is visible to everyone. Can you figure out what they are?',
      pt: 'As mercadorias chegaram danificadas - apenas parte de cada mercadoria está visível para todos. Conseguem descobrir o que são?',
    },
    afterPlacement: {
      en: 'Storing the packed goods keeps them protected!',
      pt: 'Embalar os produtos os deixam protegidos!',
    },
    difficulty: 2,
  },
};

// Write a self invoking function that console.logs the counts of each different type of boss idea
// (() => {
//   const counts: Dictionary<number> = {};
//   const availableBossIdeas = Object.values(BOSS_IDEAS).filter((bossIdea) => !bossIdea.disabled);
//   Object.values(BOSS_IDEAS).forEach((bossIdea) => {
//     if (!counts[bossIdea.type]) {
//       counts[bossIdea.type] = 0;
//     }
//     counts[bossIdea.type]++;
//   });
//   console.log(counts);
//   console.log(`Total boss ideas: ${Object.values(BOSS_IDEAS).length}`);
//   console.log(`Available boss ideas: ${availableBossIdeas.length}`);
// })();
