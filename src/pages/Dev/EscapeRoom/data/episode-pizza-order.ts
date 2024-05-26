import { cloneDeep, shuffle } from 'lodash';
import {
  finalizeEpisode,
  isKeywordInTheEpisode,
  isRequiredKeywordInTheEpisode,
  prepareEpisode,
} from '../utils/helpers';
import {
  ERBuildingBlock,
  EpisodeLevel,
  EscapeRoomCard,
  EscapeRoomEpisode,
  ScoringCondition,
  ERUnorderedListCard,
} from '../utils/types';

const PIZZA_ORDER_EPISODE: EscapeRoomCard[] = [
  {
    id: '#',
    type: 'mission',
    header: {
      title: {
        en: 'Mission #1',
        pt: 'Missão #1',
      },
    },
    metadata: {
      level: 'basic',
    },
    content: {
      number: 1,
      title: {
        en: 'The Pizza Order',
        pt: 'O Pedido de Pizza',
      },
      paragraphs: [
        {
          en: 'You all work at a pizza delivery place that only serves pizzas and salads. A customer needs to call to place an order. Fulfill the first possible order by playing the correct pizza ingredients, put it in the oven, and then ring the ready bell. Is today a special day?',
          pt: 'Todos vocês trabalham em uma pizzaria que só serve pizzas e saladas. Um cliente precisa ligar para fazer um pedido. Atenda o primeiro pedido possível usando os ingredientes corretos da pizza, coloque-a no forno e toque o sininho de pronto. Hoje é um dia especial?',
        },
      ],
    },
    conditions: [
      {
        requiredKeyword: 'MOON',
        iconId: '1618',
        target: {
          en: 'Moon',
          pt: 'Lua',
        },
        consequence: {
          en: 'The caller was a picky eater, the order should NOT have any tomato sauce',
          pt: 'O cliente é chato para comer, o pedido NÃO deve ter molho de tomate',
        },
        level: 'basic',
      },
      {
        requiredKeyword: 'LEAF',
        iconId: '532',
        target: {
          en: 'Leaf',
          pt: 'Folha',
        },
        consequence: {
          en: 'The caller comments they are vegetarian, we should remove any meat ingredients from their pizza, if any, but still serve the ordered pizza',
          pt: 'O cliente comenta que é vegetariano, devemos remover quaisquer ingredientes de carne de sua pizza, se houver, mas ainda servir a pizza pedida',
        },
        level: 'intermediate',
      },
      {
        requiredKeyword: 'ELECTRICITY',
        iconId: '446',
        target: {
          en: 'Electricity',
          pt: 'Eletricidade',
        },
        consequence: {
          en: "A power outage ocurred at 6:42 and lasted 7 minutes, no phone calls could've been received during that time",
          pt: 'Uma queda de energia ocorreu às 6:42 e durou 7 minutos, nenhuma ligação poderia ter sido recebida durante esse tempo',
        },
        level: 'advanced',
      },
    ],
  },
  {
    id: '#',
    type: 'text',
    header: {
      title: {
        en: 'Hours of Operation',
        pt: 'Horário de Funcionamento',
      },
      iconId: '1967',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      text: {
        en: 'The pizzeria is open from6:00 to 10:00 every night',
        pt: 'A pizzaria está aberta das 6:00 às 10:00 todas as noites',
      },
    },
  },
  {
    id: '#',
    type: 'unordered-list',
    header: {
      title: {
        en: 'Employee Handbook',
        pt: 'Manual do Funcionário',
      },
      iconId: '1145',
    },
    metadata: {
      level: 'intermediate',
    },
    content: {
      list: [
        {
          en: 'Every pizza has cheese and tomato sauce.',
          pt: 'Toda pizza vai queijo e molho.',
        },
        {
          en: "Don't add any additional ingredient, but it's okay to remove an ingredient upon request.",
          pt: 'Não adicione nenhum ingrediente adicional, mas é permitido remover ingredients se for a pedido.',
        },
        {
          en: 'If you are not baking a pizza, skip the oven step.',
          pt: 'Se você não estiver assando uma pizza, pule a etapa do forno.',
        },
      ],
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Pop-Up',
        pt: 'Placa',
      },
    },
    metadata: {
      level: 'basic',
      conditional: true,
      keyword: 'MENS_DAY',
    },
    content: {
      itemId: '394',
      message: {
        text: {
          en: "Today is Men's Day, we will only take orders from a man",
          pt: 'Hoje é o dia do homem, só atenderemos pedidos feitos por homens',
        },
      },
    },
  },
  {
    id: '#',
    type: 'building-block',
    header: {
      title: {
        en: 'Menu',
        pt: 'Cardápio',
      },
      iconId: '835',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      targetType: 'ordered-list',
      blocks: {
        flavors: [
          { en: 'Cheese Pizza (oregano)', pt: 'Pizza de Queijo (orégano)', keywords: ['CHEESE'] },
          {
            en: 'Hawaiian Pizza (cheese, ham, pineapple)',
            pt: 'Pizza Havaiana (queijo, presunto, abacaxi)',
            keywords: ['CHEESE', 'HAM', 'PINEAPPLE'],
          },
          {
            en: 'Corn Bacon (cheese)',
            pt: 'Pizza Corn Bacon (queijo)',
            keywords: ['CHEESE', 'CORN', 'BACON'],
          },
          {
            en: 'Spicy PEPPERONI',
            pt: 'Calabresa Picante',
            keywords: ['CHEESE', 'PEPPERONI', 'CHILI_PEPPER'],
          },
          {
            en: 'Supreme (cheese, olives, ham, pepperoni, corn, bell pepper)',
            pt: 'Suprema (queijo, azeitona, presunto, linguiça, milho, pimentão)',
            keywords: ['CHEESE', 'OLIVES', 'HAM', 'PEPPERONI', 'CORN', 'BELL_PEPPER'],
          },
        ],
        prices: [
          { price: '6.49' },
          { price: '6.99', keyword: 'SECOND_CHEAPEST' },
          { price: '7.99' },
          { price: '8.99' },
          { price: '9.99', keyword: 'EXPENSIVE' },
        ],
        salad: { en: 'Salad', pt: 'Salada', price: '4.99', keyword: ['SALAD'] },
      },
    },
  },
  {
    id: '#',
    type: 'voice',
    header: {
      title: {
        en: 'Phone call',
        pt: 'Ligação',
      },
      iconId: '2065',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      text: {
        en: 'Call time: 5:15',
        pt: 'Horário da ligação: 5:15',
      },
      speaker: {
        en: 'Carl',
        pt: 'Carlos',
      },
      speech: {
        en: 'I would like to order the Hawaiian pizza, please',
        pt: 'Gostaria de pedir a pizza Havaiana, por favor',
      },
    },
  },
  {
    id: '#',
    type: 'voice',
    header: {
      title: {
        en: 'Phone call',
        pt: 'Ligação',
      },
      iconId: '2065',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      text: {
        en: 'Call time: 6:09',
        pt: 'Horário da ligação: 6:09',
      },
      speaker: {
        en: 'Beth',
        pt: 'Bia',
      },
      speech: {
        en: 'I would like to order the most expensive pizza on the menu, please.',
        pt: 'Gostaria de pedir a pizza mais cara do cardápio, por favor. ',
      },
    },
  },
  {
    id: '#',
    type: 'voice',
    header: {
      title: {
        en: 'Phone call',
        pt: 'Ligação',
      },
      iconId: '2065',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      text: {
        en: 'Call time: 6:12',
        pt: 'Horário da ligação: 6:12',
      },
      speaker: {
        en: 'Bob',
        pt: 'Beto',
      },
      speech: {
        en: 'I would like to order the second cheapest pizza on the menu, please.',
        pt: 'Gostaria de pedir a segunda pizza mais barata do cardápio, por favor.',
      },
    },
  },
  {
    id: '#',
    type: 'voice',
    header: {
      title: {
        en: 'Phone call',
        pt: 'Ligação',
      },
      iconId: '2065',
    },
    metadata: {
      level: 'intermediate',
      conditional: true,
      requiredKeyword: 'SALAD',
    },
    content: {
      text: {
        en: 'Call time: 6:47',
        pt: 'Horário da ligação: 6:47',
      },
      speech: {
        en: 'I would like to cancel my previous order, and order a salad instead',
        pt: 'Gostaria de cancelar meu pedido anterior e pedir uma salada no lugar',
      },
    },
  },
  {
    id: '#',
    type: 'voice',
    header: {
      title: {
        en: 'Phone call',
        pt: 'Ligação',
      },
      iconId: '2065',
    },
    metadata: {
      level: 'basic',
      conditional: true,
      requiredKeyword: 'COKE',
    },
    content: {
      text: {
        en: 'Call time: 6:57',
        pt: 'Horário da ligação: 6:57',
      },
      speech: {
        en: 'Can you add a coke to my order, please?',
        pt: 'Pode adicionar uma coca ao meu pedido, por favor?',
      },
    },
  },
  {
    id: '#',
    type: 'voice',
    header: {
      title: {
        en: 'Phone call',
        pt: 'Ligação',
      },
      iconId: '2065',
    },
    metadata: {
      level: 'basic',
      conditional: true,
    },
    content: {
      text: {
        en: 'Call time: 6:05',
        pt: 'Horário da ligação: 6:05',
      },
      speaker: {
        en: 'Mark',
        pt: 'Marcos',
      },
      speech: {
        en: 'I would like to order an hot dog, please',
        pt: 'Gostaria de pedir um cachorro quente, por favor',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Oven',
        pt: 'Forno',
      },
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '606',
      message: {
        text: {
          en: 'Put it in the...',
          pt: 'Coloque no...',
        },
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ready Bell',
        pt: 'Sininho de Pronto',
      },
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '1437',
      message: {
        text: {
          en: 'Ring the...',
          pt: 'Toque o...',
        },
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'DOUGH',
    },
    content: {
      itemId: '2046',
      caption: {
        en: 'Dough',
        pt: 'Massa',
      },
    },
  },
  {
    id: '#',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    type: 'item',
    metadata: {
      level: 'basic',
      keyword: 'CHEESE',
    },
    content: {
      itemId: '487',
      caption: {
        en: 'Cheese',
        pt: 'Queijo',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'TOMATO_SAUCE',
    },
    content: {
      itemId: '1462',
      caption: {
        en: 'Tomato Sauce',
        pt: 'Molho de Tomate',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'HOT_DOG',
    },
    content: {
      itemId: '338',
      caption: {
        en: 'Hot Dog',
        pt: 'Cachorro Quente',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'SALAD',
    },
    content: {
      itemId: '236',
      caption: {
        en: 'Salad',
        pt: 'Salada',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'BACON',
    },
    content: {
      itemId: '796',
      caption: {
        en: 'Bacon',
        pt: 'Bacon',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'PINEAPPLE',
    },
    content: {
      itemId: '125',
      caption: {
        en: 'Pineapple',
        pt: 'Abacaxi',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'CORN',
    },
    content: {
      itemId: '211',
      caption: {
        en: 'Corn',
        pt: 'Milho',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'BELL_PEPPER',
    },
    content: {
      itemId: '1535',
      caption: {
        en: 'Bell Pepper',
        pt: 'Pimentão',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'HAM',
    },
    content: {
      itemId: '1295',
      caption: {
        en: 'Ham',
        pt: 'Presunto',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'OLIVES',
    },
    content: {
      itemId: '1625',
      caption: {
        en: 'Olives',
        pt: 'Azeitonas',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'COKE',
    },
    content: {
      itemId: '825',
      caption: {
        en: 'Coke',
        pt: 'Coca-Cola',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'PEPPERONI',
    },
    content: {
      itemId: '2022',
      caption: {
        en: 'Pepperoni',
        pt: 'Calabresa',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      keyword: 'CHILI_PEPPER',
    },
    content: {
      itemId: '553',
      caption: {
        en: 'Chili Pepper',
        pt: 'Pimenta Malagueta',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
    },
    content: {
      itemId: '363',
      caption: {
        en: 'Oregano',
        pt: 'Orégano',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Thing',
        pt: 'Coisa',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
      conditional: true,
      keyword: 'MOON',
    },
    content: {
      itemId: '1059',
      caption: {
        en: 'Moon',
        pt: 'Lua',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Thing',
        pt: 'Coisa',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
      conditional: true,
      keyword: 'ELECTRICITY',
    },
    content: {
      itemId: '446',
      caption: {
        en: 'Electricity',
        pt: 'Eletricidade',
      },
    },
  },
  {
    id: '#',
    type: 'item',
    header: {
      title: {
        en: 'Thing',
        pt: 'Coisa',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
      conditional: true,
      keyword: 'LEAF',
    },
    content: {
      itemId: '532',
      caption: {
        en: 'Leaf',
        pt: 'Folha',
      },
    },
  },
];

const PIZZA_ORDER_FILLERS: EscapeRoomCard[] = [
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '543',
      caption: {
        en: 'Carrot',
        pt: 'Cenoura',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '795',
      caption: {
        en: 'Broccoli',
        pt: 'Brócolis',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '693',
      caption: {
        en: 'Eggplant',
        pt: 'Berinjela',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '1739',
      caption: {
        en: 'Garlic',
        pt: 'Alho',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '436',
      caption: {
        en: 'Mushrooms',
        pt: 'Cogumelos',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '1306',
      caption: {
        en: 'Mustard',
        pt: 'Mostarda',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '2047',
      caption: {
        en: 'Chicken',
        pt: 'Frango',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '1609',
      caption: {
        en: 'Meatballs',
        pt: 'Almôndegas',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Ingredient',
        pt: 'Ingrediente',
      },
      iconId: '1213',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '761',
      caption: {
        en: 'Eggs',
        pt: 'Ovos',
      },
    },
  },
  {
    id: 'F',
    type: 'item',
    header: {
      title: {
        en: 'Thing',
        pt: 'Coisa',
      },
      iconId: '2077',
    },
    metadata: {
      level: 'basic',
      filler: true,
    },
    content: {
      itemId: '272',
      caption: {
        en: 'Band-Aid',
        pt: 'Band-Aid',
      },
    },
  },
];
console.log('PIZZA_ORDER_FILLERS', PIZZA_ORDER_FILLERS.length);

export function buildPizzaOrderEpisode(episodeLevel: EpisodeLevel, playerCount: number): EscapeRoomEpisode {
  const { selectedCards: cards, missionKeywords } = prepareEpisode(
    cloneDeep(PIZZA_ORDER_EPISODE),
    episodeLevel
  );

  // Find building block menu card and build it into a card
  const menuBuildingBlock = cards.find((card) => card.type === 'building-block') as
    | ERBuildingBlock
    | undefined;
  let secondCheapestPizza: PlainObject = {
    keywords: [],
  };
  let expensivePizza: PlainObject = {
    keywords: [],
  };

  if (menuBuildingBlock) {
    const flavors = shuffle(menuBuildingBlock.content.blocks.flavors);
    const prices = shuffle(menuBuildingBlock.content.blocks.prices);

    const newMenuCard: ERUnorderedListCard = {
      id: '',
      header: menuBuildingBlock.header,
      type: 'unordered-list',
      metadata: {
        level: menuBuildingBlock.metadata?.level ?? 'basic',
        conditional: menuBuildingBlock.metadata?.conditional,
        filler: menuBuildingBlock.metadata?.filler,
      },
      content: {
        list: flavors.map((flavor, index) => {
          const priceObj = prices[index];
          if (priceObj.keyword === 'SECOND_CHEAPEST') {
            secondCheapestPizza = flavor;
          }
          if (priceObj.keyword === 'EXPENSIVE') {
            expensivePizza = flavor;
          }

          return {
            en: `${flavor.en} - $${priceObj.price}`,
            pt: `${flavor.pt} - $${priceObj.price}`,
          };
        }),
      },
    };

    newMenuCard.content.list.push({
      en: `${menuBuildingBlock.content.blocks.salad.en} - $${menuBuildingBlock.content.blocks.salad.price}`,
      pt: `${menuBuildingBlock.content.blocks.salad.pt} - $${menuBuildingBlock.content.blocks.salad.price}`,
    });

    cards.push(newMenuCard);
  }

  // Determine winning conditions
  console.log('missionKeywords', missionKeywords);
  let includes: ScoringCondition[] = [
    {
      keyword: 'TOMATO_SAUCE',
      description: {
        en: 'Tomato sauce is a basic ingredient',
        pt: 'Molho de tomate é um ingrediente básico',
      },
    },
  ];

  let excludes: ScoringCondition[] = [];

  // Basic scenario: MOST_EXPENSIVE_PIZZA
  if (isKeywordInTheEpisode(cards, 'MENS_DAY')) {
    console.log({ secondCheapestPizza });
    includes.push(
      ...secondCheapestPizza.keywords.map((keyword: string) => ({
        keyword,
        description: {
          en: 'Second cheapest pizza ingredient, like Bob ordered',
          pt: 'Ingrediente da segunda pizza mais barata, como o Beto pediu',
        },
      }))
    );
  } else {
    console.log({ expensivePizza });
    includes.push(
      ...expensivePizza.keywords.map((keyword: string) => ({
        keyword,
        description: {
          en: 'Expensive pizza ingredient, like Beth ordered',
          pt: 'Ingrediente da segunda pizza mais barata, como a Bia pediu',
        },
      }))
    );
  }

  // If SALAD
  console.log(
    'SALAD?',
    isRequiredKeywordInTheEpisode(cards, 'SALAD'),
    !missionKeywords.includes('ELECTRICITY'),
    isKeywordInTheEpisode(cards, 'ELECTRICITY')
  );
  // Is salad in the keywords?
  const isSalad =
    isRequiredKeywordInTheEpisode(cards, 'SALAD') &&
    !(missionKeywords.includes('ELECTRICITY') && isKeywordInTheEpisode(cards, 'ELECTRICITY'));
  console.log('isSalad', isSalad);
  if (isSalad) {
    includes = [];
    includes.push({
      keyword: 'SALAD',
      description: {
        en: 'The customer ordered a salad instead of a pizza',
        pt: 'O cliente pediu uma salada ao invés de uma pizza',
      },
    });
  } else {
    includes.push({
      keyword: 'OVEN',
      description: {
        en: 'The pizza was put in the oven',
        pt: 'A pizza foi colocada no forno',
      },
    });
  }

  // if MOON: - TOMATO_SAUCE
  if (isKeywordInTheEpisode(cards, 'MOON')) {
    includes = includes.filter((e) => e.keyword !== 'TOMATO_SAUCE');
    excludes.push({
      keyword: 'TOMATO_SAUCE',
      description: {
        en: 'The pizza should not have tomato sauce because of the picky eater',
        pt: 'A pizza não deve ter molho de tomate por causa do cliente chato',
      },
    });
  }

  // if needs coke
  if (isRequiredKeywordInTheEpisode(cards, 'COKE')) {
    includes.push({
      keyword: 'COKE',
      description: {
        en: 'A coke was added to the order because the customer called asking for it',
        pt: 'Uma coca foi adicionada ao pedido porque o cliente ligou pedindo',
      },
    });
  }

  includes.push({
    keyword: 'READY_BELL',
    description: {
      en: 'The ready bell was rung',
      pt: 'O sininho de pronto foi tocado',
    },
  });

  // Determine bonus conditions (only if it's a pizza)
  const bonuses: ScoringCondition[] = !isSalad
    ? [
        {
          keyword: 'DOUGH',
          description: {
            en: 'The dough was used',
            pt: 'A massa foi usada',
          },
        },
      ]
    : [];

  const episode = finalizeEpisode(cards, cloneDeep(PIZZA_ORDER_FILLERS), episodeLevel, playerCount, {
    includes,
    excludes,
    bonuses,
    ordered: [],
  });
  console.log({ episode });

  return episode;
}
