// Utils
import { SEPARATOR } from '@utils/constants';

export function prepareVotes(votes: Dictionary<string>) {
  return Object.entries(votes).reduce((acc: Dictionary<string>, [drawingEntryId, cardEntryId]) => {
    const [, drawingId] = drawingEntryId.split(SEPARATOR);
    const [, cardId] = cardEntryId.split(SEPARATOR);
    acc[drawingId] = cardId;
    return acc;
  }, {});
}
