import { shuffle } from 'lodash';
// Types
import type { RunnerCard, ResourceData } from './types';
// Constants
import { CARD_PER_ROUND, MAX_ROUNDS, STARTING_CARDS } from './constants';
// Utils
import { extractPropertyAsConst, type ExtractPropertyAsConst } from '../../utils/object';

/**
 * Get characters based on the game's language
 * @param playerCount - Number of players in the game
 * @returns Resource data containing shuffled runner cards
 */
export const getResourceData = async (playerCount: number): Promise<ResourceData> => {
  // Build deck multiplying all total quantities
  const deck = CARDS.reduce((acc: RunnerCard[], card) => {
    if (card.quantity) {
      for (let i = 0; i < card.quantity; i++) {
        acc.push({
          ...card,
          id: `${card.imageId}-${(acc.length + 1).toString().padStart(2, '0')}`,
        });
      }
    }
    return acc;
  }, []);

  const totalCardsNeeded = playerCount * STARTING_CARDS + CARD_PER_ROUND * MAX_ROUNDS;
  // Add extra cards until all players have enough cards (if needed)
  let extraCount = 0;
  while (deck.length < totalCardsNeeded) {
    if (extraCount % 2 === 0) {
      deck.push({
        ...CARDS[0],
        id: `extra-${extraCount}`,
      });
    } else {
      deck.push({
        ...CARDS[5],
        id: `extra-${extraCount}`,
      });
    }
    extraCount++;
  }

  return {
    cards: shuffle(deck),
  };
};

