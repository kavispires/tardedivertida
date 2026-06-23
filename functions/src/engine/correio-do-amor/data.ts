// Types
import { keyBy, shuffle } from 'lodash';
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
      en: 'If a Rank 1 targets you with a guess, they are knocked out of the round instead.',
      pt: 'Se uma carta de Valor 1 te acatar, quem a jogou é eliminado da rodada no seu lugar.',
    },
    flavorText: {
      en: 'The music never stops, especially not for gossips.',
      pt: 'A música não para, muito menos por causa de fofoca.',
    },
    quantity: 2,
    keyword: 'COUNTER',
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
      en: 'Does nothing when played. If you are the only player who played this card by the end of the round, you get 1 bonus point.',
      pt: 'Não faz nada ao ser jogada, mas se você for o único a jogar esta carta até o fim da rodada, você ganha 1 ponto bônus.',
    },
    flavorText: {
      en: "It's slippery at the top, but the prize is worth it.",
      pt: 'Escorrega que é uma beleza, mas o prêmio lá em cima compensa.',
    },
    quantity: 2,
    keyword: 'SOLO_BONUS',
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
      en: 'When comparing hands with another player, you automatically win the comparison and they are eliminated.',
      pt: 'Ao comparar cartas com outro jogador, você vence automaticamente e ele é eliminado.',
    },
    flavorText: {
      en: 'Sticky fingers and total immunity to adult rules.',
      pt: 'Dedo grudado de maçã do amor e imunidade total às regras dos adultos.',
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
      en: 'He knows everything about everyone... or so he thinks.',
      pt: 'Ele sabe de tudo sobre todo mundo... ou pelo menos acha que sabe.',
    },
    quantity: 2,
    keyword: 'GUESS',
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
      en: 'Choose a player and guess their card rank (except Rank 1). If you are right, they are eliminated.',
      pt: 'Escolha um jogador e adivinhe o valor da carta dele (exceto Valor 1). Se acertar, ele é eliminado.',
    },
    flavorText: {
      en: 'The fastest news network in the entire festival.',
      pt: 'A rede de notícias mais rápida de todo o arraiá.',
    },
    quantity: 2,
    keyword: 'GUESS',
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
      en: 'He hears all the confessions before the mock wedding.',
      pt: 'Ele ouve todas as confissões antes do casamento caipira.',
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
      pt: 'Olhe secretamente a carta separada no início do jogo. Você pode trocá-la com a sua carta da mão.',
    },
    flavorText: {
      en: 'The future is revealed for the price of a corn on the cob.',
      pt: 'O futuro se revela pelo preço de uma espiga de milho.',
    },
    quantity: 1,
    keyword: 'SWAP_SECRET',
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
      en: 'Sweating through his suit, looking for a high-status escape.',
      pt: 'Suando no terno, procurando um bom motivo para fugir do altar.',
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
      en: "She's rebelling and taking down the big shots.",
      pt: 'Ela está revoltada e pronta para derrubar os engravatados.',
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
      en: 'Immune to all card effects until your next turn. If you win the round holding this, gain 1 extra point.',
      pt: 'Imune aos efeitos de outras cartas até sua próxima vez. Se vencer a rodada com esta carta, ganha 1 ponto extra.',
    },
    flavorText: {
      en: 'He dances to win, and he knows everyone is watching.',
      pt: 'Ele dança para ganhar, e sabe que todo mundo está olhando.',
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
      en: 'Immune to all card effects until your next turn.',
      pt: 'Imune aos efeitos de outras cartas até sua próxima vez.',
    },
    flavorText: {
      en: 'Lost in the rhythm and entirely untouchable.',
      pt: 'Perdida no ritmo e completamente intocável.',
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
      en: 'Blows the whistle and forces everyone to change their plans.',
      pt: 'Apita forte e obriga todo mundo a mudar de plano.',
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
      en: "Trade your plastic fish for whatever they're holding.",
      pt: 'Troque seu peixe de plástico pelo que eles estiverem segurando.',
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
      en: "Trade your plastic fish for whatever they're holding.",
      pt: 'Troque seu peixe de plástico pelo que eles estiverem segurando.',
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
      en: 'Dance!',
      pt: 'Anarriê',
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
      en: 'Fly Swallow!',
      pt: 'Voa Andorinha!',
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
      pt: 'Todos colocam suas cartas viradas para baixo. Recolha, embaralhe e devolva uma para cada jogador.',
    },
    flavorText: {
      en: "It's raining",
      pt: 'Olha a chuva!',
    },
    quantity: 1,
    keyword: 'SHUFFLE_REDRAW',
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
      en: 'If you hold this card and any other card of Rank 5 or higher, you must play this card.',
      pt: 'Se você tiver esta carta e qualquer outra carta de Valor 5 ou mais, você tem que jogar esta carta.',
    },
    flavorText: {
      en: "He doesn't tolerate his family mixing with high-profile trouble.",
      pt: 'Ele não tolera ver sua família metida com gente importante da festa.',
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
      en: 'Too busy eating sweet corn to care about the romance.',
      pt: 'Ocupado demais comendo pamonha para se importar com o romance.',
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
      en: "The ultimate target of the Correio Elegante. Don't let them slip away.",
      pt: 'O alvo principal do Correio Elegante. Não deixe escapar.',
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
      en: "If I can't have romance at this festival, nobody can.",
      pt: 'Se eu não vou ter romance nessa festa, ninguém mais vai.',
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
// const usedIds = utils.helpers.buildBooleanDictionary(Object.keys(data));
// await utils.tdr.saveUsedResource(usedIds);
// await dataUtils.updateCardDataCollection('collection-name', language, data);
// };
