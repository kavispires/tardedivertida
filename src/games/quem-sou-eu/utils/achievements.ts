// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  CHOOSE_FOR_ME: {
    id: 'CHOOSE_FOR_ME',
    doc: 'how many times the player chose the ',
    icon: 'dice',
    title: {
      en: 'The Shirker',
      pt: 'Menos Brasileiro',
    },
    description: {
      en: "Pressed 'Guess for me' the most",
      pt: 'Apertou o botão Chutar Restantes mais vezes',
    },
  },
  LEAST_GLYPHS: {
    id: 'LEAST_GLYPHS',
    doc: 'how many glyphs the player has used',
    icon: 'arrow-down',
    title: {
      en: 'Most Succinct',
      pt: 'Mais Sucinto',
    },
    description: {
      en: 'Used the fewest glyphs during the game',
      pt: 'Usou o menor número de ícones durante o jogo',
    },
  },
  MOST_GLYPHS: {
    id: 'MOST_GLYPHS',
    doc: 'how many glyphs the player has used',
    icon: 'arrow-up',
    title: {
      en: 'Best Glyph User',
      pt: 'Melhor Uso dos Ícones',
    },
    description: {
      en: 'Used the most glyphs during the game',
      pt: 'Usou o maior número de ícones durante o jogo',
    },
  },
  LEAST_NEGATIVE: {
    id: 'LEAST_NEGATIVE',
    doc: 'how many glyphs the player used in the negative side',
    icon: 'arrow-right',
    title: {
      en: 'Least Negative',
      pt: 'Menos Negativo',
    },
    description: {
      en: 'Used the least glyphs on the negative side',
      pt: 'Usou menos ícones no lado negativo',
    },
  },
  MOST_NEGATIVE: {
    id: 'MOST_NEGATIVE',
    doc: 'how many glyphs the player used in the negative side',
    icon: 'thumbs-down',
    title: {
      en: 'Most Negative',
      pt: 'Mais Negativo',
    },
    description: {
      en: 'Used the most glyphs on the negative side',
      pt: 'Usou mais ícones no lado negativo',
    },
  },
  LEAST_POSITIVE: {
    id: 'LEAST_POSITIVE',
    doc: 'how many glyphs the player used in the positive side',
    icon: 'arrow-left',
    title: {
      en: 'Least Positive',
      pt: 'Menos Positivo',
    },
    description: {
      en: 'Used the least glyphs on the positive side',
      pt: 'Usou menos ícones no lado positivo',
    },
  },
  MOST_POSITIVE: {
    id: 'MOST_POSITIVE',
    doc: 'how many glyphs the player used in the positive side',
    icon: 'thumbs-up',
    title: {
      en: 'Most Positive',
      pt: 'Mais Positivo',
    },
    description: {
      en: 'Used the most glyphs on the positive side',
      pt: 'Usou mais ícones no lado positivo',
    },
  },
  SINGLE_ICON: {
    id: 'SINGLE_ICON',
    doc: 'times the player used a single glyph in a turn',
    icon: 'one',
    title: {
      en: 'Most Unique',
      pt: 'Mais Único',
    },
    description: {
      en: 'Used a single icon most times',
      pt: 'Usou apenas um ícone mais vezes',
    },
  },
  TABLE_VOTES: {
    id: 'TABLE_VOTES',
    doc: 'how many times the player voted for a character not belonging to any player',
    icon: 'table',
    title: {
      en: 'Best Table Voter',
      pt: 'Melhor Votador Pra Mesa',
    },
    description: {
      en: "Voted for extra cards that didn't belong to any player the most",
      pt: 'Votou nas cartas extras que não eram de nenhum jogador mais vezes',
    },
  },
};

export default achievementsReference;
