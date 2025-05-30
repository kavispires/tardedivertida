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
  MOST_BET_ON_PLAYER: 'MOST_BET_ON_PLAYER',
  LEAST_BET_ON_PLAYER: 'LEAST_BET_ON_PLAYER',
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
      en: 'Was the only player to bet on a lodge more times during the game.',
      pt: 'Foi o único jogador a apostar em uma cabana sozinho mais vezes durante o jogo',
    },
  },
  [ACHIEVEMENTS.MOST_PLAYER_BETS]: {
    icon: 'people',
    title: {
      en: 'Least confident',
      pt: 'Menos Confiante',
    },
    description: {
      en: 'Place bets on the largest number of players as the skier.',
      pt: 'Apostou no maior número de jogadores enquanto era o esquiador.',
    },
  },
  [ACHIEVEMENTS.FEWEST_PLAYER_BETS]: {
    icon: 'person',
    title: {
      en: 'Most confident',
      pt: 'Mais confiante',
    },
    description: {
      en: 'Placed bets on the fewest number of players as the skier.',
      pt: 'Apostou em menos jogadores enquanto era o esquiador.',
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
  [ACHIEVEMENTS.MOST_BET_ON_PLAYER]: {
    icon: 'heart',
    title: {
      en: 'Most Trusted',
      pt: 'Mais Confiável',
    },
    description: {
      en: 'Had the most bets placed on them during the game.',
      pt: 'Teve mais apostas feitas nele durante o jogo.',
    },
  },
  [ACHIEVEMENTS.LEAST_BET_ON_PLAYER]: {
    icon: 'broken-heart',
    title: {
      en: 'Least Trusted',
      pt: 'Menos Confiável',
    },
    description: {
      en: 'Had the fewest bets placed on them during the game.',
      pt: 'Teve menos apostas feitas nele durante o jogo.',
    },
  },
};

export default achievementsReference;
