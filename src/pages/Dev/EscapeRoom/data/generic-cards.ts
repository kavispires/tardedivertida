import { EscapeRoomCard } from '../utils/types';

export const GENERIC_CARDS: Dictionary<EscapeRoomCard> = {
  COMPLETE_MISSION: {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Complete Mission',
        pt: 'Completar Missão',
      },
    },
    metadata: {
      level: 'basic',
      keyword: 'COMPLETE_EPISODE',
    },
    content: {
      itemId: '2079',
      message: {
        text: {
          en: 'When you think you have completed the mission, play this card',
          pt: 'Quando você achar que completou a missão, use esta carta',
        },
      },
    },
  },
  FINISH_EPISODE: {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Finish Episode',
        pt: 'Finalizar Episódio',
      },
    },
    metadata: {
      level: 'basic',
      keyword: 'FINISH_EPISODE',
    },
    content: {
      itemId: '2048',

      message: {
        text: {
          en: 'When you think you have finished the episode, play this card',
          pt: 'Quando você achar que terminou o episódio, use esta carta',
        },
      },
    },
  },
};
