import { MedalArrowDownIcon } from 'icons/MedalArrowDownIcon';
import { MedalArrowUpIcon } from 'icons/MedalArrowUpIcon';
import { MedalFootprintsIcon } from 'icons/MedalFootprintsIcon';
import { MedalPersonIcon } from 'icons/MedalPersonIcon';
import { MedalSkullIcon } from 'icons/MedalSkullIcon';

export const achievementsReference: AchievementReference = {
  MOST_MATCHES: {
    Icon: MedalArrowUpIcon,
    title: {
      pt: 'Mais Matches',
      en: 'Best Matcher',
    },
    description: {
      pt: 'As respostas combinaram mais vezes com outros jogadores',
      en: 'Their answers matched the most with other players',
    },
  },
  LEAST_MATCHES: {
    Icon: MedalArrowDownIcon,
    title: {
      pt: 'Mais Diferentão',
      en: 'Most Unique',
    },
    description: {
      pt: 'As respostas combinaram menos vezes com outros jogadores',
      en: 'Their answers matched the least with other players',
    },
  },
  MOST_DEAD: {
    Icon: MedalSkullIcon,
    title: {
      pt: 'Mais Morta',
      en: 'Most Dead',
    },
    description: {
      pt: 'A única ovelhinha morta no final',
      en: 'The only dead sheep in the end',
    },
  },
  MOST_LONELY: {
    Icon: MedalPersonIcon,
    title: {
      pt: 'Mais Solitária',
      en: 'Most Lonely',
    },
    description: {
      pt: 'A única ovelhinha num pasto sozinha no final',
      en: 'The only sheep by itself in the end',
    },
  },
  BEST_TRAVELER: {
    Icon: MedalFootprintsIcon,
    title: {
      pt: 'Mais Viajada',
      en: 'Best Traveler',
    },
    description: {
      pt: 'Ovelhinha que mais moveu pra direita e esquerda',
      en: 'Sheep who moved the most left or right',
    },
  },
};

export default achievementsReference;
