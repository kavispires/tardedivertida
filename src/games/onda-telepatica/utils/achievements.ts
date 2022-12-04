import { MedalArrowDownIcon } from 'components/icons/MedalArrowDownIcon';
import { MedalArrowUpIcon } from 'components/icons/MedalArrowUpIcon';
import { MedalCloseIcon } from 'components/icons/MedalCloseIcon';
import { MedalLightBulbIcon } from 'components/icons/MedalLightBulbIcon';
import { MedalNarrowIcon } from 'components/icons/MedalNarrowIcon';

export const achievementsReference: AchievementReference = {
  MOST_ACCURATE: {
    Icon: MedalArrowUpIcon,
    title: {
      pt: 'Mais Preciso',
      en: 'Most Accurate',
    },
    description: {
      pt: 'Os palpites foram mais próximos do ponteiro do que qualquer outro jogador',
      en: 'Their guesses were closer to the needle than other players',
    },
  },
  LEAST_ACCURATE: {
    Icon: MedalArrowDownIcon,
    title: {
      pt: 'Menos Preciso',
      en: 'Least Accurate',
    },
    description: {
      pt: 'Os palpites foram mais longe do ponteiro do que qualquer outro jogador',
      en: 'Their guesses were farther to the needle than other players',
    },
  },
  MOST_EXACT: {
    Icon: MedalNarrowIcon,
    title: {
      pt: 'Mais Exato',
      en: 'Most Exact',
    },
    description: {
      pt: 'Mais palpites exatamente no ponteiro do que qualquer outro jogador',
      en: 'Most guesses exactly on the needle than other players',
    },
  },
  BEST_PSYCHIC: {
    Icon: MedalLightBulbIcon,
    title: {
      pt: 'Melhor Medium',
      en: 'Best Medium',
    },
    description: {
      pt: 'Ganhou mais pontos por outros jogadores adivinhando sua dica',
      en: 'Got the most points by other players guessing their clue',
    },
  },
  MOST_ZEROS: {
    Icon: MedalCloseIcon,
    title: {
      pt: 'Mais Diferentão',
      en: 'Outside of the Box Thinker',
    },
    description: {
      pt: 'Não ganhou nenhum ponto em mais rodadas',
      en: 'Did not score any points in a round more times',
    },
  },
};
