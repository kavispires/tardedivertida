import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_SAFE_VOTES: 'MOST_SAFE_VOTES',
  MOST_GROUP_VOTES: 'MOST_GROUP_VOTES',
  MOST_LONELY_VOTES: 'MOST_LONELY_VOTES',
  MOST_TARGET_VOTES: 'MOST_TARGET_VOTES',
  MOST_COMMUNITY_VOTES: 'MOST_COMMUNITY_VOTES',
  FEWEST_COMMUNITY_VOTES: 'FEWEST_COMMUNITY_VOTES',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_SAFE_VOTES]: {
    icon: 'check-mark',
    title: {
      pt: 'Mais Analítico',
      en: 'Most Analytical',
    },
    description: {
      pt: 'Teve dicas eliminadas mais vezes',
      en: 'Got their clues to be eliminated the most',
    },
  },
  [ACHIEVEMENTS.MOST_GROUP_VOTES]: {
    icon: 'people',
    title: {
      pt: 'Mais Votos com o Grupo',
      en: 'Most Group Votes',
    },
    description: {
      pt: 'Selecionou uma característica com pelo menos um outro jogador mais vezes',
      en: 'Selected a feature with at least one other players the most',
    },
  },
  [ACHIEVEMENTS.MOST_LONELY_VOTES]: {
    icon: 'arrow-wide',
    title: {
      pt: 'Mais Solitário',
      en: 'Most Lonely',
    },
    description: {
      pt: 'Selecionou uma característica sozinho mais vezes',
      en: 'Selected a feature alone the most',
    },
  },
  [ACHIEVEMENTS.MOST_TARGET_VOTES]: {
    icon: 'target',
    title: {
      pt: 'Mais Sucinto',
      en: 'Most Succinct',
    },
    description: {
      pt: 'Selecionou a característica-alvo que não deveria ter sido selecionada mais vezes',
      en: 'Selected the target feature the most',
    },
  },
  [ACHIEVEMENTS.MOST_COMMUNITY_VOTES]: {
    icon: 'brain',
    title: {
      pt: 'Mente Mais Coletiva',
      en: 'Most Collective Mind',
    },
    description: {
      pt: 'Votou com mais jogadores durante o jogo',
      en: 'Voted with more players during the game',
    },
  },
  [ACHIEVEMENTS.FEWEST_COMMUNITY_VOTES]: {
    icon: 'face-embarrassed',
    title: {
      en: 'Outside of the box Thinker',
      pt: 'Diferentão',
    },
    description: {
      pt: 'Votou com menos jogadores durante o jogo',
      en: 'Voted with less players during the game',
    },
  },
};

export default achievementsReference;
