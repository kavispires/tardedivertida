import { MedalArrowDownIcon } from 'icons/MedalArrowDownIcon';
import { MedalArrowUpIcon } from 'icons/MedalArrowUpIcon';
import { MedalNarrowIcon } from 'icons/MedalNarrowIcon';
import { MedalRobotIcon } from 'icons/MedalRobotIcon';
import { MedalThumbsDownIcon } from 'icons/MedalThumbsDownIcon';
import { MedalThumbsUpIcon } from 'icons/MedalThumbsUpIcon';
import { SEPARATOR } from 'utils/constants';

/**
 * Creates a glyph reference dictionary where true means positive and false means negative
 * @param positive
 * @param negative
 * @returns
 */
export const prepareGlyphs = (
  positive: BooleanDictionary,
  negative: BooleanDictionary
): BooleanDictionary => {
  const dict: BooleanDictionary = {};
  Object.keys(positive).forEach((key) => (dict[key] = true));
  Object.keys(negative).forEach((key) => (dict[key] = false));

  return dict;
};

export const parseSelectedGlyphs = (glyphs: BooleanDictionary) => {
  const positive: string[] = [];
  const negative: string[] = [];

  Object.keys(glyphs).forEach((id) => {
    if (glyphs[id]) {
      positive.push(id);
    } else {
      negative.push(id);
    }
  });

  while (positive.length < 3) {
    positive.push('');
  }

  while (negative.length < 3) {
    negative.push('');
  }

  return [positive, negative];
};

/**
 * Get list of players on each voted character
 * @param players
 * @param votes
 * @returns
 */
export const getRibbons = (players: GamePlayers, votes: StringDictionary): Record<string, GamePlayer[]> => {
  const votesDict: Record<string, GamePlayer[]> = {};

  Object.keys(votes).forEach((playerEntry) => {
    const playerId = playerEntry.split(SEPARATOR)[1];
    const characterId = votes[playerEntry].split(SEPARATOR)[1];

    if (votesDict[characterId] === undefined) {
      votesDict[characterId] = [];
    }

    votesDict[characterId].push(players[playerId]);
  });

  return votesDict;
};

/**
 * Removes prefixes from votes
 * @param votes
 * @returns
 */
export const prepareGuesses = (votes: StringDictionary): StringDictionary => {
  const result: StringDictionary = {};

  Object.keys(votes).forEach((playerEntry) => {
    const playerId = playerEntry.split(SEPARATOR)[1];
    const characterId = votes[playerEntry].split(SEPARATOR)[1];

    result[playerId] = characterId;
  });

  return result;
};

export const achievementsReference: AchievementReference = {
  MOST_GLYPHS: {
    Icon: MedalArrowUpIcon,
    title: {
      pt: 'Melhor Uso dos Ícones',
      en: 'Best Glyph User',
    },
    description: {
      pt: 'Usou o maior número de ícones durante o jogo',
      en: 'Used the most glyphs during the game',
    },
  },
  LEAST_GLYPHS: {
    Icon: MedalArrowDownIcon,
    title: {
      pt: 'Mais Sucinto',
      en: 'Most Succinct',
    },
    description: {
      pt: 'Usou o menor número de ícones durante o jogo',
      en: 'Used the fewest glyphs during the game',
    },
  },
  MOST_POSITIVE: {
    Icon: MedalThumbsUpIcon,
    title: {
      pt: 'Mais Positivo',
      en: 'Most Positive',
    },
    description: {
      pt: 'Usou mais ícones no lado positivo',
      en: 'Used the most glyphs on the positive side',
    },
  },
  LEAST_POSITIVE: {
    Icon: MedalThumbsUpIcon,
    title: {
      pt: 'Menos Positivo',
      en: 'Least Positive',
    },
    description: {
      pt: 'Usou menos ícones no lado positivo',
      en: 'Used the least glyphs on the positive side',
    },
  },
  MOST_NEGATIVE: {
    Icon: MedalThumbsDownIcon,
    title: {
      pt: 'Mais Negativo',
      en: 'Most Negative',
    },
    description: {
      pt: 'Usou mais ícones no lado negativo',
      en: 'Used the most glyphs on the negative side',
    },
  },
  LEAST_NEGATIVE: {
    Icon: MedalThumbsDownIcon,
    title: {
      pt: 'Menos Negativo',
      en: 'Least Negative',
    },
    description: {
      pt: 'Usou menos ícones no lado negativo',
      en: 'Used the least glyphs on the negative side',
    },
  },
  SINGLE_ICON: {
    Icon: MedalNarrowIcon,
    title: {
      pt: 'Mais Único',
      en: 'Most Unique',
    },
    description: {
      pt: 'Usou apenas um ícone mais vezes',
      en: 'Used a single icon most times',
    },
  },
  TABLE_VOTES: {
    Icon: MedalRobotIcon,
    title: {
      pt: 'Melhor Votador Pra Mesa',
      en: 'Best Table Voter',
    },
    description: {
      pt: 'Votou nas cartas extras que não eram de nenhum jogador mais vezes',
      en: "Voted for extra cards that didn't belong to any player the most",
    },
  },
};
