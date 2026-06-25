// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  MOST_BAD_ELIMINATIONS: {
    id: 'MOST_BAD_ELIMINATIONS',
    doc: 'how many times the player chose to eliminate someone else',
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
  MOST_COUPLE_SELECTIONS: {
    id: 'MOST_COUPLE_SELECTIONS',
    doc: 'how many times the player chose the same movie as exactly one other player',
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
  MOST_GROUP_SELECTIONS: {
    id: 'MOST_GROUP_SELECTIONS',
    doc: 'how many times the player chose the same movie as other players',
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
  MOST_ELIMINATED_MOVIE: {
    id: 'MOST_ELIMINATED_MOVIE',
    doc: 'how many times the player had their movie eliminated by someone else',
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
  MOST_SOLO_SELECTIONS: {
    id: 'MOST_SOLO_SELECTIONS',
    doc: 'how many times the player was the only one to choose a movie',
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
};

export default achievementsReference;
