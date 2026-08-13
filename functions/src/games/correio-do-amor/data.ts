import { keyBy, shuffle } from 'lodash';
// Types
import type { ResourceData, FestaJuninaDatabaseEntry, CorreioDoAmorOptions, FestaJuninaCard } from './types';

const CARDS: Dictionary<FestaJuninaDatabaseEntry> = {
  SANFONEIRO: {
    id: 'SANFONEIRO',
    rank: 0,
    imageId: 'ffc-r0a',
    name: {
      en: 'The Accordion Player',
      pt: 'O Sanfoneiro',
    },
    effect: {
      en: 'Does nothing when played. If a Rank 1 targets you with a guess, they are knocked out of the round instead.',
      pt: 'Não faz nada ao ser jogada, mas se uma carta de Valor 1 te acatar, quem a jogou é eliminado da rodada no seu lugar.',
    },
    flavorText: {
      en: 'The music never stops, especially not for gossips.',
      pt: 'A música não para, muito menos por causa de fofoca.',
    },
    quantity: 2,
    keyword: 'COUNTER_ATTACK',
    color: '#E8D68A',
    tier: 'plus',
    setName: 'ZEROS',
    setRule: 'SINGLE',
  },
  PAU_DE_SEBO: {
    id: 'PAU_DE_SEBO',
    rank: 0,
    imageId: 'ffc-r0b',
    name: {
      en: 'The Grease Pole Climber',
      pt: 'O Pião no Pau de Sebo',
    },
    effect: {
      en: 'Does nothing when played. If you are the only one with this card during the final Rank comparison in the end of the round, you get 1 bonus point.',
      pt: 'Não faz nada ao ser jogada, mas se você for o único com esta carta durante a comparação final de Valores no fim da rodada, ganha 1 ponto extra.',
    },
    flavorText: {
      en: "It's slippery, but that prize up there? Worth it!",
      pt: 'Escorrega, mas o prêmio lá em cima compensa!',
    },
    quantity: 2,
    keyword: 'SURVIVE_SOLO',
    color: '#E8D68A',
    tier: 'plus',
    setName: 'ZEROS',
    setRule: 'SINGLE',
  },
  CRIANCA: {
    id: 'CRIANCA',
    rank: 0,
    imageId: 'ffc-r0c',
    name: {
      en: 'The Mischievous Kid',
      pt: 'A Criança',
    },
    effect: {
      en: 'Does nothing when played. When comparing hands with another player, you automatically win the comparison and they are eliminated.',
      pt: 'Não faz nada ao ser jogada, mas ao comparar cartas com outro jogador, você vence automaticamente e ele é eliminado.',
    },
    flavorText: {
      en: 'I can do whatever I want!',
      pt: 'Posso fazer o que quiser!',
    },
    quantity: 2,
    keyword: 'AUTO_WIN_COMPARE',
    color: '#E8D68A',
    tier: 'plus',
    setName: 'ZEROS',
    setRule: 'SINGLE',
  },
  CAIPIRA_HOMEM: {
    id: 'CAIPIRA_HOMEM',
    rank: 1,
    imageId: 'ffc-r1a',
    name: {
      en: 'The Party-Goer (Man)',
      pt: 'O Caipira',
    },
    effect: {
      en: 'Choose a player and guess their card rank (except Rank 1). If you are right, they are eliminated.',
      pt: 'Escolha um jogador e tente adivinhar o valor da carta dele (exceto Valor 1). Se acertar, ele é eliminado.',
    },
    flavorText: {
      en: "Howdy, aren't you not the son of the aunt of the neighbor of my godfather?",
      pt: 'Cê num é o fi da tia do vizinho da vó do meu padrinho?',
    },
    quantity: 2,
    keyword: 'GUESS_RANK',
    color: '#A52A2A',
    tier: 'core',
    setName: 'CAIPIRAS',
    setRule: 'COMBINE',
  },
  CAIPIRA_MULHER: {
    id: 'CAIPIRA_MULHER',
    rank: 1,
    imageId: 'ffc-r1b',
    name: {
      en: 'The Party-Goer (Woman)',
      pt: 'A Caipira',
    },
    effect: {
      en: 'Choose a player and guess their card name (except any Rank 1). If you are right, they are eliminated.',
      pt: 'Escolha um jogador e adivinhe o nome da carta dele (exceto qualquer uma de Valor 1). Se acertar, ele é eliminado.',
    },
    flavorText: {
      en: 'Howdy, I know you from somewhere...?',
      pt: 'Uai, eu te conheço...?',
    },
    quantity: 2,
    keyword: 'GUESS_NAME',
    color: '#A52A2A',
    tier: 'core',
    setName: 'CAIPIRAS',
    setRule: 'COMBINE',
  },
  PADRE: {
    id: 'PADRE',
    rank: 2,
    imageId: 'ffc-r2a',
    name: {
      en: 'The Priest',
      pt: 'O Padre',
    },
    effect: {
      en: 'Choose a player and secretly look at their hand.',
      pt: 'Escolha um jogador e olhe secretamente a carta na mão dele.',
    },
    flavorText: {
      en: 'Tell me your secrets...',
      pt: 'Me conte seus segredos...',
    },
    quantity: 2,
    keyword: 'PEEK',
    color: '#b169e6',
    tier: 'core',
    setName: 'MYSTIC',
    setRule: 'COMBINE',
  },
  CARTOMANTE: {
    id: 'CARTOMANTE',
    rank: 2,
    imageId: 'ffc-r2b',
    name: {
      en: 'The Fortune Teller',
      pt: 'A Cartomante',
    },
    effect: {
      en: 'Secretly look at the face-down set-aside card. You may swap your hand card with it.',
      pt: 'Olhe secretamente a carta separada no início da rodada. Você pode trocá-la com a sua carta da mão.',
    },
    flavorText: {
      en: 'The spirits reveal what comes next!',
      pt: 'Os espíritos revelam o que vem por aí!',
    },
    quantity: 1,
    keyword: 'SWAP_ASIDE',
    color: '#b169e6',
    tier: 'advanced',
    setName: 'MYSTIC',
    setRule: 'COMBINE',
  },
  NOIVO: {
    id: 'NOIVO',
    rank: 3,
    imageId: 'ffc-r3a',
    name: {
      en: 'The Groom',
      pt: 'O Noivo',
    },
    effect: {
      en: 'Secretly compare hands with another player. The player with the LOWER value is eliminated.',
      pt: 'Compare secretamente sua carta com a de outro jogador. Quem tiver o MENOR valor é eliminado.',
    },
    flavorText: {
      en: 'Somebody get me out of here!',
      pt: 'Alguém me tira daqui!',
    },
    quantity: 1,
    keyword: 'COMPARE_LOWER',
    color: '#FFF8DC',
    tier: 'core',
    setName: 'WEDDING',
    setRule: 'COMBINE',
  },
  NOIVA: {
    id: 'NOIVA',
    rank: 3,
    imageId: 'ffc-r3b',
    name: {
      en: 'The Bride',
      pt: 'A Noiva',
    },
    effect: {
      en: 'Secretly compare hands with another player. The player with the HIGHER value is eliminated.',
      pt: 'Compare secretamente sua carta com a de outro jogador. Quem tiver o MAIOR valor é eliminado.',
    },
    flavorText: {
      en: "I'm done playing it safe!",
      pt: 'Já basta de fazer jogo de cintura!',
    },
    quantity: 1,
    keyword: 'COMPARE_HIGHER',
    color: '#FFF8DC',
    tier: 'core',
    setName: 'WEDDING',
    setRule: 'COMBINE',
  },
  DANCARINA: {
    id: 'DANCARINA',
    rank: 4,
    imageId: 'ffc-r4a',
    name: {
      en: 'The Female Dancer',
      pt: 'A Dançarina de Quadrilha',
    },
    effect: {
      en: 'You will be immune to all card effects until your next turn. If you win the round holding this, gain 1 extra point.',
      pt: 'Você ficará imune aos efeitos de outras cartas até sua próxima vez. Se vencer a rodada com esta carta, ganha 1 ponto extra.',
    },
    flavorText: {
      en: 'Watch me shine!',
      pt: 'Olhem só pra mim!',
    },
    quantity: 1,
    keyword: 'IMMUNITY_BONUS',
    color: '#e35d84',
    tier: 'core',
    setName: 'DANCERS',
    setRule: 'COMBINE',
  },
  DANCARINO: {
    id: 'DANCARINO',
    rank: 4,
    imageId: 'ffc-r4b',
    name: {
      en: 'The Male Dancer',
      pt: 'O Dançarino de Quadrilha',
    },
    effect: {
      en: 'You will be immune to all card effects until your next turn.',
      pt: 'Você ficará imune aos efeitos de outras cartas até sua próxima vez.',
    },
    flavorText: {
      en: 'Nothing can stop me now!',
      pt: 'Nada me alcança agora!',
    },
    quantity: 1,
    keyword: 'IMMUNITY',
    color: '#e35d84',
    tier: 'core',
    setName: 'DANCERS',
    setRule: 'COMBINE',
  },

  DELEGADO: {
    id: 'DELEGADO',
    rank: 5,
    imageId: 'ffc-r5a',
    name: {
      en: 'The Sheriff',
      pt: 'O Delegado',
    },
    effect: {
      en: 'Choose any player (including yourself) to discard their hand and draw a new card.',
      pt: 'Escolha qualquer jogador (incluindo você) para descartar a mão e comprar uma nova carta.',
    },
    flavorText: {
      en: 'New cards for everyone!',
      pt: 'Cartas novas pra todo mundo!',
    },
    quantity: 2,
    keyword: 'DISCARD_REDRAW',
    color: '#1875d0',
    tier: 'core',
    setName: 'POLICE',
    setRule: 'SINGLE',
  },
  BARRAQUINHA_A: {
    id: 'BARRAQUINHA_A',
    rank: 6,
    imageId: 'ffc-r6a',
    name: {
      en: 'Carnival Games Attendant',
      pt: 'A Moça da Pescaria',
    },
    effect: {
      en: 'Choose another player and trade hands with them.',
      pt: 'Escolha outro jogador e troque de mão com ele.',
    },
    flavorText: {
      en: 'Come try your luck!',
      pt: 'Vem tentar a sorte!',
    },
    quantity: 1,
    keyword: 'TRADE_HANDS',
    color: '#20B2AA',
    tier: 'core',
    setName: 'STAFF',
    setRule: 'SINGLE',
  },
  BARRAQUINHA_B: {
    id: 'BARRAQUINHA_B',
    rank: 6,
    imageId: 'ffc-r6b',
    name: {
      en: 'Carnival Games Attendant',
      pt: 'A Moça da Pescaria',
    },
    effect: {
      en: 'Choose 2 OTHER players. They immediately swap hands with each other.',
      pt: 'Escolha 2 OUTROS jogadores. Eles trocam as mãos entre si imediatamente.',
    },
    flavorText: {
      en: 'Switch! Switch! Switch!',
      pt: 'Troca! Troca! Troca!',
    },
    quantity: 1,
    keyword: 'FORCE_TRADE',
    color: '#20B2AA',
    tier: 'advanced',
    setName: 'STAFF',
    setRule: 'SINGLE',
  },
  PUXADOR_A: {
    id: 'PUXADOR_A',
    rank: 7,
    imageId: 'ffc-r7a',
    name: {
      en: 'The Caller',
      pt: 'O Puxador da Quadrilha',
    },
    effect: {
      en: 'Secretly exchange your card with the one on the top of the deck, your card goes to the top of the deck.',
      pt: 'Troque sua carta com a que está no topo do baralho, a sua irá para o topo do baralho.',
    },
    flavorText: {
      en: 'Let the music play!',
      pt: 'Que toque a música!',
    },
    quantity: 1,
    keyword: 'EXCHANGE_TOP',
    color: '#FFB347',
    tier: 'core',
    setName: 'HOST',
    setRule: 'SINGLE',
  },
  PUXADOR_B: {
    id: 'PUXADOR_B',
    rank: 7,
    imageId: 'ffc-r7b',
    name: {
      en: 'The Caller',
      pt: 'O Puxador da Quadrilha',
    },
    effect: {
      en: 'All players (including you) must simultaneously pass their hand card to the player on their left.',
      pt: 'Todos os jogadores (incluindo você) devem passar sua carta simultaneamente para o jogador à esquerda.',
    },
    flavorText: {
      en: 'Pass it along!',
      pt: 'Passem adiante!',
    },
    quantity: 1,
    keyword: 'PASS_LEFT',
    color: '#FFB347',
    tier: 'advanced',
    setName: 'HOST',
    setRule: 'SINGLE',
  },
  PUXADOR_C: {
    id: 'PUXADOR_C',
    rank: 7,
    imageId: 'ffc-r7c',
    name: {
      en: 'The Caller',
      pt: 'O Puxador da Quadrilha',
    },
    effect: {
      en: 'All players place their cards face-down. Collect, shuffle, and deal one back to each player.',
      pt: 'Recolha as mãos de todos os jogadores, sem olhar, embaralhe e devolva uma para cada jogador.',
    },
    flavorText: {
      en: 'Shuffle and reshuffle!',
      pt: 'Embaralha e distribui!',
    },
    quantity: 1,
    keyword: 'SHUFFLE',
    color: '#FFB347',
    tier: 'advanced',
    setName: 'HOST',
    setRule: 'SINGLE',
  },
  FAZENDEIRO: {
    id: 'FAZENDEIRO',
    rank: 8,
    imageId: 'ffc-r8a',
    name: {
      en: 'The Landowner',
      pt: 'O Fazendeiro',
    },
    effect: {
      en: 'If you hold this card and any other card of Rank 6 or higher, you must play this card.',
      pt: 'Se você tiver esta carta e qualquer outra carta de Valor 6 ou mais, você tem que jogar esta carta.',
    },
    flavorText: {
      en: 'My family has standards!',
      pt: 'Minha família tem padrão!',
    },
    quantity: 1,
    keyword: 'FORCE_PLAY',
    color: '#754a1a',
    tier: 'core',
    setName: 'LANDOWNERS',
    setRule: 'SINGLE',
  },
  COMILAO: {
    id: 'COMILAO',
    rank: 9,
    imageId: 'ffc-r9a',
    name: {
      en: 'The Foodie',
      pt: 'O Comilão',
    },
    effect: {
      en: 'Does nothing when played. If you win the round holding this card, you gain 1 less point.',
      pt: 'Não faz nada ao ser jogada. Se você vencer a rodada com esta carta, ganha 1 ponto a menos.',
    },
    flavorText: {
      en: 'This food is amazing!',
      pt: 'Que delícia de comida!',
    },
    quantity: 1,
    keyword: 'WIN_PENALTY',
    color: '#228B22',
    tier: 'advanced',
    setName: 'FOODIE',
    setRule: 'SINGLE',
  },
  GOAL: {
    id: 'GOAL',
    rank: 10,
    imageId: 'ffc-r10a',
    name: {
      en: 'The Ideal Match',
      pt: 'O Par Ideal',
    },
    effect: {
      en: 'This card can never be used. If you play or are forced to discard it you are instantly eliminated.',
      pt: 'Esta carta nunca pode ser usada. Se você jogá-la ou for forçado a descartá-la, você é eliminado instantaneamente.',
    },
    flavorText: {
      en: 'My heart is the prize!',
      pt: 'Meu coração é o prêmio!',
    },
    quantity: 1,
    keyword: 'AUTO_ELIMINATE',
    color: '#FF6B6B',
    tier: 'core',
    setName: 'GOAL',
    setRule: 'SINGLE',
  },
  EXS: {
    id: 'EXS',
    rank: 11,
    imageId: 'ffc-r11a',
    name: {
      en: 'The Jealous Exes',
      pt: 'O Ex / A Ex',
    },
    effect: {
      en: 'You cannot win with this card, unless the Ideal Match (Rank 10) has been played or discarded.',
      pt: 'Você não pode vencer com esta carta, a menos que o Par Ideal (Valor 10) tenha sido jogado ou descartado.',
    },
    flavorText: {
      en: "If I can't have love, nobody can!",
      pt: 'Se eu não tenho, ninguém tem!',
    },
    quantity: 1,
    keyword: 'CONDITIONAL_WIN',
    color: '#8B1A1A',
    tier: 'advanced',
    setName: 'EXS',
    setRule: 'SINGLE',
  },
};

