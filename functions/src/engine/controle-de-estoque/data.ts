// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
import type { BossIdeaCard } from '../../types/tdr';
// Utils
import * as resourceUtils from '../resource';
import { GOODS_LIBRARY_COUNT } from './constants';
import utils from '../../utils';

/**
 * Get data
 * @returns
 */
export const getData = async (): Promise<ResourceData> => {
  // Get full deck
  const allBossIdeas = await resourceUtils.fetchResource<Dictionary<BossIdeaCard>>(
    TDR_RESOURCES.WAREHOUSE_BOSS_IDEAS,
  );

  const goodsIds = utils.game.makeArray(GOODS_LIBRARY_COUNT, 1).map((i) => `good-${i}`);

  return { allBossIdeas, goodsIds };
};
