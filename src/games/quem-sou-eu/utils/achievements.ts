import { MedalArrowDownIcon } from 'icons/MedalArrowDownIcon';
import { MedalArrowUpIcon } from 'icons/MedalArrowUpIcon';
import { MedalNarrowIcon } from 'icons/MedalNarrowIcon';
import { MedalRobotIcon } from 'icons/MedalRobotIcon';
import { MedalThumbsDownIcon } from 'icons/MedalThumbsDownIcon';
import { MedalThumbsUpIcon } from 'icons/MedalThumbsUpIcon';

export const achievementsReference: AchievementReference = {
  MOST_GLYPHS: {
    Icon: MedalArrowUpIcon,
    title: {
      pt: 'Melhor Uso dos Ícones',
      en: 'Best Glyph User',
    },
    description: {
      pt: 'Usou o maior número de ícones durante o jogo',
      en: 'Used the most glyphs during the game',
    },
  },
  LEAST_GLYPHS: {
    Icon: MedalArrowDownIcon,
    title: {
      pt: 'Mais Sucinto',
      en: 'Most Succinct',
    },
    description: {
      pt: 'Usou o menor número de ícones durante o jogo',
      en: 'Used the fewest glyphs during the game',
    },
  },
  MOST_POSITIVE: {
    Icon: MedalThumbsUpIcon,
    title: {
      pt: 'Mais Positivo',
      en: 'Most Positive',
    },
    description: {
      pt: 'Usou mais ícones no lado positivo',
      en: 'Used the most glyphs on the positive side',
    },
  },
  LEAST_POSITIVE: {
    Icon: MedalThumbsUpIcon,
    title: {
      pt: 'Menos Positivo',
      en: 'Least Positive',
    },
    description: {
      pt: 'Usou menos ícones no lado positivo',
      en: 'Used the least glyphs on the positive side',
    },
  },
  MOST_NEGATIVE: {
    Icon: MedalThumbsDownIcon,
    title: {
      pt: 'Mais Negativo',
      en: 'Most Negative',
    },
    description: {
      pt: 'Usou mais ícones no lado negativo',
      en: 'Used the most glyphs on the negative side',
    },
  },
  LEAST_NEGATIVE: {
    Icon: MedalThumbsDownIcon,
    title: {
      pt: 'Menos Negativo',
      en: 'Least Negative',
    },
    description: {
      pt: 'Usou menos ícones no lado negativo',
      en: 'Used the least glyphs on the negative side',
    },
  },
  SINGLE_ICON: {
    Icon: MedalNarrowIcon,
    title: {
      pt: 'Mais Único',
      en: 'Most Unique',
    },
    description: {
      pt: 'Usou apenas um ícone mais vezes',
      en: 'Used a single icon most times',
    },
  },
  TABLE_VOTES: {
    Icon: MedalRobotIcon,
    title: {
      pt: 'Melhor Votador Pra Mesa',
      en: 'Best Table Voter',
    },
    description: {
      pt: 'Votou nas cartas extras que não eram de nenhum jogador mais vezes',
      en: "Voted for extra cards that didn't belong to any player the most",
    },
  },
};

export default achievementsReference;
