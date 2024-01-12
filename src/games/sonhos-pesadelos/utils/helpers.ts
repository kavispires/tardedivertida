// Types
import type { GamePlayer } from 'types/player';
import type { Dream } from './types';
// Utils
import { LETTERS, SEPARATOR } from 'utils/constants';
import { getEntryId, shuffle } from 'utils/helpers';

export const getClueId = (votes: StringDictionary, cardEntryId: string): string[] => {
  return Object.keys(votes).filter((key) => votes[key] === cardEntryId);
};

export const cleanupVotes = (votes: StringDictionary, user: GamePlayer): StringDictionary => {
  return Object.entries(votes).reduce((acc: StringDictionary, [dreamEntryKey, cardEntryKey]) => {
    const playerId = dreamEntryKey.split(SEPARATOR)[1];
    const cardId = cardEntryKey.split(SEPARATOR)[1];

    if (playerId !== user.id) {
      acc[playerId] = cardId;
    }

    return acc;
  }, {});
};

export const selectOwnVote = (dreams: Dream[], user: GamePlayer) =>
  dreams.reduce((acc: StringDictionary, entry, index) => {
    if (entry.id === user.id) {
      const clueEntryId = getEntryId(['dream', entry.id, LETTERS[index]]);
      const cardEntryId = getEntryId(['card', user.dreamId]);
      acc[clueEntryId] = cardEntryId;
    }
    return acc;
  }, {});

export const voteRandomly = (votes: StringDictionary, dreams: Dream[], table: ImageCard[]) => {
  const randomVotes = dreams.reduce((acc: StringDictionary, entry, index) => {
    const randomTable = shuffle(table);
    const clueEntryId = getEntryId(['dream', entry.id, LETTERS[index]]);
    const cardEntryId = getEntryId(['card', randomTable[0]]);
    acc[clueEntryId] = cardEntryId;

    return acc;
  }, {});

  return {
    ...randomVotes,
    ...votes,
  };
};
