import { keyBy, shuffle } from 'lodash';
// Types
import type { ResourceData, FestaJuninaDatabaseEntry, CorreioDoAmorOptions, FestaJuninaCard } from './types';
// Constants
import { KEYWORDS } from './constants';

/**
 * Card definitions indexed by identifier, including ranks, effects, and targeting rules.
 */
const CARDS: Dictionary<FestaJuninaDatabaseEntry> = {
  '0_SANFONEIRO': {
    id: '0_SANFONEIRO',
    rank: 0,
    imageId: 'fj-r0a',
    name: {
      en: 'The Accordion Player',
      pt: 'O Sanfoneiro',
    },
    effect: {
      en: 'Does nothing when played.',
      pt: 'Não faz nada ao ser jogada.',
    },
    passiveEffect: {
      en: 'If a Rank 1 targets you with a guess, they are knocked out of the round instead.',
      pt: 'Se uma carta de Valor 1 te acatar, quem a jogou é eliminado da rodada no seu lugar.',
    },
    flavorText: {
      en: 'The music never stops, especially not for gossips.',
      pt: 'A música não para, muito menos por causa de fofoca.',
    },
    quantity: 2,
    keyword: KEYWORDS.COUNTER_ATTACK,
    color: '#E8D68A',
    setupTier: 'plus',
    setupRule: 'SINGLE',
  },
  '0_PAU_DE_SEBO': {
    id: '0_PAU_DE_SEBO',
    rank: 0,
    imageId: 'fj-r0b',
    name: {
      en: 'The Grease Pole Climber',
      pt: 'O Pião no Pau de Sebo',
    },
    effect: {
      en: 'Does nothing when played.',
      pt: 'Não faz nada ao ser jogada.',
    },
    passiveEffect: {
      en: 'If you are the only one with this card during the final Rank comparison in the end of the round, you get 1 bonus point.',
      pt: 'Se você for o único com esta carta durante a comparação final de Valores no fim da rodada, ganha 1 ponto bônus.',
    },
    flavorText: {
      en: "It's slippery, but that prize up there? Worth it!",
      pt: 'Escorrega, mas o prêmio lá em cima compensa!',
    },
    quantity: 2,
    keyword: KEYWORDS.SURVIVE_SOLO,
    color: '#E8D68A',
    setupTier: 'plus',
    setupRule: 'SINGLE',
  },
  '0_CRIANCA': {
    id: '0_CRIANCA',
    rank: 0,
    imageId: 'fj-r0c',
    name: {
      en: 'The Kid',
      pt: 'A Criança',
    },
    effect: {
      en: 'Does nothing when played.',
      pt: 'Não faz nada ao ser jogada.',
    },
    passiveEffect: {
      en: 'When a player compares hands with you, you automatically win the comparison and they are eliminated.',
      pt: 'Quando um jogador compara cartas com você, a Criança vence automaticamente e ele é eliminado.',
    },
    flavorText: {
      en: "You're not my mommy!",
      pt: 'Você não é minha mamãe!',
    },
    quantity: 2,
    keyword: KEYWORDS.AUTO_WIN_COMPARE,
    color: '#E8D68A',
    setupTier: 'plus',
    setupRule: 'SINGLE',
  },
  '0_BEBADO': {
    id: '0_BEBADO',
    rank: 0,
    imageId: 'fj-r0d',
    name: {
      en: 'The Drunkard',
      pt: 'O Bêbado',
    },
    effect: {
      en: 'Does nothing when played.',
      pt: 'Não faz nada ao ser jogada.',
    },
    passiveEffect: {
      en: 'When eliminated by another player, you gain a point.',
      pt: 'Quando for eliminado por outro jogador, você ganha 1 ponto.',
    },
    flavorText: {
      en: 'The more I drink, the better I play!',
      pt: 'Quanto mais eu bebo, melhor eu jogo!',
    },
    quantity: 2,
    keyword: KEYWORDS.GAIN_POINT_ON_ELIMINATION,
    color: '#E8D68A',
    setupTier: 'plus',
    setupRule: 'SINGLE',
  },
  '1_CAIPIRA_HOMEM': {
    id: '1_CAIPIRA_HOMEM',
    rank: 1,
    imageId: 'fj-r1a',
    name: {
      en: 'Country Bumpkin',
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
    keyword: KEYWORDS.GUESS_RANK,
    requiresEffectInteraction: true,
    color: '#A52A2A',
    setupTier: 'core',
    setupRule: 'COMBINE',
  },
  '1_CAIPIRA_MULHER': {
    id: '1_CAIPIRA_MULHER',
    rank: 1,
    imageId: 'fj-r1b',
    name: {
      en: 'Country Belle',
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
    keyword: KEYWORDS.GUESS_NAME,
    requiresEffectInteraction: true,
    color: '#A52A2A',
    setupTier: 'core',
    setupRule: 'COMBINE',
  },
  '2_PADRE': {
    id: '2_PADRE',
    rank: 2,
    imageId: 'fj-r2a',
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
    keyword: KEYWORDS.PEEK,
    requiresEffectInteraction: true,
    color: '#b169e6',
    setupTier: 'core',
    setupRule: 'COMBINE',
  },
  '2_CARTOMANTE': {
    id: '2_CARTOMANTE',
    rank: 2,
    imageId: 'fj-r2b',
    name: {
      en: 'The Fortune Teller',
      pt: 'A Cartomante',
    },
    effect: {
      en: 'Secretly look at the set-aside cards.',
      pt: 'Olhe secretamente as cartas separadas no início da rodada.',
    },
    flavorText: {
      en: 'The spirits reveal what comes next!',
      pt: 'Os espíritos revelam o que vem por aí!',
    },
    quantity: 1,
    keyword: KEYWORDS.PEEK_ASIDE,
    requiresEffectInteraction: true,
    color: '#b169e6',
    setupTier: 'advanced',
    setupRule: 'COMBINE',
  },
  '3_NOIVO': {
    id: '3_NOIVO',
    rank: 3,
    imageId: 'fj-r3a',
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
    keyword: KEYWORDS.COMPARE_LOWER,
    requiresEffectInteraction: true,
    color: '#FFF8DC',
    setupTier: 'core',
    setupRule: 'COMBINE',
  },
  '3_NOIVA': {
    id: '3_NOIVA',
    rank: 3,
    imageId: 'fj-r3b',
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
    keyword: KEYWORDS.COMPARE_HIGHER,
    requiresEffectInteraction: true,
    color: '#FFF8DC',
    setupTier: 'core',
    setupRule: 'COMBINE',
  },
  '4_DANCARINA': {
    id: '4_DANCARINA',
    rank: 4,
    imageId: 'fj-r4a',
    name: {
      en: 'The Female Dancer',
      pt: 'A Dançarina de Quadrilha',
    },
    effect: {
      en: 'You will be immune to all card effects until your next turn.',
      pt: 'Você ficará imune aos efeitos de outras cartas até sua próxima vez.',
    },
    passiveEffect: {
      en: 'If you win the round holding this card, gain 1 extra point.',
      pt: 'Se vencer a rodada com esta carta, ganha 1 ponto extra.',
    },
    flavorText: {
      en: 'Watch me shine!',
      pt: 'Olhem só pra mim!',
    },
    quantity: 1,
    keyword: KEYWORDS.IMMUNITY_BONUS,
    color: '#e35d84',
    setupTier: 'core',
    setupRule: 'COMBINE',
  },
  '4_DANCARINO': {
    id: '4_DANCARINO',
    rank: 4,
    imageId: 'fj-r4b',
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
    keyword: KEYWORDS.IMMUNITY,
    color: '#e35d84',
    setupTier: 'core',
    setupRule: 'COMBINE',
  },
  '5_DELEGADO': {
    id: '5_DELEGADO',
    rank: 5,
    imageId: 'fj-r5a',
    name: {
      en: 'The Sheriff',
      pt: 'O Delegado',
    },
    effect: {
      en: 'Choose any player (including yourself) to discard their hand and draw a new card.',
      pt: 'Escolha qualquer jogador (incluindo você) para descartar a mão e comprar uma nova carta.',
    },
    flavorText: {
      en: 'You are under arrest in the name of the law!',
      pt: 'Você está preso em nome da lei!',
    },
    quantity: 2,
    keyword: KEYWORDS.DISCARD_REDRAW,
    requiresEffectInteraction: true,
    color: '#1875d0',
    setupTier: 'core',
    setupRule: 'SINGLE',
  },
  '6_BARRAQUINHA_A': {
    id: '6_BARRAQUINHA_A',
    rank: 6,
    imageId: 'fj-r6a',
    name: {
      en: 'Fishing Game Stand',
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
    keyword: KEYWORDS.TRADE_HANDS,
    requiresEffectInteraction: true,
    color: '#20B2AA',
    setupTier: 'core',
    setupRule: 'SINGLE',
  },
  '6_BARRAQUINHA_B': {
    id: '6_BARRAQUINHA_B',
    rank: 6,
    imageId: 'fj-r6b',
    name: {
      en: 'Throwing Ball Stand',
      pt: 'A Moça das Latas',
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
    keyword: KEYWORDS.FORCE_TRADE,
    requiresEffectInteraction: true,
    color: '#20B2AA',
    setupTier: 'advanced',
    setupRule: 'SINGLE',
  },
  '6_BARRAQUINHA_C': {
    id: '6_BARRAQUINHA_C',
    rank: 6,
    imageId: 'fj-r6c',
    name: {
      en: 'Bingo Stand',
      pt: 'A Moça do Bingo',
    },
    effect: {
      en: 'Swap your hand with one of the cards set aside.',
      pt: 'Troque sua mão com uma das cartas separadas.',
    },
    flavorText: {
      en: 'You never know what your prize will be!',
      pt: 'Nunca se sabe qual será o prêmio!',
    },
    quantity: 1,
    keyword: KEYWORDS.TRADE_ASIDE,
    requiresEffectInteraction: true,
    color: '#20B2AA',
    setupTier: 'advanced',
    setupRule: 'SINGLE',
  },
  '7_PUXADOR_A': {
    id: '7_PUXADOR_A',
    rank: 7,
    imageId: 'fj-r7a',
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
    keyword: KEYWORDS.EXCHANGE_TOP,
    color: '#FFB347',
    setupTier: 'core',
    setupRule: 'SINGLE',
  },
  '7_PUXADOR_B': {
    id: '7_PUXADOR_B',
    rank: 7,
    imageId: 'fj-r7b',
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
    keyword: KEYWORDS.PASS_LEFT,
    color: '#FFB347',
    setupTier: 'advanced',
    setupRule: 'SINGLE',
  },
  '7_PUXADOR_C': {
    id: '7_PUXADOR_C',
    rank: 7,
    imageId: 'fj-r7c',
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
    keyword: KEYWORDS.SHUFFLE,
    color: '#FFB347',
    setupTier: 'advanced',
    setupRule: 'SINGLE',
  },
  '8_FAZENDEIRO': {
    id: '8_FAZENDEIRO',
    rank: 8,
    imageId: 'fj-r8a',
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
    keyword: KEYWORDS.FORCE_PLAY,
    color: '#754a1a',
    setupTier: 'core',
    setupRule: 'SINGLE',
  },
  '9_COMILAO': {
    id: '9_COMILAO',
    rank: 9,
    imageId: 'fj-r9a',
    name: {
      en: 'The Foodie',
      pt: 'O Comilão',
    },
    effect: {
      en: 'Does nothing when played.',
      pt: 'Não faz nada ao ser jogada.',
    },
    passiveEffect: {
      en: 'If you win the round holding this card, you gain 1 less point.',
      pt: 'Se você vencer a rodada com esta carta, ganha 1 ponto a menos.',
    },
    flavorText: {
      en: 'This food is amazing!',
      pt: 'Que delícia de comida!',
    },
    quantity: 1,
    keyword: KEYWORDS.WIN_PENALTY,
    color: '#228B22',
    setupTier: 'advanced',
    setupRule: 'SINGLE',
  },
  '10_GOAL': {
    id: '10_GOAL',
    rank: 10,
    imageId: 'fj-r10a',
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
    keyword: KEYWORDS.AUTO_ELIMINATE,
    color: '#FF6B6B',
    setupTier: 'core',
    setupRule: 'SINGLE',
  },
  '11_EXS': {
    id: '11_EXS',
    rank: 11,
    imageId: 'fj-r11a',
    name: {
      en: 'The Jealous Exes',
      pt: 'O Ex / A Ex',
    },
    effect: {
      en: 'Does nothing when played.',
      pt: 'Não faz nada ao ser jogada.',
    },
    passiveEffect: {
      en: 'You cannot win with this card, unless the Ideal Match (Rank 10) has been played or discarded.',
      pt: 'Você não pode vencer com esta carta, a menos que o Par Ideal (Valor 10) tenha sido jogado ou descartado.',
    },
    flavorText: {
      en: "If I can't have love, nobody can!",
      pt: 'Se eu não tenho, ninguém tem!',
    },
    quantity: 1,
    keyword: KEYWORDS.CONDITIONAL_WIN,
    color: '#8B1A1A',
    setupTier: 'advanced',
    setupRule: 'SINGLE',
  },
};

// console.log(Object.keys(CARDS));
// console.log(
//   Object.values(CARDS)
//     .map((card) => `${card.keyword}: '${card.keyword}',`)
//     .join(' '),
// );

/**
 * Get game resources based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options that may affect resource loading
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
      passiveEffect: card.passiveEffect?.[language] ?? '',
      count: 0,
    })),
    'id',
  );

  // Special cards will change every 2 and 3 rounds (for plus and advanced respectively)
  const isChaoticDeck = !!options.chaoticDeck;

  // Determine plus rotation
  const plusRotation = shuffle(
    Object.values(cardsDict)
      .filter((card) => card.setupTier === 'plus')
      .flatMap((card) => (isChaoticDeck ? [card.id] : Array(3).fill(card.id))),
  );

  // Determine advanced rotation
  const advancedRotation = shuffle(
    Object.values(cardsDict)
      .filter((card) => card.setupTier === 'advanced')
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
