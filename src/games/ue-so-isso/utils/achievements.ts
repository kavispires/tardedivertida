// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  LONGEST_CLUES: {
    id: 'LONGEST_CLUES',
    doc: 'the length of clue words',
    icon: 'arrow-wide',
    title: {
      en: 'Best typer',
      pt: 'Melhor Digitador',
    },
    description: {
      en: 'Had the lengthiest clues',
      pt: 'Teve as dicas mais longas',
    },
  },
  SHORTEST_CLUES: {
    id: 'SHORTEST_CLUES',
    doc: 'the length of clue words',
    icon: 'arrow-narrow',
    title: {
      en: 'Most Succinct',
      pt: 'Mais Sucinto',
    },
    description: {
      en: 'Had the shortest clues',
      pt: 'Teve as dicas mais curtas',
    },
  },
  FEWEST_CLUES_GIVEN: {
    id: 'FEWEST_CLUES_GIVEN',
    doc: 'how many clues were given',
    icon: 'arrow-down',
    title: {
      en: 'Mind Reader',
      pt: 'Leitor de Mentes',
    },
    description: {
      en: 'Was given the fewest clues by other players to work with.',
      pt: 'Recebeu o menor número de dicas dos outros jogadores para trabalhar.',
    },
  },
  MOST_CLUES_GIVEN: {
    id: 'MOST_CLUES_GIVEN',
    doc: 'how many clues were given',
    icon: 'arrow-up',
    title: {
      en: 'VIP Treatment',
      pt: 'Tratamento VIP',
    },
    description: {
      en: 'Was given the most clues by other players to work with.',
      pt: 'Recebeu o maior número de dicas dos outros jogadores para trabalhar.',
    },
  },
  BEST_GUESSER: {
    id: 'BEST_GUESSER',
    doc: 'Correct guesses with fewest clues',
    icon: 'brain',
    title: {
      en: 'Best Guesser',
      pt: 'Melhor Adivinhador',
    },
    description: {
      en: 'Guessed correctly with the fewest average number of clues',
      pt: 'Adivinhou com o menor número médio de dicas',
    },
  },
  FEWEST_ELIMINATED_CLUES: {
    id: 'FEWEST_ELIMINATED_CLUES',
    doc: 'how many clues were eliminated',
    icon: 'check-mark',
    title: {
      en: 'Wisest',
      pt: 'Mais Sábio',
    },
    description: {
      en: 'Got their clues to be eliminated the fewest',
      pt: 'Teve dicas eliminadas menos vezes',
    },
  },
  MOST_ELIMINATED_CLUES: {
    id: 'MOST_ELIMINATED_CLUES',
    doc: 'how many clues were eliminated',
    icon: 'people',
    title: {
      en: 'Best Common Sense',
      pt: 'Melhor Senso Comum',
    },
    description: {
      en: 'Got their clues to be eliminated the most',
      pt: 'Teve dicas eliminadas mais vezes',
    },
  },
  MOST_PASSES: {
    id: 'MOST_PASSES',
    doc: 'how many times pressed pass when it was the guesser',
    icon: 'face-panic',
    title: {
      en: 'Most Scared',
      pt: 'Mais Medroso',
    },
    description: {
      en: 'Pressed pass the most',
      pt: 'Passou mais vezes',
    },
  },
  WORST_GUESSER: {
    id: 'WORST_GUESSER',
    doc: 'Wrong guesses with most clues',
    icon: 'broken-bulb',
    title: {
      en: 'Most Wild Guesser',
      pt: 'Mais Audacioso',
    },
    description: {
      en: 'Guessed wrong with the most average number of clues',
      pt: 'Errou com o maior número médio de dicas',
    },
  },
};

export default achievementsReference;
