// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_GROUP_SELECTIONS: 'MOST_GROUP_SELECTIONS',
  MOST_SOLO_SELECTIONS: 'MOST_SOLO_SELECTIONS',
  MOST_COUPLE_SELECTIONS: 'MOST_COUPLE_SELECTIONS',
  MOST_BAD_ELIMINATIONS: 'MOST_BAD_ELIMINATIONS',
  MOST_ELIMINATED_MOVIE: 'MOST_ELIMINATED_MOVIE',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_GROUP_SELECTIONS]: {
    icon: 'face-surprise',
    title: {
      en: 'Best Friend',
      pt: 'Amigão',
    },
    description: {
      en: 'Selected movies with 3 or more players more times.',
      pt: 'Selecionou mais filmes com 3 ou mais jogadores.',
    },
  },
  [ACHIEVEMENTS.MOST_SOLO_SELECTIONS]: {
    icon: 'face-oops',
    title: {
      en: 'Lone Wolf',
      pt: 'Lobo Solitário',
    },
    description: {
      en: 'Was the only one to select a movie more times.',
      pt: 'Foi o único a selecionar um filme mais vezes.',
    },
  },
  [ACHIEVEMENTS.MOST_COUPLE_SELECTIONS]: {
    icon: 'heart',
    title: {
      en: 'Romantic',
      pt: 'Romântico',
    },
    description: {
      en: 'Selected a movie with only one other player more times.',
      pt: 'Selecionou um filme com apenas um outro jogador mais vezes.',
    },
  },
  [ACHIEVEMENTS.MOST_BAD_ELIMINATIONS]: {
    icon: 'thumbs-down',
    title: {
      en: 'Peculiar Taste',
      pt: 'Gosto Peculiar',
    },
    description: {
      en: 'Eliminated the most wrong movies (that other players selected).',
      pt: 'Eliminou mais filmes errados (que outros jogadores selecionaram).',
    },
  },
  [ACHIEVEMENTS.MOST_ELIMINATED_MOVIE]: {
    icon: 'target',
    title: {
      en: 'Hated',
      pt: 'Odiado',
    },
    description: {
      en: 'Had their movies eliminated the most.',
      pt: 'Teve seus filmes eliminados mais vezes.',
    },
  },
};

export default achievementsReference;
