// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  SOLITARY_LOSER: 'SOLITARY_LOSER',
  SOLITARY_WINNER: 'SOLITARY_WINNER',
  BEST_ARTIST: 'BEST_ARTIST',
  WORST_ARTIST: 'WORST_ARTIST',
  TABLE_VOTES: 'TABLE_VOTES',
  CHOOSE_FOR_ME: 'CHOOSE_FOR_ME',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.BEST_ARTIST]: {
    icon: 'paint-brush',
    title: {
      pt: 'Melhor Artista',
      en: 'Best Artist',
    },
    description: {
      pt: 'Todos os jogadores acertaram unanimemente seu desenho mais vezes',
      en: 'Got players to guess your drawing unanimously the most',
    },
  },
  [ACHIEVEMENTS.WORST_ARTIST]: {
    icon: 'broken-pencil',
    title: {
      pt: 'Artista Mais Não Convencional',
      en: 'Most Unconventional Artist',
    },
    description: {
      pt: 'Todos os jogadores NÃO acertaram unanimemente seu desenho mais vezes',
      en: 'Got players to miss your drawing unanimously the most',
    },
  },
  [ACHIEVEMENTS.SOLITARY_WINNER]: {
    icon: 'person',
    title: {
      pt: 'Adivinhador Solitário',
      en: 'Best Solitary Guesser',
    },
    description: {
      pt: 'Foi o único que acertou o desenho mais vezes',
      en: 'Was the only one to get the drawings correctly the most',
    },
  },
  [ACHIEVEMENTS.SOLITARY_LOSER]: {
    icon: 'difference',
    title: {
      pt: 'Mais Diferentão',
      en: 'Most Unique Guesser',
    },
    description: {
      pt: 'Foi o único que errou o desenho mais vezes',
      en: 'Was the only one to NOT get the drawings the most',
    },
  },
  [ACHIEVEMENTS.TABLE_VOTES]: {
    icon: 'table',
    title: {
      pt: 'Melhor Votador Pra Mesa',
      en: 'Best Table Voter',
    },
    description: {
      pt: 'Votou nas cartas extras que não eram de nenhum jogador mais vezes',
      en: "Voted for extra cards that didn't belong to any player the most",
    },
  },
  [ACHIEVEMENTS.CHOOSE_FOR_ME]: {
    icon: 'dice',
    title: {
      pt: 'Menos Brasileiro',
      en: 'The Shirker',
    },
    description: {
      pt: 'Apertou o botão Chutar Restantes mais vezes',
      en: "Pressed 'Guess for me' the most",
    },
  },
};

export default achievementsReference;
