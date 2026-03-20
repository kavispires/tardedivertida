// Types
import type { GamePlayer } from 'types/game';
// Utils
import { LETTERS, SEPARATOR } from 'utils/constants';
import { getEntryId, shuffle } from 'utils/helpers';
// Internal
import type { Dream } from './types';

export const getClueId = (votes: Dictionary<string>, cardEntryId: string): string[] => {
  return Object.keys(votes).filter((key) => votes[key] === cardEntryId);
};

export const cleanupVotes = (votes: Dictionary<string>, user: GamePlayer): Dictionary<string> => {
  return Object.entries(votes).reduce((acc: Dictionary<string>, [dreamEntryKey, cardEntryKey]) => {
    const playerId = dreamEntryKey.split(SEPARATOR)[1];
    const cardId = cardEntryKey.split(SEPARATOR)[1];

    if (playerId !== user.id) {
      acc[playerId] = cardId;
    }

    return acc;
  }, {});
};

export const selectOwnVote = (dreams: Dream[], user: GamePlayer) =>
  dreams.reduce((acc: Dictionary<string>, entry, index) => {
    if (entry.id === user.id) {
      const clueEntryId = getEntryId(['dream', entry.id, LETTERS[index]]);
      const cardEntryId = getEntryId(['card', user.dreamId]);
      acc[clueEntryId] = cardEntryId;
    }
    return acc;
  }, {});

export const voteRandomly = (votes: Dictionary<string>, dreams: Dream[], table: UID[]) => {
  const randomVotes = dreams.reduce((acc: Dictionary<string>, entry, index) => {
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
