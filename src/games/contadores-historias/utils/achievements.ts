// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  WORST_CLUES: {
    id: 'WORST_CLUES',
    doc: 'Clues where nobody got it or all got it',
    icon: 'spiral',
    title: {
      en: 'Most Obscure',
      pt: 'Histórias mais Cabulosas',
    },
    description: {
      en: 'Their stories got no matches more times',
      pt: 'As histórias que deram nenhum match mais vezes',
    },
  },
  EASIEST_CLUES: {
    id: 'EASIEST_CLUES',
    doc: 'Clues where most or all players got it',
    icon: 'face-smiley',
    title: {
      en: 'Easiest Stories',
      pt: 'Histórias Mais Simples',
    },
    description: {
      en: 'Players guessed their story correctly more times',
      pt: 'Os jogadores adivinharam as histórias mais vezes',
    },
  },
  HARDEST_CLUES: {
    id: 'HARDEST_CLUES',
    doc: 'Clues where most or all players got it',
    icon: 'brain',
    title: {
      en: 'Hardest Stories',
      pt: 'Histórias Mais Difíceis',
    },
    description: {
      en: 'Players guessed their story correctly fewer times',
      pt: 'Os jogadores adivinharam as histórias menos vezes',
    },
  },
  MOST_DECEIVING: {
    id: 'MOST_DECEIVING',
    doc: 'Votes received on player cards when not the storyteller',
    icon: 'light-bulb',
    title: {
      en: 'Most Deceiving',
      pt: 'Mais Convincente',
    },
    description: {
      en: 'Their cards were chosen the most when they were not the Storyteller',
      pt: 'Suas cartas foram escolhidas mais vezes quando não era o Contador de Histórias',
    },
  },
  WORST_CARDS: {
    id: 'WORST_CARDS',
    doc: 'Votes received on player cards when not the storyteller',
    icon: 'broken-bulb',
    title: {
      en: 'Most Different Cards',
      pt: 'Cartas Mais Diferentes',
    },
    description: {
      en: 'Their cards were chosen the least when they were not the Storyteller',
      pt: 'Suas cartas foram escolhidas menos vezes quando não era o Contador de Histórias',
    },
  },
  TABLE_VOTES: {
    id: 'TABLE_VOTES',
    doc: 'Votes on table cards',
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
