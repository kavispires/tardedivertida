import { uniq } from 'lodash';
import { SUGGESTED_COLORS, SUGGESTED_MOODS } from './constants';
import { FirebaseImageCardLibrary, ImageCardData } from './types';

export const hasCardAchievedMinimumRequirements = (card: ImageCardData) => {
  return card.colors.length > 0 && card.mood.length > 0 && card.focus.length > 0;
};

export const buildDictionaries = (data: FirebaseImageCardLibrary) => {
  const colorsDict: string[] = SUGGESTED_COLORS;
  const moodDict: string[] = SUGGESTED_MOODS;
  const elementsDict: string[] = [];
  const actionsDict: string[] = [];

  Object.values(data).forEach((card) => {
    elementsDict.push(...(card?.focus ?? []));
    colorsDict.push(...(card?.colors ?? []));
    moodDict.push(...(card?.mood ?? []));
    elementsDict.push(...(card.elements ?? []));
    actionsDict.push(...(card?.actions ?? []));
  });

  return {
    colors: uniq(colorsDict)
      .map((v) => ({ value: v, label: v }))
      .sort(),
    mood: uniq(moodDict)
      .map((v) => ({ value: v, label: v }))
      .sort(),
    elements: uniq(elementsDict)
      .map((v) => ({ value: v, label: v }))
      .sort(),
    actions: uniq(actionsDict)
      .map((v) => ({ value: v, label: v }))
      .sort(),
  };
};
