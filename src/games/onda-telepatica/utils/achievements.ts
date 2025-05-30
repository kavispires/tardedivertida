// Types
import type { AchievementReference } from 'types/achievements';

export const achievementsReference: AchievementReference = {
  MOST_ACCURATE: {
    icon: 'arrow-up',
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
    icon: 'arrow-down',
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
    icon: 'arrow-narrow',
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
    icon: 'brain',
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
    icon: 'box',
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

export default achievementsReference;
