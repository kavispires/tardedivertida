// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  CHANGELING: {
    id: 'CHANGELING',
    doc: 'How many different actors they voted for',
    icon: 'arrows',
    title: {
      en: 'Mind changer',
      pt: 'Troca-troca',
    },
    description: {
      en: 'Voted on the most different actors',
      pt: 'Votou em mais atores diferentes',
    },
  },
  CONSISTENCY: {
    id: 'CONSISTENCY',
    doc: 'How many different actors they voted for',
    icon: 'scale',
    title: {
      en: 'Most Persistent',
      pt: 'Mais Persistente',
    },
    description: {
      en: 'Voted on the same actors the most',
      pt: 'Votou nos mesmos atores mais vezes',
    },
  },
  ALONE_VOTES: {
    id: 'ALONE_VOTES',
    doc: 'Times they voted alone in an actor',
    icon: 'person',
    title: {
      en: 'Beginner',
      pt: 'Iniciante',
    },
    description: {
      en: 'Voted alone on an actor the most',
      pt: 'Votou sozinho em um ator mais vezes',
    },
  },
  FEWEST_CAST: {
    id: 'FEWEST_CAST',
    doc: 'Times they cast an actor',
    icon: 'broken-bulb',
    title: {
      en: 'Worst scout',
      pt: 'Pior olheiro',
    },
    description: {
      en: 'Cast the fewest actors',
      pt: 'Escalou menos atores',
    },
  },
  MOST_CAST: {
    id: 'MOST_CAST',
    doc: 'Times they cast an actor',
    icon: 'eye',
    title: {
      en: 'Best scout',
      pt: 'Melhor olheiro',
    },
    description: {
      en: 'Cast the most actors',
      pt: 'Escalou mais atores',
    },
  },
  TOGETHER_VOTES: {
    id: 'TOGETHER_VOTES',
    doc: 'Times they voted together in an actor',
    icon: 'people',
    title: {
      en: 'Professional',
      pt: 'Profissional',
    },
    description: {
      en: 'Voted with someone on an actor the most',
      pt: 'Votou com alguém em um ator mais vezes',
    },
  },
};

export default achievementsReference;