// console.log(Object.keys(CARDS));
// console.log(
//   'CORE CARDS:',
//   Object.values(CARDS)
//     .filter((card) => card.tier === 'core')
//     .map((card) => card.id),
// );
// console.log(
//   'PLUS CARDS:',
//   Object.values(CARDS)
//     .filter((card) => card.tier === 'plus')
//     .map((card) => card.id),
// );
// console.log(
//   'ADVANCED CARDS:',
//   Object.values(CARDS)
//     .filter((card) => card.tier === 'advanced')
//     .map((card) => card.id),
// );
// console.log(
//   Object.values(CARDS)
//     .map((card) => `// case '${card.keyword}': `)
//     .join('\n'),
// );

/**
 * Get game resources based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options that may affect resource loading
 * @param playerCount - The number of players in the game, which may affect resource loading
 * @returns Resource data containing game-specific resources
 */
export const getData = async (language: Language, options: CorreioDoAmorOptions): Promise<ResourceData> => {
  // Build single language dictionary
  const cardsDict: Dictionary<FestaJuninaCard> = keyBy(
    Object.values(CARDS).map((card) => ({
      ...card,
      name: card.name[language],
      effect: card.effect[language],
      flavorText: card.flavorText[language],
      count: 0,
    })),
    'id',
  );

  // Special cards will change every 2 and 3 rounds (for plus and advanced respectively)
  const isChaoticDeck = !!options.chaoticDeck;

  // Determine plus rotation
  const plusRotation = shuffle(
    Object.values(cardsDict)
      .filter((card) => card.tier === 'plus')
      .flatMap((card) => (isChaoticDeck ? [card.id] : Array(3).fill(card.id))),
  );

  // Determine advanced rotation
  const advancedRotation = shuffle(
    Object.values(cardsDict)
      .filter((card) => card.tier === 'advanced')
      .flatMap((card) => (isChaoticDeck ? [card.id] : Array(2).fill(card.id))),
  );

  return {
    cardsDict,
    plusRotation,
    advancedRotation,
  };
};

/**
 * Save used game resources
 * @param language - The language code for the saved data
 * @param data - Game-specific data to save
 */
// export const saveData = async (_language: Language, data: PlainObject) => {
// TODO: Implement data saving logic
// Example:
// const usedIds = buildBooleanDictionary(Object.keys(data));
// await saveUsedResource(usedIds);
// await dataUtils.updateCardDataCollection('collection-name', language, data);
// };
