/* eslint-disable quotes */
// Constants
// import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
import type { BossIdeaCard } from '../../types/tdr';
// Utils
// import * as resourceUtils from '../resource';
import { GOODS_LIBRARY_COUNT } from './constants';
import utils from '../../utils';

/**
 * Get warehouse boss ideas and goods IDs
 * @returns Resource data containing boss ideas and goods IDs
 */
export const getData = async (): Promise<ResourceData> => {
  // Get full deck
  // const allBossIdeas = await resourceUtils.fetchResource<Dictionary<BossIdeaCard>>(
  //   TDR_RESOURCES.WAREHOUSE_BOSS_IDEAS,
  // );
  const allBossIdeas = BOSS_IDEAS;

  const goodsIds = utils.helpers.makeArray(GOODS_LIBRARY_COUNT, 1).map((i) => `good-${i}`);

  return { allBossIdeas, goodsIds };
};

export const BOSS_IDEAS: Dictionary<BossIdeaCard> = {
  FIRST_DAY: {
    id: 'FIRST_DAY',
    type: 'normal',
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
      pt: 'Para o seu primeiro dia, tudo funciona normalmente. Você discute e coloca as mercadorias no armazém uma de cada vez, de maneira organizada, sempre adjacente à mercadoria previamente colocada. Trabalho em equipe!',
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
      en: 'All goods this round must be placed on the outer edge of the warehouse, but they do not need to be adjacent to each other.',
      pt: 'Todas as mercadorias desta rodada devem ser colocadas na borda externa do armazém, mas não precisam ser adjacentes umas às outras.',
    },
    ogRule: 'Outside Contractor',
    difficulty: 1,
  },
  EYE_EXAM: {
    id: 'EYE_EXAM',
    type: 'visualization',
    title: {
      en: 'The Eye Exame',
      pt: 'O exame de vista',
    },
    subtitle: {
      en: "The Supervisor had an eye exam this morning and can't see the goods. I trust you can handle this.",
      pt: 'O Supervisor fez um exame de vista esta manhã e não pode ver as mercadorias. Eu tenho certeza que vocês conseguem lidar com isso.',
    },
    description: {
      en: 'The Supervisor cannot see the good, but the team can. The team must describe the goods to the Supervisor so they can place it.',
      pt: 'O Supervisor não pode ver a mercadoria, mas a equipe pode. A equipe deve descrever as mercadorias para o Supervisor para que ele possa colocá-las.',
    },
    ogRule: 'Management Guru-ish',
    difficulty: 2,
  },
  TINTED_GLASS: {
    id: 'TINTED_GLASS',
    type: 'image',
    title: {
      en: 'The tinted glass box',
      pt: 'A caixa de vidro fumê',
    },
    subtitle: {
      en: "We're getting extremely important goods that comes in a special box.",
      pt: 'Estamos recebendo mercadorias extremamente importantes que vêm em uma caixa especial.',
    },
    description: {
      en: "The goods are inside a tinted glass box, making it difficult to see what's inside.",
      pt: 'As mercadorias estão dentro de uma caixa de vidro fumê, tornando difícil ver o que está dentro.',
    },
    ogRule: 'Our Precious Secrets',
    difficulty: 3,
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
      en: 'All goods this round must be placed in a single aisle, but they do not need to be adjacent to each other.',
      pt: 'Todas as mercadorias desta rodada devem ser colocadas em um único corredor, mas não precisam ser adjacentes umas às outras.',
    },
    ogRule: 'None',
    difficulty: 2,
  },
  CONFIDENTIAL: {
    id: 'CONFIDENTIAL',
    type: 'visualization',
    title: {
      en: 'Confidential Goods',
      pt: 'Mercadorias Confidenciais',
    },
    subtitle: {
      en: 'These products are very important and must be kept secret!',
      pt: 'Esses produtos são muito importantes e devem ser mantidos em segredo!',
    },
    description: {
      en: 'Only the Supervisor can the the goods this round. They may describe the goods to the team before placing.',
      pt: 'Apenas o Supervisor pode ver as mercadorias desta rodada. Ele pode descrever as mercadorias para a equipe antes de colocá-las.',
    },
    ogRule: 'Confidential Material',
    difficulty: 2,
  },
  ONE_WORD: {
    id: 'ONE_WORD',
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
      en: 'Each worker can only say one word for each good. You may repeat that word',
      pt: 'Cada trabalhador só pode dizer uma palavra para cada mercadoria. Você pode repetir essa palavra',
    },
    ogRule: 'Could have been an email',
    difficulty: 3,
  },
  FENG_SHUI: {
    id: 'FENG_SHUI',
    type: 'special',
    title: {
      en: 'Feng Shui',
      pt: 'Feng Shui',
    },
    subtitle: {
      en: 'This warehouse was not built with good Feng Shui. I rotated everything to fix it!',
      pt: 'Este armazém não foi construído com bom Feng Shui. Girei tudo para ficar melhor!',
    },
    description: {
      en: 'The warehouse grid was rotated 90 degrees this round. Can you remember where everything was?',
      pt: 'A grade do armazém foi rotacionada 90 graus nesta rodada. Você consegue se lembrar de onde estava tudo?',
    },
    ogRule: 'U Turn',
    difficulty: 3,
  },
  CRANE: {
    id: 'CRANE',
    type: 'special',
    title: {
      en: 'The Crane',
      pt: 'O Guindaste',
    },
    subtitle: {
      en: 'I bought this crane to help, you guys must help the supervisor to place it.',
      pt: 'Comprei este guindaste para ajudar, vocês devem ajudar o supervisor a colocá-lo.',
    },
    description: {
      en: 'The supervisor cannot see the good and the others without telling what it is must tell the supervisor where to place it!',
      pt: 'O supervisor não pode ver a mercadoria e os outros sem dizer o que é devem dizer ao supervisor onde colocá-lo!',
    },
    ogRule: 'Crane Training',
    difficulty: 2,
  },
  BLIND_BOX: {
    id: 'BLIND_BOX',
    type: 'special',
    title: {
      en: 'Blind Box',
      pt: 'A Caixa Surpresa',
    },
    subtitle: {
      en: 'These new products are a surprise! Nobody can see!',
      pt: 'Esses novos produtos são uma surpresa!',
    },
    description: {
      en: 'Nobody can see the good until it is placed. Then you can discuss why it was placed there.',
      pt: 'Ninguém pode ver a mercadoria até que ela seja colocada. Então você pode discutir por que ela foi colocada lá.',
    },
    ogRule: 'Unexpected Item in Area',
    difficulty: 2,
  },

  // AMENITIES: {
  //   id: 'AMENITIES',
  //   type: 'special',
  //   title: {
  //     en: 'Amenities',
  //     pt: 'Comodidades',
  //   },
  //   subtitle: {
  //     en: "You asked for it and we're going to improve the work environment! But only use it during your breaks!",
  //     pt: 'Vocês pediram e vamos melhorar o ambiente de trabalho! Mas só usem durante os intervalos!',
  //   },
  //   description: {
  //     en: 'Four space blockers representing amenities are placed in the warehouse. That should actually help!',
  //     pt: 'Quatro bloqueadores de espaço representando comodidades são colocados no armazém. Isso deve ajudar!',
  //   },
  //   ogRule: 'Unidentified spills',
  //   difficulty: 1,
  // },
};