const CARDS = [
  {
    imageId: 'vc-01',
    name: {
      en: 'Tiny Triumph',
      pt: 'Passinho',
    },
    value: 1,
    type: 'movement-positive',
    quantity: 6,
  },
  {
    imageId: 'vc-02',
    name: {
      en: 'Quick Step',
      pt: 'Pisadinha',
    },
    value: 2,
    type: 'movement-positive',
    quantity: 4,
  },
  {
    imageId: 'vc-03',
    name: {
      en: 'Solid Stride',
      pt: 'Passada Boa',
    },
    value: 3,
    type: 'movement-positive',
    quantity: 4,
  },
  {
    imageId: 'vc-04',
    name: {
      en: 'Turbo Burst',
      pt: 'Turbinado',
    },
    value: 4,
    type: 'movement-positive',
    quantity: 1,
  },
  {
    imageId: 'vc-05',
    name: {
      en: 'Rocket Legs',
      pt: 'Perna de Foguete',
    },
    value: 5,
    type: 'movement-positive',
    quantity: 1,
  },
  {
    imageId: 'vc-06',
    name: {
      en: 'Oops!',
      pt: 'Eita!',
    },
    value: -1,
    type: 'movement-negative',
    quantity: 6,
  },
  {
    imageId: 'vc-07',
    name: {
      en: 'Stumble',
      pt: 'Tropeço',
    },
    value: -2,
    type: 'movement-negative',
    quantity: 4,
  },
  {
    imageId: 'vc-08',
    name: {
      en: 'Trip Wire',
      pt: 'Armadilha',
    },
    value: -3,
    type: 'movement-negative',
    quantity: 4,
  },
  {
    imageId: 'vc-09',
    name: {
      en: 'Faceplant',
      pt: 'Caiu de Boca',
    },
    value: -4,
    type: 'movement-negative',
    quantity: 1,
  },
  {
    imageId: 'vc-10',
    name: {
      en: 'Sabotage',
      pt: 'Fail Épico',
    },
    value: -5,
    type: 'movement-negative',
    quantity: 1,
  },
  {
    imageId: 'vc-11',
    name: {
      en: 'Stay Put',
      pt: 'Fica Parado',
    },
    value: 0,
    type: 'movement-neutral',
    quantity: 1,
  },
  {
    imageId: 'vc-12',
    name: {
      en: 'Catch Breath',
      pt: 'Descansadinha',
    },
    value: 0,
    type: 'movement-neutral',
    quantity: 1,
  },
  {
    imageId: 'vc-13',
    name: {
      en: 'First place',
      pt: 'Primeiro Lugar',
    },
    description: {
      en: 'Places the target runner in front of the first place.',
      pt: 'Coloca o corredor-alvo na frente do primeiro lugar.',
    },
    type: 'effect',
    triggerKey: 'FIRST_PLACE',
    quantity: 2,
  },
  {
    imageId: 'vc-14',
    name: {
      en: 'Last place',
      pt: 'Último Lugar',
    },
    description: {
      en: 'Places the target runner behind the last place.',
      pt: 'Coloca o corredor-alvo atrás do último lugar.',
    },
    type: 'effect',
    triggerKey: 'LAST_PLACE',
    quantity: 2,
  },
  {
    imageId: 'vc-15',
    name: {
      en: 'Swap',
      pt: 'Troca-troca',
    },
    description: {
      en: 'Swaps the first place with the last place.',
      pt: 'Troca o primeiro lugar com o último lugar.',
    },
    type: 'effect',
    triggerKey: 'SWAP',
    quantity: 1,
    autoTarget: true,
    omitsTarget: true,
  },
  {
    imageId: 'vc-16',
    name: {
      en: 'Twist',
      pt: 'Reviravolta',
    },
    description: {
      en: 'Reverses the order of the runners.',
      pt: 'Inverte a ordem dos corredores.',
    },
    type: 'effect',
    triggerKey: 'INVERSE',
    quantity: 1,
    autoTarget: true,
    omitsTarget: true,
  },
  {
    imageId: 'vc-17',
    name: {
      en: 'Everybody but this runner go',
      pt: 'Todo mundo menos esse vai',
    },
    description: {
      en: 'Everybody but the target runner moves 1.',
      pt: 'Todo mundo menos o corredor-alvo anda 1.',
    },
    type: 'effect',
    triggerKey: 'EVERYBODY_ELSE_GO',
    quantity: 1,
  },
  {
    imageId: 'vc-18',
    name: {
      en: 'Everybody but this runner back up',
      pt: 'Todo mundo menos esse volta',
    },
    description: {
      en: 'Everybody but the target runner moves -1.',
      pt: 'Todo mundo menos o corredor-alvo anda -1.',
    },
    type: 'effect',
    triggerKey: 'EVERYBODY_ELSE_BACK',
    quantity: 1,
  },
  {
    imageId: 'vc-19',
    name: {
      en: 'Russian Roulette',
      pt: 'Roleta Russa',
    },
    description: {
      en: 'A runner will randomly be chosen to go to the last place.',
      pt: 'Um corredor aleatório será escolhido ir para o último lugar.',
    },
    type: 'effect',
    triggerKey: 'ROULETTE_LAST',
    quantity: 1,
    autoTarget: true,
  },
  {
    imageId: 'vc-19', // The image is the same
    name: {
      en: 'Russian Roulette',
      pt: 'Roleta Russa',
    },
    description: {
      en: 'A runner will randomly be chosen to go to the first place.',
      pt: 'Um corredor aleatório será escolhido ir para o primeiro lugar.',
    },
    type: 'effect',
    triggerKey: 'ROULETTE_FIRST',
    quantity: 1,
    autoTarget: true,
  },
  {
    imageId: 'vc-20',
    name: {
      en: 'Surprise!',
      pt: 'Surpresa!',
    },
    description: {
      en: 'A random movement card will be played in your behalf affecting the target runner.',
      pt: 'Uma carta de movimento aleatória será jogada em seu nome afetando o corredor-alvo.',
    },
    type: 'effect',
    triggerKey: 'SURPRISE',
    quantity: 2,
  },
  {
    imageId: 'vc-21',
    name: {
      en: 'Energy Drink',
      pt: 'Energético',
    },
    description: {
      en: 'Every movement card targeting this runner will be +1 this turn.',
      pt: 'As cartas de movimento usadas nesse corredor valerão +1 nessa rodada.',
    },
    type: 'ongoing',
    triggerKey: 'ONGOING_PLUS_ONE',
    quantity: 1,
  },
  {
    imageId: 'vc-22',
    name: {
      en: 'Heavy food',
      pt: 'Comida pesada',
    },
    description: {
      en: 'Every movement card targeting this runner will be -1 this turn.',
      pt: 'As cartas de movimento usadas nesse corredor valerão -1 nessa rodada.',
    },
    type: 'ongoing',
    triggerKey: 'ONGOING_MINUS_ONE',
    quantity: 1,
  },
  {
    imageId: 'vc-23',
    name: {
      en: 'Freeze!',
      pt: 'Congelou!',
    },
    description: {
      en: "The target runner can't be moved this turn by movement cards.",
      pt: 'O corredor-alvo não pode ser movido nessa rodada por cartões de movimento.',
    },
    type: 'ongoing',
    triggerKey: 'FREEZE',
    quantity: 1,
  },
] as const satisfies readonly Omit<RunnerCard, 'id'>[];

/**
 * Type-safe constant containing all trigger keys extracted from runner cards
 * Automatically synced with CARDS array, provides autocomplete for valid trigger key values
 */
export const TRIGGER_KEYS = extractPropertyAsConst(CARDS, 'triggerKey') as ExtractPropertyAsConst<
  typeof CARDS,
  'triggerKey'
>;
