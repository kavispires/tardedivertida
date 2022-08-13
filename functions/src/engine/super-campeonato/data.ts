// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Helpers
import * as resourceUtils from '../resource';
import { ResourceData } from './types';

/**
 * Get challenges and contenders  based on the game's language
 * @param language
 * @returns
 */
export const getResourceData = async (language: string): Promise<ResourceData> => {
  const challengesResourceName = `${TDR_RESOURCES.CHALLENGES}-${language}`;

  const challengesResponse = await resourceUtils.fetchResource(challengesResourceName);

  const contendersResponse: Record<CardId, ContenderCard> = await resourceUtils.fetchResource(
    TDR_RESOURCES.CONTENDERS
  );

  const availableContenders = Object.values(contendersResponse).filter(
    (c) => !c.exclusivity || c.exclusivity === language
  );

  return {
    challenges: Object.values(challengesResponse),
    contenders: availableContenders,
  };
};
