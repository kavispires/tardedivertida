// Types
import type { TextCard } from 'types/tdr';

export const getTitle = (
  cards: Dictionary<TextCard>,
  subjectId: string,
  descriptorId: string,
  language: Language,
) => {
  if (language === 'en') {
    return `${cards[descriptorId].text} ${cards[subjectId].text}`;
  }

  return `${cards[subjectId].text} ${cards[descriptorId].text}`;
};
