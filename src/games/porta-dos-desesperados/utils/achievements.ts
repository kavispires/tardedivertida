import { MedalArrowLeftIcon } from 'icons/MedalArrowLeftIcon';
import { MedalArrowRightIcon } from 'icons/MedalArrowRightIcon';
import { MedalCheckMarkIcon } from 'icons/MedalCheckMarkIcon';
import { MedalDoorIcon } from 'icons/MedalDoorIcon';
import { MedalExIcon } from 'icons/MedalExIcon';
import { MedalHeartIcon } from 'icons/MedalHeartIcon';
import { MedalLightBulbIcon } from 'icons/MedalLightBulbIcon';
import { MedalMinusIcon } from 'icons/MedalMinusIcon';
import { MedalPersonIcon } from 'icons/MedalPersonIcon';
import { MedalPlusIcon } from 'icons/MedalPlusIcon';
import { MedalRobotIcon } from 'icons/MedalRobotIcon';
import { MedalSandTimerIcon } from 'icons/MedalSandTimerIcon';
import { MedalScaredIcon } from 'icons/MedalScaredIcon';
import { MedalSufferingIcon } from 'icons/MedalSufferingIcon';
import { MedalThumbsDownIcon } from 'icons/MedalThumbsDownIcon';
import { MedalThumbsUpIcon } from 'icons/MedalThumbsUpIcon';

