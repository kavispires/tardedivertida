// Type
import type { RunnerCard, ResourceData } from './types';
// Helpers
import utils from '../../utils';
import { CARD_PER_ROUND, MAX_ROUNDS, STARTING_CARDS } from './constants';

/**
 * Get characters based on the game's language
 * @param language
 * @param allowNSFW
 * @returns
 */
export const getResourceData = async (playerCount: number): Promise<ResourceData> => {
  // Build deck multiplying all total quantities
  const deck = CARDS.reduce((acc: RunnerCard[], card) => {
    if (card.quantity) {
      for (let i = 0; i < card.quantity; i++) {
        acc.push({
          ...card,
          imageId: card.id,
          id: `${card.id}-${(i + 1).toString().padStart(2, '0')}`,
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
        imageId: CARDS[0].id,
      });
    } else {
      deck.push({
        ...CARDS[5],
        id: `extra-${extraCount}`,
        imageId: CARDS[5].id,
      });
    }
    extraCount++;
  }

  return {
    cards: utils.game.shuffle(deck),
  };
};

const CARDS: Omit<RunnerCard, 'imageId'>[] = [
  {
    id: 'vc-01',
    name: {
      en: 'Tiny Triumph',
      pt: 'Passinho',
    },
    value: 1,
    type: 'movement-positive',
    quantity: 6,
  },
  {
    id: 'vc-02',
    name: {
      en: 'Quick Step',
      pt: 'Pisadinha',
    },
    value: 2,
    type: 'movement-positive',
    quantity: 4,
  },
  {
    id: 'vc-03',
    name: {
      en: 'Solid Stride',
      pt: 'Passada Boa',
    },
    value: 3,
    type: 'movement-positive',
    quantity: 4,
  },
  {
    id: 'vc-04',
    name: {
      en: 'Turbo Burst',
      pt: 'Turbinado',
    },
    value: 4,
    type: 'movement-positive',
    quantity: 1,
  },
  {
    id: 'vc-05',
    name: {
      en: 'Rocket Legs',
      pt: 'Perna de Foguete',
    },
    value: 5,
    type: 'movement-positive',
    quantity: 1,
  },
  {
    id: 'vc-06',
    name: {
      en: 'Oops!',
      pt: 'Eita!',
    },
    value: -1,
    type: 'movement-negative',
    quantity: 6,
  },
  {
    id: 'vc-07',
    name: {
      en: 'Stumble',
      pt: 'Tropeço',
    },
    value: -2,
    type: 'movement-negative',
    quantity: 4,
  },
  {
    id: 'vc-08',
    name: {
      en: 'Trip Wire',
      pt: 'Armadilha',
    },
    value: -3,
    type: 'movement-negative',
    quantity: 4,
  },
  {
    id: 'vc-09',
    name: {
      en: 'Faceplant',
      pt: 'Caiu de Boca',
    },
    value: -4,
    type: 'movement-negative',
    quantity: 1,
  },
  {
    id: 'vc-10',
    name: {
      en: 'Sabotage',
      pt: 'Fail Épico',
    },
    value: -5,
    type: 'movement-negative',
    quantity: 1,
  },
  {
    id: 'vc-11',
    name: {
      en: 'Stay Put',
      pt: 'Fica Parado',
    },
    value: 0,
    type: 'movement-neutral',
    quantity: 1,
  },
  {
    id: 'vc-12',
    name: {
      en: 'Catch Breath',
      pt: 'Descansadinha',
    },
    value: 0,
    type: 'movement-neutral',
    quantity: 1,
  },
  {
    id: 'vc-13',
    name: {
      en: 'First place',
      pt: 'Primeiro Lugar',
    },
    description: {
      en: 'Places the target runner in front of the first place.',
      pt: 'Coloca o corredor-alvo na frente do primeiro lugar.',
    },
    type: 'effect',
    triggerKey: 'first-place',
    quantity: 2,
  },
  {
    id: 'vc-14',
    name: {
      en: 'Last place',
      pt: 'Último Lugar',
    },
    description: {
      en: 'Places the target runner behind the last place.',
      pt: 'Coloca o corredor-alvo atrás do último lugar.',
    },
    type: 'effect',
    triggerKey: 'last-place',
    quantity: 2,
  },
  {
    id: 'vc-15',
    name: {
      en: 'Swap',
      pt: 'Troca-troca',
    },
    description: {
      en: 'Swaps the first place with the last place.',
      pt: 'Troca o primeiro lugar com o último lugar.',
    },
    type: 'effect',
    triggerKey: 'swap',
    quantity: 1,
    noTarget: true,
  },
  // TODO: does not work
  // {
  //   id: 'vc-16',
  //   name: {
  //     en: 'Twist',
  //     pt: 'Reviravolta',
  //   },
  //   description: {
  //     en: 'Reverses the order of the runners.',
  //     pt: 'Inverte a ordem dos corredores.',
  //   },
  //   type: 'effect',
  //   triggerKey: 'inverse',
  //   quantity: 1,
  //   noTarget: true,
  // },
  {
    id: 'vc-17',
    name: {
      en: 'Everybody but you go',
      pt: 'Todo mundo menos você vai',
    },
    description: {
      en: 'Everybody but the target runner moves 1.',
      pt: 'Todo mundo menos o corredor-alvo anda 1.',
    },
    type: 'effect',
    triggerKey: 'everybody-else-go',
    quantity: 1,
  },
  {
    id: 'vc-18',
    name: {
      en: 'Everybody but you back up',
      pt: 'Todo mundo menos você volta',
    },
    description: {
      en: 'Everybody but the target runner moves -1.',
      pt: 'Todo mundo menos o corredor-alvo anda -1.',
    },
    type: 'effect',
    triggerKey: 'everybody-else-back',
    quantity: 1,
  },
  {
    id: 'vc-19',
    name: {
      en: 'Russian Roulette',
      pt: 'Roleta Russa',
    },
    description: {
      en: 'A runner will randomly be chosen to go to the last place.',
      pt: 'Um corredor aleatório será escolhido ir para o último lugar.',
    },
    type: 'effect',
    triggerKey: 'roulette',
    quantity: 2,
  },
  {
    id: 'vc-20',
    name: {
      en: 'Surprise!',
      pt: 'Surpresa!',
    },
    description: {
      en: 'A random card will be played in your behalf affecting the target runner.',
      pt: 'Uma carta aleatória será jogada em seu nome afetando o corredor-alvo.',
    },
    type: 'effect',
    triggerKey: 'surprise',
    quantity: 2,
  },
  {
    id: 'vc-21',
    name: {
      en: 'Energy Drink',
      pt: 'Energético',
    },
    description: {
      en: 'Every movement card targeting this runner will be +1 this turn.',
      pt: 'As cartas de movimento usadas nesse corredor valerão +1 nessa rodada.',
    },
    type: 'ongoing',
    triggerKey: 'ongoing-plus-one',
    quantity: 1,
  },
  {
    id: 'vc-22',
    name: {
      en: 'Heavy food',
      pt: 'Comida pesada',
    },
    description: {
      en: 'Every movement card targeting this runner will be -1 this turn.',
      pt: 'As cartas de movimento usadas nesse corredor valerão -1 nessa rodada.',
    },
    type: 'ongoing',
    triggerKey: 'ongoing-minus-one',
    quantity: 1,
  },
  // {
  //   id: 'vc-23',
  //   name: {
  //     en: 'Freeze!',
  //     pt: 'Congelou!',
  //   },
  //   description: {
  //     // eslint-disable-next-line quotes
  //     en: "The target runner can't be moved this turn by movement cards.",
  //     pt: 'O corredor-alvo não pode ser movido nessa rodada por cartões de movimento.',
  //   },
  //   type: 'ongoing',
  //   triggerKey: 'freeze',
  //   quantity: 1,
  // },
];
