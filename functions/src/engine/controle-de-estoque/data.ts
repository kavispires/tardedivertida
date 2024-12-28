// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import { GOODS_LIBRARY_COUNT } from './constants';
import utils from '../../utils';
import type { BossIdeaCard } from '../../types/tdr';

/**
 * Get data
 * @returns
 */
export const getData = async (): Promise<ResourceData> => {
  // Get full deck
  const allBossIdeas: Collection<BossIdeaCard> = await resourceUtils.fetchResource(
    TDR_RESOURCES.WAREHOUSE_BOSS_IDEAS,
  );

  const goodsIds = utils.game.makeArray(GOODS_LIBRARY_COUNT, 1).map((i) => `good-${i}`);

  return { allBossIdeas, goodsIds };
};
