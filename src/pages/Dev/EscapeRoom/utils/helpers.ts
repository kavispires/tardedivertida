import { cloneDeep, get, shuffle } from 'lodash';
import { EpisodeLevel, EscapeRoomCard, EscapeRoomEpisode } from './types';
import { GENERIC_CARDS } from '../data/generic-cards';

/**
 * Determines whether an entry level should be included in an episode level.
 * @param episodeLevel - The level of the episode.
 * @param entryLevel - The level of the entry.
 */
export const includeInEpisode = (episodeLevel: EpisodeLevel, entryLevel: EpisodeLevel): boolean => {
  switch (episodeLevel) {
    // Advanced episodes accept all entries
    case 'advanced':
      return true;
    // Intermediate episodes accept intermediate and basic entries
    case 'intermediate':
      return ['intermediate', 'basic'].includes(entryLevel);
    // Basic episodes only accept basic entries
    case 'basic':
      return entryLevel === 'basic';
  }
};

/**
 * Determines if the conditional entry should be present with 65% of probability.
 */
export const determineConditional = (): boolean => Math.random() < 0.65;

export const isKeywordInTheEpisode = (cards: EscapeRoomCard[], keyword: string): boolean =>
  cards.some((card) => card?.metadata?.keyword === keyword);

export const isRequiredKeywordInTheEpisode = (cards: EscapeRoomCard[], keyword: string): boolean =>
  cards.some((card) => card?.metadata?.requiredKeyword === keyword);

/**
 * Splits list into a number of parts
 * @param list
 * @param [numParts] how many parts it should be split into
 * @returns
 */
export const sliceInParts = <T>(list: T[], numParts = 1): T[][] => {
  const res: T[][] = [];

  if (numParts === 1) return [list];
  if (numParts < 1) return [];

  let i = 0;

  if (list.length % numParts === 0) {
    const partSize = Math.floor(list.length / numParts);
    while (i < list.length) {
      res.push(list.slice(i, (i += partSize)));
    }
  } else {
    while (i < list.length) {
      const partSize = Math.ceil((list.length - i) / numParts--);
      res.push(list.slice(i, (i += partSize)));
    }
  }

  return res;
};

/**
 * Prepares an episode by selecting cards and cleaning up the mission based on the episode level.
 *
 * @param allCards - An array of all available cards.
 * @param level - The episode level.
 * @returns An object containing the selected cards and mission keywords.
 */
export const prepareEpisode = (allCards: EscapeRoomCard[], level: EpisodeLevel) => {
  console.log('EPISODE LEVEL', level);
  // ALWAYS: Get all cards that should be in the episode
  let selectedCards = allCards.filter((card) => includeInEpisode(level, card?.metadata?.level ?? 'basic'));

  // ALWAYS: Cleanup mission depending on the episode level
  const missionKeywords: string[] = [];
  const missionCards = selectedCards.filter((card) => card.type === 'mission');

  missionCards.forEach((missionCard) => {
    if (missionCard && missionCard.conditions) {
      missionCard.conditions = missionCard.conditions.filter((condition) =>
        includeInEpisode(level, condition.level)
      );
      missionCard.conditions.forEach((condition) => missionKeywords.push(condition.requiredKeyword));
    }
  });
  // ALWAYS: For any conditional card, decide if they are in with 65% chance
  selectedCards = selectedCards.filter((card) => !card?.metadata?.conditional || determineConditional());

  for (let i = 0; i < missionCards.length; i++) {
    selectedCards.push(cloneDeep(GENERIC_CARDS.COMPLETE_MISSION));
  }

  selectedCards.push(cloneDeep(GENERIC_CARDS.FINISH_EPISODE));

  return {
    selectedCards,
    missionKeywords,
  };
};

export const finalizeEpisode = (
  episodeCards: EscapeRoomCard[],
  fillerCards: EscapeRoomCard[],
  level: EpisodeLevel,
  playerCount: number,
  winningCondition: EscapeRoomEpisode['winningCondition']
) => {
  // ALWAYS: Remove building blocks
  episodeCards = episodeCards.filter((card) => card.type !== 'building-block');

  // ALWAYS: Add filler items until each player would have equal number of cards
  const shuffledFillers = shuffle(fillerCards);
  const extraCards = episodeCards.length % playerCount;
  if (extraCards > 0) {
    const fillerAmount = playerCount - extraCards;
    for (let i = 0; i < fillerAmount; i++) {
      episodeCards.push(shuffledFillers[i]);
    }
  }

  // ALWAYS: Redetermine ids
  episodeCards.forEach((card, index) => {
    card.id = String(index);
  });

  return {
    title: {
      en: 'Pizza Delivery',
      pt: 'Entrega de Pizza',
    },
    level,
    cards: shuffle(episodeCards),
    winningCondition,
  };
};

const getValue = (card: EscapeRoomCard, path: string, separator?: string) => {
  const value = get(card, path, '');
  if (!separator) return value;
  return value ? ` ${separator} ${value}` : '';
};

export function printEpisode(episode: EscapeRoomEpisode) {
  const sentences: string[] = [];

  episode.cards.forEach((card) => {
    const header = `#${sentences.length + 1} - ${card.header.title.en}:`;

    switch (card.type) {
      case 'item':
        sentences.push(
          `${header} ${getValue(card, 'content.caption.en')} ${getValue(card, 'content.message.text.en', '-')}`
        );
        break;
      case 'mission':
        const conditions = card?.conditions
          ?.map(
            (condition) =>
              `-- Also if the card "${condition.target.en}" is in play, then ${condition.consequence.en}.`
          )
          .join('\n');
        const paragraphs = card?.content.paragraphs?.map((paragraph) => paragraph.en).join('\n');

        sentences.push(`${header} ${paragraphs} ${conditions ? `\n${conditions}` : ''}`);
        break;
      case 'voice':
        const speaker = card?.content.speaker?.en ? `${card.content.speaker.en}: ` : '';
        sentences.push(`${header} ${speaker}"${card.content.speech.en}" (${card?.content.text?.en})`);
        break;
      case 'text':
        sentences.push(`${header} ${card?.content.text?.en}`);
        break;
      case 'unordered-list':
        const list = card?.content.list?.map((item) => item.en).join(', ');
        sentences.push(`${header} ${list}`);
        break;
      default:
        // do nothing
        console.warn('Unknown card type', card.type);
    }
  });

  return sentences.join('\n');
}