const ACHIEVEMENTS = {
  MOST_POSSESSED: 'MOST_POSSESSED',
  LEAST_POSSESSED: 'LEAST_POSSESSED',
  BEST_GUIDE: 'BEST_GUIDE',
  BEGINNER_GUIDE: 'BEGINNER_GUIDE',
  SLOW_READER: 'SLOW_READER',
  FAST_LEARNER: 'FAST_LEARNER',
  MOST_PAGES: 'MOST_PAGES',
  FEWEST_PAGES: 'FEWEST_PAGES',
  MOST_CORRECT_DOORS: 'MOST_CORRECT_DOORS',
  MOST_WRONG_DOORS: 'MOST_WRONG_DOORS',
  MOST_SOLO_CORRECT_DOORS: 'MOST_SOLO_CORRECT_DOORS',
  MOST_SOLO_WRONG_DOORS: 'MOST_SOLO_WRONG_DOORS',
  SLOW_DECISIONS: 'SLOW_DECISIONS',
  QUICK_DECISIONS: 'QUICK_DECISIONS',
  MAGIC_WASTER: 'MAGIC_WASTER',
  MAGIC_SAVER: 'MAGIC_SAVER',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_POSSESSED]: {
    Icon: MedalScaredIcon,
    title: {
      pt: 'Mais possuído',
      en: 'Most Possessed',
    },
    description: {
      pt: 'Foi possuído mais vezes',
      en: 'Was possessed the most',
    },
  },
  [ACHIEVEMENTS.LEAST_POSSESSED]: {
    Icon: MedalHeartIcon,
    title: {
      pt: 'Mais puro',
      en: 'Purest',
    },
    description: {
      pt: 'Foi possuído menos vezes',
      en: 'Was possessed the least',
    },
  },
  [ACHIEVEMENTS.BEST_GUIDE]: {
    Icon: MedalArrowRightIcon,
    title: {
      pt: 'Melhor Guia',
      en: 'Best Guide',
    },
    description: {
      pt: 'Ajudou os outros jogadores a acharem a porta certa com as melhores páginas mais vezes',
      en: 'Helped the other players with best book pages the most',
    },
  },
  [ACHIEVEMENTS.BEGINNER_GUIDE]: {
    Icon: MedalArrowLeftIcon,
    title: {
      pt: 'Guia Aprendiz',
      en: 'Beginner Guide',
    },
    description: {
      pt: 'Usou páginas não tão boas mais vezes',
      en: 'Use not so good book pages the most',
    },
  },
  [ACHIEVEMENTS.SLOW_READER]: {
    Icon: MedalRobotIcon,
    title: {
      pt: 'Mais Analítico',
      en: 'Most Analytical',
    },
    description: {
      pt: 'Demorou mais tempo para escolher páginas do livro',
      en: 'Took the longest total to choose book pages',
    },
  },
  [ACHIEVEMENTS.FAST_LEARNER]: {
    Icon: MedalLightBulbIcon,
    title: {
      pt: 'Melhor Leitor',
      en: 'Fastest Reader',
    },
    description: {
      pt: 'Demorou menos tempo para escolher páginas do livro',
      en: 'Took the shortest total to choose book pages',
    },
  },
  [ACHIEVEMENTS.MOST_PAGES]: {
    Icon: MedalPlusIcon,
    title: {
      pt: 'Melhor Conteúdo',
      en: 'Best Content',
    },
    description: {
      pt: 'Usou o maior número de páginas do livro',
      en: 'Used the most book pages',
    },
  },
  [ACHIEVEMENTS.FEWEST_PAGES]: {
    Icon: MedalMinusIcon,
    title: {
      pt: 'Mais Sucinto',
      en: 'Most Succinct',
    },
    description: {
      pt: 'Usou o menor número de páginas do livro',
      en: 'Used the fewest book pages',
    },
  },
  [ACHIEVEMENTS.MOST_CORRECT_DOORS]: {
    Icon: MedalDoorIcon,
    title: {
      pt: 'Mais Correto',
      en: 'Most Correct',
    },
    description: {
      pt: 'Escolheu a porta correta mais vezes',
      en: 'Chose the correct door more times',
    },
  },
  [ACHIEVEMENTS.MOST_WRONG_DOORS]: {
    Icon: MedalExIcon,
    title: {
      pt: 'Mais Equivocado',
      en: 'Most Mistaken',
    },
    description: {
      pt: 'Escolheu a porta errada mais vezes',
      en: 'Chose the wrong door more times',
    },
  },
  [ACHIEVEMENTS.MOST_SOLO_CORRECT_DOORS]: {
    Icon: MedalCheckMarkIcon,
    title: {
      pt: 'Mais Solitário',
      en: 'Most Lonely',
    },
    description: {
      pt: 'Escolheu a porta correta sozinho mais vezes',
      en: 'Chose the correct door alone more times',
    },
  },
  [ACHIEVEMENTS.MOST_SOLO_WRONG_DOORS]: {
    Icon: MedalPersonIcon,
    title: {
      pt: 'Mais Do Contra',
      en: 'Most Naysayer',
    },
    description: {
      pt: 'Escolheu a porta errada sozinho mais vezes',
      en: 'Chose the wrong door alone most times',
    },
  },
  [ACHIEVEMENTS.QUICK_DECISIONS]: {
    Icon: MedalSandTimerIcon,
    title: {
      pt: 'Mais Indeciso',
      en: 'Most Undecided',
    },
    description: {
      pt: 'Mais rápido ao escolher portas',
      en: 'Quickest to choose doors',
    },
  },
  [ACHIEVEMENTS.SLOW_DECISIONS]: {
    Icon: MedalSufferingIcon,
    title: {
      pt: 'Mais Indeciso',
      en: 'Most Undecided',
    },
    description: {
      pt: 'Demorou mais para escolher portas',
      en: 'Took the longest to choose doors',
    },
  },
  [ACHIEVEMENTS.MAGIC_SAVER]: {
    Icon: MedalThumbsUpIcon,
    title: {
      pt: 'Economizador De Cristal',
      en: 'Crystal Saver',
    },
    description: {
      pt: 'Usou menos cristais em portas erradas',
      en: 'Used the fewest crystals on wrong doors',
    },
  },
  [ACHIEVEMENTS.MAGIC_WASTER]: {
    Icon: MedalThumbsDownIcon,
    title: {
      pt: 'Gastador De Cristal',
      en: 'Crystal Spender',
    },
    description: {
      pt: 'Usou mais cristais em portas erradas',
      en: 'Used the most crystals on wrong doors',
    },
  },
};
