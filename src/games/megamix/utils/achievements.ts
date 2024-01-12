import { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  SOLITARY_VIP: 'SOLITARY_VIP',
  SOLITARY_LOSER: 'SOLITARY_LOSER',
  LONGEST_VIP: 'LONGEST_VIP',
  LONGEST_LOSER: 'LONGEST_LOSER',
  MOST_SWITCHED: 'MOST_SWITCHED',
  LEAST_SWITCHED: 'LEAST_SWITCHED',
  MOST_JOIN: 'MOST_JOIN',
  MOST_LEFT: 'MOST_LEFT',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.SOLITARY_VIP]: {
    icon: 'one',
    title: {
      pt: 'VIP Solitário',
      en: 'Solitary VIP',
    },
    description: {
      pt: 'Esteve na área VIP sozinho mais vezes',
      en: 'Was in the VIP area alone the most',
    },
  },
  [ACHIEVEMENTS.SOLITARY_LOSER]: {
    icon: 'trash',
    title: {
      pt: 'Fracassado Solitário',
      en: 'Solitary Loser',
    },
    description: {
      pt: 'Esteve na pista sozinho mais vezes',
      en: 'Was in the General Admission area alone the most',
    },
  },
  [ACHIEVEMENTS.LONGEST_VIP]: {
    icon: 'arrow-wide',
    title: {
      pt: 'VIP de Longa Data',
      en: 'Longest VIP',
    },
    description: {
      pt: 'Ficou na área VIP por mais rodadas consecutivas',
      en: 'Was in the VIP area the most consecutive rounds ',
    },
  },
  [ACHIEVEMENTS.LONGEST_LOSER]: {
    icon: 'face-embarrassed',
    title: {
      pt: 'Pobre de Longa Data',
      en: 'Longest Loser',
    },
    description: {
      pt: 'Ficou na pista por mais rodadas consecutivas',
      en: 'Was in the General Admission area the most consecutive rounds',
    },
  },
  [ACHIEVEMENTS.MOST_SWITCHED]: {
    icon: 'arrows-reverse',
    title: {
      pt: 'Mais Troca-Troca',
      en: 'Most Switched',
    },
    description: {
      pt: 'Trocou de área mais vezes',
      en: 'Switched areas the most',
    },
  },
  [ACHIEVEMENTS.LEAST_SWITCHED]: {
    icon: 'arrow-narrow',
    title: {
      pt: 'Menos Troca-Troca',
      en: 'Least Switched',
    },
    description: {
      pt: 'Trocou de área menos vezes',
      en: 'Switched areas the least',
    },
  },
  [ACHIEVEMENTS.MOST_JOIN]: {
    icon: 'fire',
    title: {
      pt: 'Mais Chegador',
      en: 'Most Joiner',
    },
    description: {
      pt: 'Entrou na área VIP mais vezes',
      en: 'Joined the VIP area the most',
    },
  },
  [ACHIEVEMENTS.MOST_LEFT]: {
    icon: 'door',
    title: {
      pt: 'Mais Sairão',
      en: 'Most Leaver',
    },
    description: {
      pt: 'Saiu da área VIP mais vezes',
      en: 'Left the VIP area the most',
    },
  },
};

export default achievementsReference;
