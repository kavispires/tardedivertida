import { cloneDeep } from 'lodash';
import { EpisodeLevel, EscapeRoomCard, EscapeRoomEpisode, ScoringCondition } from '../utils/types';
import { finalizeEpisode, prepareEpisode } from '../utils/helpers';

const TUTORIAL_EPISODE: EscapeRoomCard[] = [
  {
    id: '#',
    type: 'mission',
    header: {
      title: {
        en: 'Mission #1',
        pt: 'Missão #1',
      },
    },
    metadata: {
      level: 'basic',
    },
    content: {
      number: 1,
      title: {
        en: 'Welcome to the Escape Room Tutorial!',
        pt: 'Bem-vindo ao Tutorial de Escape Room!',
      },
      paragraphs: [
        {
          en: 'This is a tutorial episode to help you understand how the Escape Room works. You should always starts reading the Mission #1 card every time an episode begins.',
          pt: 'Este é um episódio tutorial para ajudá-los a entender como o Escape Room funciona. Vocês devem sempre começar lendo o cartão "Missão #1" toda vez que um episódio começa.',
        },
        {
          en: 'You must play one of the "Complete Mission" cards to finish the current mission and start the next one (if any).',
          pt: 'Se um episódio tiver várias missões, vocês devem jogar uma das cartas "Completar Missão" para terminar a missão atual e começar a próxima (se é que tem uma próxima).',
        },
        {
          en: 'When you finish the last mission, you must play the "Finish Episode" card to end the episode.',
          pt: 'Quando vocês terminarem a última missão, vocês devem jogar a carta "Completar Episódio" para encerrar o episódio.',
        },
        {
          en: 'Now, someone should play a "Complete Mission" card and then read "Mission #2" to continue the tutorial.',
          pt: 'Agora, alguém deve jogar uma carta "Completar Missão" e depois ler "Missão #2" para continuar o tutorial.',
        },
      ],
    },
  },
  {
    id: '#',
    type: 'mission',
    header: {
      title: {
        en: 'Mission #2',
        pt: 'Missão #2',
      },
    },
    metadata: {
      level: 'basic',
    },
    content: {
      number: 2,
      title: {
        en: 'Cards',
        pt: 'Cartas',
      },
      paragraphs: [
        {
          en: "You can always read the card you have in hand to the other players, unless the card specifically says you can't.",
          pt: 'Vocês podem sempre ler a carta que têm na mão para os outros jogadores, a menos que a carta diga especificamente que vocês não podem.',
        },
        {
          en: "You can also play the card you have in hand, unless the card specifically says you can't.",
          pt: 'Vocês também podem jogar a carta que têm na mão, a menos que a carta diga especificamente que vocês não podem.',
        },
        {
          en: 'However, a card can only be played ONCE and there are no take-backs. If someone plays a card by mistake, the mistake has been made and it will affect the rest of the game.',
          pt: 'No entanto, uma carta só pode ser jogada UMA VEZ e não há volta. Se alguém jogar uma carta por engano, o erro foi cometido e ele afetará o resto do jogo.',
        },
        {
          en: 'Play the Thing card "Pineapple". (Don\'t forget that when you think you have completed a mission, you must play a "Complete Mission" card to finish the current mission and start the next one).',
          pt: 'Joguem a carta Coisa "Abacaxi". (Não esqueça que quando você acha que terminou uma missão, você deve jogar uma carta "Completar Missão" para terminar a missão atual e começar a próxima).',
        },
      ],
    },
  },
  {
    id: '#',
    type: 'mission',
    header: {
      title: {
        en: 'Mission #3',
        pt: 'Missão #3',
      },
    },
    metadata: {
      level: 'basic',
    },
    content: {
      number: 3,
      title: {
        en: 'Winning Conditions',
        pt: 'Condições de Vitória',
      },
      paragraphs: [
        {
          en: 'Most of the time, the game will not tell you to play an specific card. Instead, it will give you hints or let you figure out the rules by yourself.',
          pt: 'Na maioria das vezes, o jogo não dirá para você jogar uma carta específica. Em vez disso, ele dará dicas ou deixará você descobrir as regras por si mesmo.',
        },
        {
          en: "That includes all plays to examine their cards and see if it is time to play an specific card. Let's test that:",
          pt: 'Isso inclui todos os jogadores examinarem suas cartas e verem se é hora de jogar uma carta específica. Vamos testar isso:',
        },
        {
          en: 'You should play a card now can you figure out which one?',
          pt: 'Vocês devem jogar uma carta agora, vocês conseguem descobrir qual é?',
        },
      ],
    },
  },
  {
    id: '#',
    type: 'mission',
    header: {
      title: {
        en: 'Mission #4',
        pt: 'Missão #4',
      },
    },
    metadata: {
      level: 'basic',
    },
    content: {
      number: 4,
      title: {
        en: "I think you're ready",
        pt: 'Acho que vocês estão prontos',
      },
      paragraphs: [
        {
          en: 'A couple things to know is that only a few cards are played each mission and you rarely would play mission or text cards.',
          pt: 'Últimas coisas para saber é que apenas algumas das cartas são jogadas em cada missão e raramente vocês jogarão cartas de Missão ou Texto.',
        },
        {
          en: 'Also, every player gets the same amount of cards every time, so filler cards related or not to the mission are used to balance the number of cards.',
          pt: 'Além disso, cada jogador recebe a mesma quantidade, então cartas extras relacionadas ou não à missão são usadas para equilibrar o número de cartas.',
        },
        {
          en: 'Now, play the "Complete Mission" card to finish the tutorial.',
          pt: 'Agora, joguem a carta "Completar Missão" para terminar o tutorial.',
        },
      ],
    },
  },
  {
    id: '#',
    type: 'text',
    header: {
      title: {
        en: 'Poem',
        pt: 'Poema',
      },
      iconId: '124',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      text: {
        en: 'Roses are red, violets are blue,\nif there are no stars in the sky,\nso an apple would do.',
        pt: 'Rosas são vermelhas, violetas são azuis,\nse não há estrelas no céu,\nentão uma maçã vai fazer jus.',
      },
    },
  },
  {
    id: '#',
    type: 'text',
    header: {
      title: {
        en: 'Poem',
        pt: 'Poema',
      },
      iconId: '1967',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      text: {
        en: 'Roses are red, violets are not gold,\nif there are stars in the sky,\nso a ball should be in the goal.',
        pt: 'Rosas são vermelhas, violetas não são verdes,\nse há estrelas no céu,\nentão bola na rede.',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Thing',
        pt: 'Coisa',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
      keyword: 'APPLE',
    },
    content: {
      itemId: '2046',
      caption: {
        en: 'Apple',
        pt: 'Maçã',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Thing',
        pt: 'Coisa',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
      keyword: 'STAR',
    },
    content: {
      itemId: '1279',
      caption: {
        en: 'Constellation',
        pt: 'Constelação',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Thing',
        pt: 'Coisa',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
      keyword: 'GOAL',
    },
    content: {
      itemId: '328',
      caption: {
        en: 'Goal',
        pt: 'Gol',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Thing',
        pt: 'Coisa',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
      keyword: 'BALL',
    },
    content: {
      itemId: '189',
      caption: {
        en: 'Soccer Ball',
        pt: 'Bola de Futebol',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Thing',
        pt: 'Coisa',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
      keyword: 'PINEAPPLE',
    },
    content: {
      itemId: '125',
      caption: {
        en: 'Pineapple',
        pt: 'Abacaxi',
      },
    },
  },
];

const TUTORIAL_FILLERS: EscapeRoomCard[] = [
  {
    id: '21',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '21',
      caption: {
        en: 'shovel',
        pt: 'pá',
      },
    },
  },
  {
    id: '669',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '669',
      caption: {
        en: 'camel',
        pt: 'camelo',
      },
    },
  },
  {
    id: '1844',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '1844',
      caption: {
        en: 'mango',
        pt: 'manga',
      },
    },
  },
  {
    id: '65',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '65',
      caption: {
        en: 'stapler',
        pt: 'grampeador',
      },
    },
  },
  {
    id: '23',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '23',
      caption: {
        en: 'piano',
        pt: 'piano',
      },
    },
  },
  {
    id: '1298',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '1298',
      caption: {
        en: 'chocolate syrup',
        pt: 'calda de chocolate',
      },
    },
  },
  {
    id: '156',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '156',
      caption: {
        en: 'hammer',
        pt: 'martelo',
      },
    },
  },
  {
    id: '764',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '764',
      caption: {
        en: 'party blower',
        pt: 'língua de sogra',
      },
    },
  },
  {
    id: '728',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '728',
      caption: {
        en: 'ladybug',
        pt: 'joaninha',
      },
    },
  },
  {
    id: '29',
    type: 'item',
    header: {
      title: {
        en: 'Item',
        pt: 'Item',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '29',
      caption: {
        en: 'brain',
        pt: 'cérebro',
      },
    },
  },
];

export function buildTutorialEpisode(episodeLevel: EpisodeLevel, playerCount: number): EscapeRoomEpisode {
  const { selectedCards: cards, missionKeywords } = prepareEpisode(cloneDeep(TUTORIAL_EPISODE), episodeLevel);

  console.log({ cards, missionKeywords });

  const includes: ScoringCondition[] = [];
  const excludes: ScoringCondition[] = [];
  const bonuses: ScoringCondition[] = [];

  const episode = finalizeEpisode(cards, cloneDeep(TUTORIAL_FILLERS), episodeLevel, playerCount, {
    includes,
    excludes,
    bonuses,
    ordered: [],
  });
  console.log({ episode });

  return episode;
}
