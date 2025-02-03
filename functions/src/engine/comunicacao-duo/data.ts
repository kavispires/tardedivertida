import type { ComunicacaoDuoOptions, ResourceData } from './types';
import utils from '../../utils';
import * as resourceUtils from '../resource';
import { TOTAL_ITEMS } from './constants';
import { applyDataToDeck } from './helpers';
import { TDR_RESOURCES } from '../../utils/constants';
import type { SuspectCard } from '../../types/tdr';
import { orderBy } from 'lodash';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getDeck = async (language: Language, options: ComunicacaoDuoOptions): Promise<ResourceData> => {
  const allowNSFW = !!options?.nsfw;
  const deckType = options?.deckType ?? 'items';

  if (deckType === 'items') {
    const items = await utils.tdr.getItems(TOTAL_ITEMS, {
      allowNSFW,
      decks: ['alien'],
    });

    return { deck: applyDataToDeck(items, 'items') };
  }

  if (deckType === 'images') {
    const images = await utils.imageCards.getImageCards(TOTAL_ITEMS);
    return { deck: applyDataToDeck(images, 'images') };
  }

  if (deckType === 'words') {
    const words = await utils.tdr.getSingleWords(language, TOTAL_ITEMS);
    return { deck: applyDataToDeck(words, 'words') };
  }

  if (deckType === 'contenders') {
    const contenders = await utils.tdr.getContenders(language, allowNSFW, ['any'], TOTAL_ITEMS);
    return { deck: applyDataToDeck(contenders, 'contenders') };
  }

  if (deckType === 'suspects') {
    const allSuspects = await resourceUtils.fetchResource<Dictionary<SuspectCard>>(TDR_RESOURCES.SUSPECTS);
    const suspects = orderBy(
      utils.imageCards.modifySuspectIdsByOptions(Object.values(allSuspects)),
      [`name.${language}`],
      ['asc'],
    );
    return { deck: applyDataToDeck(suspects, 'suspects') };
  }

  return { deck: [] };
};
