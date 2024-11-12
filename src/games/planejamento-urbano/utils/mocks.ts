import { shuffle } from 'lodash';
// Utils
import { LETTERS } from 'utils/constants';

export function mockAction(placements: number, availableProjectsIds: string[]) {
  const siteIds = shuffle(Array.from({ length: placements }, (_, index) => LETTERS[index]));

  return availableProjectsIds.reduce((acc: Record<string, string>, siteId, index) => {
    acc[siteId] = siteIds[index];
    return acc;
  }, {});
}
