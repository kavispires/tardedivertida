// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  FEWEST_AUTO_REJECTS: {
    id: 'FEWEST_AUTO_REJECTS',
    doc: 'Number of answers auto-rejected',
    icon: 'check-mark',
    title: {
      en: 'Laser Focus',
      pt: 'Foco Total',
    },
    description: {
      en: 'Got auto-rejected answers the least',
      pt: 'Teve as respostas auto-rejeitadas menos vezes',
    },
  },
  MOST_AUTO_REJECTS: {
    id: 'MOST_AUTO_REJECTS',
    doc: 'Number of answers auto-rejected',
    icon: 'donkey',
    title: {
      en: 'Most Auto Rejected Answer',
      pt: 'Mais Respostas Erradas',
    },
    description: {
      en: 'Got auto-rejected answers the most for not following the letters',
      pt: 'Teve as respostas auto-rejeitadas mais vezes por não seguir as letras',
    },
  },
  FEWEST_REJECTED_CLUES: {
    id: 'FEWEST_REJECTED_CLUES',
    doc: 'Number of bad clues given (tracked but not awarded)',
    icon: 'light-bulb',
    title: {
      en: 'Pure Genius',
      pt: 'Gênio Puro',
    },
    description: {
      en: 'Gave the fewest rejected clues',
      pt: 'Deu as menos dicas rejeitadas',
    },
  },
  MOST_REJECTED_CLUES: {
    id: 'MOST_REJECTED_CLUES',
    doc: 'Number of bad clues given (tracked but not awarded)',
    icon: 'broken-bulb',
    title: {
      en: 'Creative Mind',
      pt: 'Mais Criativo',
    },
    description: {
      en: 'Gave the most rejected clues',
      pt: 'Deu as mais dicas rejeitadas',
    },
  },
  FEWEST_CELLS: {
    id: 'FEWEST_CELLS',
    doc: 'Number of cells answered',
    icon: 'minus',
    title: {
      en: 'Fewest Answers',
      pt: 'Menos Respostas',
    },
    description: {
      en: 'Answered the least cells',
      pt: 'Respondeu o menor número de células',
    },
  },
  MOST_CELLS: {
    id: 'MOST_CELLS',
    doc: 'Number of cells answered',
    icon: 'brain',
    title: {
      en: 'Most Answers',
      pt: 'Mais Respostas',
    },
    description: {
      en: 'Answered the most cells',
      pt: 'Respondeu o maior número de células',
    },
  },
  LEAST_FIRST_ANSWERS: {
    id: 'LEAST_FIRST_ANSWERS',
    doc: 'Number of times player answered first/fastest',
    icon: 'snail',
    title: {
      en: 'Slow and Steady',
      pt: 'Devagar e Sempre',
    },
    description: {
      en: 'First to answer the least times',
      pt: 'Respondeu primeiro o menor número de vezes',
    },
  },
  MOST_FIRST_ANSWERS: {
    id: 'MOST_FIRST_ANSWERS',
    doc: 'Number of times player answered first/fastest',
    icon: 'stopwatch',
    title: {
      en: 'Fastest Fingers',
      pt: 'Ligeirinho',
    },
    description: {
      en: 'First to answer the most times',
      pt: 'Respondeu primeiro o maior número de vezes',
    },
  },
  FEWEST_STOPS: {
    id: 'FEWEST_STOPS',
    doc: 'Number of times player stopped the game',
    icon: 'sand-timer',
    title: {
      en: 'Patient Player',
      pt: 'Sem Pressa',
    },
    description: {
      en: 'Pressed stop the least times',
      pt: 'Apertou stop o menor número de vezes',
    },
  },
  MOST_STOPS: {
    id: 'MOST_STOPS',
    doc: 'Number of times player stopped the game',
    icon: 'siren',
    title: {
      en: 'Most Stops',
      pt: 'Mais Stops',
    },
    description: {
      en: 'Pressed stop the most times',
      pt: 'Apertou stop o maior número de vezes',
    },
  },
  NEVER_STOPPED: {
    id: 'NEVER_STOPPED',
    doc: 'Player never stopped the game',
    icon: 'recycle',
    title: {
      en: 'Unstoppable',
      pt: 'Imparável',
    },
    description: {
      en: 'Was the only player that never pressed stop',
      pt: 'Foi o único jogador que nunca apertou stop',
    },
  },
};

export default achievementsReference;
