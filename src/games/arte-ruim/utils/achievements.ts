import { MedalBrushIcon } from 'icons/MedalBrushIcon';
import { MedalLightBulbIcon } from 'icons/MedalLightBulbIcon';
import { MedalPersonIcon } from 'icons/MedalPersonIcon';
import { MedalQuestionMarkIcon } from 'icons/MedalQuestionMarkIcon';
import { MedalRobotIcon } from 'icons/MedalRobotIcon';

export const achievementsReference: AchievementReference = {
  BEST_ARTIST: {
    Icon: MedalBrushIcon,
    title: {
      pt: 'Melhor Artista',
      en: 'Best Artist',
    },
    description: {
      pt: 'Todos os jogadores acertaram unanimemente seu desenho mais vezes',
      en: 'Got players to guess your drawing unanimously the most',
    },
  },
  WORST_ARTIST: {
    Icon: MedalQuestionMarkIcon,
    title: {
      pt: 'Artista Mais Não Convencional',
      en: 'Most Unconventional Artist',
    },
    description: {
      pt: 'Todos os jogadores NÃO acertaram unanimemente seu desenho mais vezes',
      en: 'Got players to miss your drawing unanimously the most',
    },
  },
  SOLITARY_WINNER: {
    Icon: MedalPersonIcon,
    title: {
      pt: 'Adivinhador Solitário',
      en: 'Best Solitary Guesser',
    },
    description: {
      pt: 'Foi o único que acertou o desenho mais vezes',
      en: 'Was the only one to get the drawing the most',
    },
  },
  SOLITARY_LOSER: {
    Icon: MedalLightBulbIcon,
    title: {
      pt: 'Mais Diferentão',
      en: 'Most Unique Guesser',
    },
    description: {
      pt: 'Foi o único que errou o desenho mais vezes',
      en: 'Was the only one to get the drawing the most',
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
