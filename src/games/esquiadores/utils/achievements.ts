// Types
import type { AchievementReference } from 'types/achievements';

export const ACHIEVEMENTS = {
  MOST_LODGES: 'MOST_LODGES',
  FEWEST_LODGES: 'FEWEST_LODGES',
  MOST_GROUP_BETS: 'MOST_GROUP_BETS',
  FEWEST_GROUP_BETS: 'FEWEST_GROUP_BETS',
  MOST_GROUP_INITIAL_BETS: 'MOST_GROUP_INITIAL_BETS',
  FEWEST_GROUP_INITIAL_BETS: 'FEWEST_GROUP_INITIAL_BETS',
  MOST_GROUP_BOOST_BETS: 'MOST_GROUP_BOOST_BETS',
  FEWEST_GROUP_BOOST_BETS: 'FEWEST_GROUP_BOOST_BETS',
  MOST_GROUP_FINAL_BETS: 'MOST_GROUP_FINAL_BETS',
  FEWEST_GROUP_FINAL_BETS: 'FEWEST_GROUP_FINAL_BETS',
  ONLY_LODGE: 'ONLY_LODGE',
  MOST_PLAYER_BETS: 'MOST_PLAYER_BETS',
  FEWEST_PLAYER_BETS: 'FEWEST_PLAYER_BETS',
  HIGHEST_BET: 'HIGHEST_BET',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_LODGES]: {
    icon: 'arrows',
    title: {
      en: 'Most spread out',
      pt: 'Mais Cabanas',
    },
    description: {
      en: 'Placed bets on the most lodges during the game.',
      pt: 'Apostou nas cabanas mais vezes durante o jogo.',
    },
  },
  [ACHIEVEMENTS.FEWEST_LODGES]: {
    icon: 'broken-arrow',
    title: {
      en: 'Least spread out',
      pt: 'Menos Cabanas',
    },
    description: {
      en: 'Placed bets on the fewest lodges during the game.',
      pt: 'Apostou nas cabanas menos vezes durante o jogo.',
    },
  },
  [ACHIEVEMENTS.MOST_GROUP_BETS]: {
    icon: 'plus',
    title: {
      en: 'Overall Group Bets',
      pt: 'Apostas com o Grupo',
    },
    description: {
      en: 'Placed the most bets with other players during the game.',
      pt: 'Apostou mais vezes com outros jogadores durante o jogo.',
    },
  },
  [ACHIEVEMENTS.FEWEST_GROUP_BETS]: {
    icon: 'minus',
    title: {
      en: 'Fewest Group Bets',
      pt: 'Menos Apostas com o Grupo',
    },
    description: {
      en: 'Placed the fewest bets with other players during the game.',
      pt: 'Apostou menos vezes com outros jogadores durante o jogo.',
    },
  },
  [ACHIEVEMENTS.MOST_GROUP_INITIAL_BETS]: {
    icon: 'one',
    title: {
      en: 'Most Group Initial Bets',
      pt: 'Mais Apostas Iniciais com o Grupo',
    },
    description: {
      en: 'Placed the most initial bets with other players during the game.',
      pt: 'Apostou mais apostas iniciais com outros jogadores durante o jogo.',
    },
  },
  [ACHIEVEMENTS.FEWEST_GROUP_INITIAL_BETS]: {
    icon: 'one',
    title: {
      en: 'Fewest Group Initial Bets',
      pt: 'Menos Apostas Iniciais com o Grupo',
    },
    description: {
      en: 'Placed the fewest initial bets with other players during the game.',
      pt: 'Apostou menos apostas iniciais com outros jogadores durante o jogo.',
    },
  },
  [ACHIEVEMENTS.MOST_GROUP_BOOST_BETS]: {
    icon: 'two',
    title: {
      en: 'Most Group Boost Bets',
      pt: 'Mais Apostas Bônus com o Grupo',
    },
    description: {
      en: 'Placed the most boost bets with other players during the game.',
      pt: 'Apostou mais apostas de impulso com outros jogadores durante o jogo.',
    },
  },
  [ACHIEVEMENTS.FEWEST_GROUP_BOOST_BETS]: {
    icon: 'two',
    title: {
      en: 'Fewest Group Boost Bets',
      pt: 'Menos Apostas Bônus com o Grupo',
    },
    description: {
      en: 'Placed the fewest boost bets with other players during the game.',
      pt: 'Apostou menos apostas de impulso com outros jogadores durante o jogo.',
    },
  },
  [ACHIEVEMENTS.MOST_GROUP_FINAL_BETS]: {
    icon: 'three',
    title: {
      en: 'Most Group Final Bets',
      pt: 'Mais Apostas Finais com o Grupo',
    },
    description: {
      en: 'Placed the most final bets with other players during the game.',
      pt: 'Apostou mais apostas finais com outros jogadores durante o jogo.',
    },
  },
  [ACHIEVEMENTS.FEWEST_GROUP_FINAL_BETS]: {
    icon: 'three',
    title: {
      en: 'Fewest Group Final Bets',
      pt: 'Menos Apostas Finais com o Grupo',
    },
    description: {
      en: 'Placed the fewest final bets with other players during the game.',
      pt: 'Apostou menos apostas finais com outros jogadores durante o jogo.',
    },
  },
  [ACHIEVEMENTS.ONLY_LODGE]: {
    icon: 'house',
    title: {
      en: 'Lodge Lover',
      pt: 'Amante de Cabanas',
    },
    description: {
      en: 'Only placed bets on lodges during the game.',
      pt: 'Apostou apenas nas cabanas durante o jogo.',
    },
  },
  [ACHIEVEMENTS.MOST_PLAYER_BETS]: {
    icon: 'people',
    title: {
      en: 'Most Bet Player',
      pt: 'Jogador que Mais Apostou',
    },
    description: {
      en: 'Placed the most bets during the game.',
      pt: 'Apostou mais vezes durante o jogo.',
    },
  },
  [ACHIEVEMENTS.FEWEST_PLAYER_BETS]: {
    icon: 'person',
    title: {
      en: 'Fewest Bet Player',
      pt: 'Jogador que Menos Apostou',
    },
    description: {
      en: 'Placed the fewest bets during the game.',
      pt: 'Apostou menos vezes durante o jogo.',
    },
  },
  [ACHIEVEMENTS.HIGHEST_BET]: {
    icon: 'three',
    title: {
      en: 'High Roller',
      pt: 'Grande Apostador',
    },
    description: {
      en: 'Placed the highest bet during the game.',
      pt: 'Apostou a maior aposta durante o jogo.',
    },
  },
};

export default achievementsReference;
