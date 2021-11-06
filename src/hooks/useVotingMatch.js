import { useCallback, useEffect, useState } from 'react';
import { SEPARATOR } from '../utils/constants';

const deleteDuplicate = (votes, target) => {
  const votesArray = Object.entries(votes);
  const duplicateIndex = votesArray.findIndex((el) => el[1] === target);
  if (duplicateIndex > -1) {
    const duplicateKey = votesArray[duplicateIndex][0];
    delete votes[duplicateKey];
  }
};

/**
 * Keeps track of an object with votes following the schema:
 * {<typeSEPARATORid...>: <typeSEPARATORid...>
 * @param {string} keyType the type of the entry that will work as the key of the voting object
 * @param {boolean} uniqueOnly Indicates if it is allow to voting duplicates
 * @param {number} completeCount
 * @returns
 */
export function useVotingMatch(keyType, allowDuplicates = true, completeCount = null) {
  const [votes, setVotes] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [isVotingComplete, setIsVotingComplete] = useState(false);

  const activateItem = useCallback(
    (entryId) => {
      // When new Item is already the active item, deselect it
      if (entryId === activeItem) {
        return setActiveItem(null);
      }

      const [type] = entryId.split(SEPARATOR);

      // When no active item or type of new item is the same as active item, set it
      if (!activeItem || activeItem.startsWith(type)) {
        return setActiveItem(entryId);
      }

      // When new item type is a key
      if (type === keyType) {
        setVotes((prevVotes) => {
          const copy = { ...prevVotes };
          // Find and clear any previous vote if uniqueOnly
          if (!allowDuplicates) {
            deleteDuplicate(copy, activeItem);
          }

          return {
            ...copy,
            [entryId]: activeItem,
          };
        });
        return setActiveItem(null);
      }

      // When new item is a value
      setVotes((prevVotes) => {
        const copy = { ...prevVotes };
        // Find and clear any previous vote if uniqueOnly
        if (!allowDuplicates) {
          deleteDuplicate(copy, entryId);
        }

        return {
          ...copy,
          [activeItem]: entryId,
        };
      });

      return setActiveItem(null);
    },
    [activeItem, keyType, allowDuplicates]
  );

  useEffect(() => {
    if (completeCount) {
      setIsVotingComplete(Object.keys(votes).length === completeCount);
    }
  }, [completeCount, votes]);

  return { votes, setVotes, activeItem, activateItem, isVotingComplete };
}
