// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_CHILDRENS_BOOKS_MATCHES: 'MOST_CHILDRENS_BOOKS_MATCHES',
  MOST_ROMANCE_BOOKS_MATCHES: 'MOST_ROMANCE_BOOKS_MATCHES',
  MOST_TECHNICAL_BOOKS_MATCHES: 'MOST_TECHNICAL_BOOKS_MATCHES',
  MOST_RED_BOOKS_MATCHES: 'MOST_RED_BOOKS_MATCHES',
  MOST_BLUE_BOOKS_MATCHES: 'MOST_BLUE_BOOKS_MATCHES',
  MOST_YELLOW_BOOKS_MATCHES: 'MOST_YELLOW_BOOKS_MATCHES',
  MOST_LETTER_A_BOOKS_MATCHES: 'MOST_LETTER_A_BOOKS_MATCHES',
  MOST_LETTER_B_BOOKS_MATCHES: 'MOST_LETTER_B_BOOKS_MATCHES',
  MOST_LETTER_C_BOOKS_MATCHES: 'MOST_LETTER_C_BOOKS_MATCHES',
  MOST_LETTER_D_BOOKS_MATCHES: 'MOST_LETTER_D_BOOKS_MATCHES',
  MOST_LETTER_E_BOOKS_MATCHES: 'MOST_LETTER_E_BOOKS_MATCHES',
  MOST_NO_MATCHES: 'MOST_NO_MATCHES',
  MOST_FULL_MATCHES: 'MOST_FULL_MATCHES',
  FEWEST_FULL_MATCHES: 'FEWEST_FULL_MATCHES',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_CHILDRENS_BOOKS_MATCHES]: {
    icon: 'candy',
    title: {
      pt: 'Bibliófilo Infantil',
      en: "Children's Book Enthusiast",
    },
    description: {
      pt: 'Acertou mais livros infantis',
      en: "Matched the most children's books",
    },
  },
  [ACHIEVEMENTS.MOST_ROMANCE_BOOKS_MATCHES]: {
    icon: 'heart',
    title: {
      pt: 'Romântico Incurável',
      en: 'Hopeless Romantic',
    },
    description: {
      pt: 'Acertou mais livros de romance',
      en: 'Matched the most romance books',
    },
  },
  [ACHIEVEMENTS.MOST_TECHNICAL_BOOKS_MATCHES]: {
    icon: 'brain',
    title: {
      pt: 'Mente Técnica',
      en: 'Technical Mind',
    },
    description: {
      pt: 'Acertou mais livros técnicos',
      en: 'Matched the most technical books',
    },
  },
  [ACHIEVEMENTS.MOST_RED_BOOKS_MATCHES]: {
    icon: 'fire',
    title: {
      pt: 'Visão Vermelha',
      en: 'Red Vision',
    },
    description: {
      pt: 'Acertou mais livros vermelhos',
      en: 'Matched the most red books',
    },
  },
  [ACHIEVEMENTS.MOST_BLUE_BOOKS_MATCHES]: {
    icon: 'moon',
    title: {
      pt: 'Visão Azul',
      en: 'Blue Vision',
    },
    description: {
      pt: 'Acertou mais livros azuis',
      en: 'Matched the most blue books',
    },
  },
  [ACHIEVEMENTS.MOST_YELLOW_BOOKS_MATCHES]: {
    icon: 'sun',
    title: {
      pt: 'Visão Amarela',
      en: 'Yellow Vision',
    },
    description: {
      pt: 'Acertou mais livros amarelos',
      en: 'Matched the most yellow books',
    },
  },
  [ACHIEVEMENTS.MOST_LETTER_A_BOOKS_MATCHES]: {
    icon: 'one',
    title: {
      pt: 'Especialista em A',
      en: 'A Specialist',
    },
    description: {
      pt: 'Acertou mais livros com letra A',
      en: 'Matched the most books with letter A',
    },
  },
  [ACHIEVEMENTS.MOST_LETTER_B_BOOKS_MATCHES]: {
    icon: 'two',
    title: {
      pt: 'Especialista em B',
      en: 'B Specialist',
    },
    description: {
      pt: 'Acertou mais livros com letra B',
      en: 'Matched the most books with letter B',
    },
  },
  [ACHIEVEMENTS.MOST_LETTER_C_BOOKS_MATCHES]: {
    icon: 'three',
    title: {
      pt: 'Especialista em C',
      en: 'C Specialist',
    },
    description: {
      pt: 'Acertou mais livros com letra C',
      en: 'Matched the most books with letter C',
    },
  },
  [ACHIEVEMENTS.MOST_LETTER_D_BOOKS_MATCHES]: {
    icon: 'four',
    title: {
      pt: 'Especialista em D',
      en: 'D Specialist',
    },
    description: {
      pt: 'Acertou mais livros com letra D',
      en: 'Matched the most books with letter D',
    },
  },
  [ACHIEVEMENTS.MOST_LETTER_E_BOOKS_MATCHES]: {
    icon: 'five',
    title: {
      pt: 'Especialista em E',
      en: 'E Specialist',
    },
    description: {
      pt: 'Acertou mais livros com letra E',
      en: 'Matched the most books with letter E',
    },
  },
  [ACHIEVEMENTS.MOST_NO_MATCHES]: {
    icon: 'difference',
    title: {
      pt: 'Explorador Único',
      en: 'Unique Explorer',
    },
    description: {
      pt: 'Teve mais sugestões únicas sem correspondência',
      en: 'Had the most unique suggestions without matches',
    },
  },
  [ACHIEVEMENTS.MOST_FULL_MATCHES]: {
    icon: 'star',
    title: {
      pt: 'Mestre da Sintonia',
      en: 'Master of Harmony',
    },
    description: {
      pt: 'Teve mais correspondências completas',
      en: 'Had the most full matches',
    },
  },
  [ACHIEVEMENTS.FEWEST_FULL_MATCHES]: {
    icon: 'thought',
    title: {
      pt: 'Pensador Independente',
      en: 'Independent Thinker',
    },
    description: {
      pt: 'Manteve a originalidade com menos correspondências completas',
      en: 'Maintained originality with fewest full matches',
    },
  },
};

export default achievementsReference;
