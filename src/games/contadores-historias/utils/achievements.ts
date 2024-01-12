import { AchievementReference } from 'types/achievements';

export const achievementsReference: AchievementReference = {
  MOST_DECEIVING: {
    icon: 'light-bulb',
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
    icon: 'broken-bulb',
    title: {
      pt: 'Cartas Mais Diferentes',
      en: 'Most Different Cards',
    },
    description: {
      pt: 'Suas cartas foram escolhidas menos vezes quando não era o Contador de Histórias',
      en: 'Their cards were chosen the least when they were not the Storyteller',
    },
  },
  WORST_CLUES: {
    icon: 'spiral',
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
    icon: 'face-smiley',
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
    icon: 'brain',
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
};

export default achievementsReference;
