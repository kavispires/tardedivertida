import { MedalCloseIcon } from 'icons/MedalCloseIcon';
import { MedalLightBulbIcon } from 'icons/MedalLightBulbIcon';
import { MedalRobotIcon } from 'icons/MedalRobotIcon';
import { MedalSufferingIcon } from 'icons/MedalSufferingIcon';
import { MedalThumbsDownIcon } from 'icons/MedalThumbsDownIcon';
import { MedalThumbsUpIcon } from 'icons/MedalThumbsUpIcon';

export const achievementsReference: AchievementReference = {
  MOST_DECEIVING: {
    Icon: MedalLightBulbIcon,
    title: {
      pt: 'Mais Convincente',
      en: 'Most Deceiving',
    },
    description: {
      pt: 'Suas cartas foram escolhidas mais vezes quando não era o Contador de Histórias',
      en: 'Their cards were chosen the most when they were not the Storyteller',
    },
  },
  WORST_CARDS: {
    Icon: MedalCloseIcon,
    title: {
      pt: 'Piores Cartas',
      en: 'Worst Cards',
    },
    description: {
      pt: 'Suas cartas foram escolhidas menos vezes quando não era o Contador de Histórias',
      en: 'Their cards were chosen the least when they were not the Storyteller',
    },
  },
  WORST_CLUES: {
    Icon: MedalSufferingIcon,
    title: {
      pt: 'Histórias mais Cabulosas',
      en: 'Most Obscure',
    },
    description: {
      pt: 'As histórias que deram nenhum match mais vezes',
      en: 'Their stories got no matches more times',
    },
  },
  EASIEST_CLUES: {
    Icon: MedalThumbsUpIcon,
    title: {
      pt: 'Histórias Mais Simples',
      en: 'Easiest Stories',
    },
    description: {
      pt: 'Os jogadores adivinharam as histórias mais vezes',
      en: 'Players guessed their story correctly more times',
    },
  },
  HARDEST_CLUES: {
    Icon: MedalThumbsDownIcon,
    title: {
      pt: 'Histórias Mais Difíceis',
      en: 'Hardest Stories',
    },
    description: {
      pt: 'Os jogadores adivinharam as histórias menos vezes',
      en: 'Players guessed their story correctly fewer times',
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
