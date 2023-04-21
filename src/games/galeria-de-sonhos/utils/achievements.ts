import { MedalArrowDownIcon } from 'icons/MedalArrowDownIcon';
import { MedalArrowUpIcon } from 'icons/MedalArrowUpIcon';
import { MedalHeartIcon } from 'icons/MedalHeartIcon';
import { MedalLightBulbIcon } from 'icons/MedalLightBulbIcon';
import { MedalNarrowIcon } from 'icons/MedalNarrowIcon';
import { MedalPersonIcon } from 'icons/MedalPersonIcon';
import { MedalSandTimerIcon } from 'icons/MedalSandTimerIcon';
import { MedalScaredIcon } from 'icons/MedalScaredIcon';
import { MedalStarIcon } from 'icons/MedalStarIcon';
import { MedalSufferingIcon } from 'icons/MedalSufferingIcon';
import { MedalThumbsUpIcon } from 'icons/MedalThumbsUpIcon';

export const achievementsReference: AchievementReference = {
  MOST_MATCHES: {
    Icon: MedalArrowUpIcon,
    title: {
      pt: 'Mais Matches',
      en: 'Most Matches',
    },
    description: {
      pt: 'Deu match com o mais jogadores em cartas sonhos',
      en: 'Match dream cards with other players the most',
    },
  },
  FEWEST_MATCHES: {
    Icon: MedalArrowDownIcon,
    title: {
      pt: 'Menos Matches',
      en: 'Fewest Matches',
    },
    description: {
      pt: 'Deu match com o menos jogadores em cartas sonhos',
      en: 'Match dream cards with other players the fewest',
    },
  },
  MOST_FULL_MATCHES: {
    Icon: MedalHeartIcon,
    title: {
      pt: 'Mais Match Completo',
      en: 'Most Full Matches',
    },
    description: {
      pt: 'Deu match com todos os sonhos em uma rodada mais vezes',
      en: 'Match all dream cards in a round most times',
    },
  },
  MOST_VISITS: {
    Icon: MedalSandTimerIcon,
    title: {
      pt: 'Melhor Visitante',
      en: 'Best Visitor',
    },
    description: {
      pt: 'Visitou o maior número de cartas-sonhos durante o jogo',
      en: 'Visited the most dream cards during the game',
    },
  },
  LEAST_ADVENTUROUS: {
    Icon: MedalNarrowIcon,
    title: {
      pt: 'Mais Comedido',
      en: 'Least Adventurous',
    },
    description: {
      pt: 'Visitou o menor número de cartas-sonhos durante o jogo',
      en: 'Visited the fewest dream cards during the game',
    },
  },
  MOST_ADVENTUROUS: {
    Icon: MedalScaredIcon,
    title: {
      pt: 'Mais Aventureiro',
      en: 'Most Adventurous',
    },
    description: {
      pt: 'Esteve em pesadelos mais vezes',
      en: 'Was in a nightmare more times',
    },
  },
  MOST_PAIRS: {
    Icon: MedalStarIcon,
    title: {
      pt: 'Mais Brilhante',
      en: 'Brightest',
    },
    description: {
      pt: 'Encontrou somente um outro jogador mais vezes',
      en: 'Found only one other player most times',
    },
  },
  MOST_OUT_OF_THE_BOX: {
    Icon: MedalLightBulbIcon,
    title: {
      pt: 'Mais Diferentão',
      en: 'Out of the Box Thinker',
    },
    description: {
      pt: 'Teve mais cartas sem dar match no total',
      en: 'Had the most cards without a match throughout the game',
    },
  },
  MOST_LONELY: {
    Icon: MedalPersonIcon,
    title: {
      pt: 'Mais Solitário',
      en: 'Loneliest',
    },
    description: {
      pt: 'Não deu mete nenhum mais vezes',
      en: 'Got zero matches in a round more times',
    },
  },
  POOREST_CHOICES: {
    Icon: MedalSufferingIcon,
    title: {
      pt: 'Mais Burro',
      en: 'Poorest Choices',
    },
    description: {
      pt: 'Foi eliminado mais vezes',
      en: 'Was eliminated the most',
    },
  },
  SMARTEST_CHOICES: {
    Icon: MedalThumbsUpIcon,
    title: {
      pt: 'Mais Esperto',
      en: 'Smartest Choices',
    },
    description: {
      pt: 'Foi eliminado menos vezes',
      en: 'Was eliminated the least',
    },
  },
};

export default achievementsReference;
