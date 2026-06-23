// Types
import type { TextCardData } from 'types/tdr';

export const getTitle = (
  cards: Dictionary<TextCardData>,
  subjectId: string,
  descriptorId: string,
  language: Language,
) => {
  if (language === 'en') {
    return `${cards[descriptorId].text} ${cards[subjectId].text}`;
  }

  return `${cards[subjectId].text} ${cards[descriptorId].text}`;
};
