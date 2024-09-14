// Utils
import { SEPARATOR } from 'utils/constants';

export function prepareVotes(votes: StringDictionary) {
  return Object.entries(votes).reduce((acc: StringDictionary, [drawingEntryId, cardEntryId]) => {
    const [, drawingId] = drawingEntryId.split(SEPARATOR);
    const [, cardId] = cardEntryId.split(SEPARATOR);
    acc[drawingId] = cardId;
    return acc;
  }, {});
}
