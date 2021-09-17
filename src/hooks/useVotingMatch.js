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
 * Keeps track of an object with votes follwing the schema:
 * {<typeSEPARATORid...>: <typeSEPARATORid...>
 * @param {string} leftSideType the type of the entry that will work as the key of the voting object
 * @param {boolean} uniqueOnly Indicates if it is allow to voting duplicates
 * @param {number} completeCount
 * @returns
 */
export function useVotingMatch(leftSideType, uniqueOnly = false, completeCount = null) {
  const [votes, setVotes] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [isVotingComplete, setIsVotingComplete] = useState(false);

  const activateItem = useCallback(
    (entryId) => {
      if (entryId === activeItem) {
        return setActiveItem(null);
      }

      const [type] = entryId.split(SEPARATOR);
      if (!activeItem || activeItem.startsWith(type)) {
        setActiveItem(entryId);
      } else {
        if (type === leftSideType) {
          setVotes((prevVotes) => {
            const copy = { ...prevVotes };
            // Find and clear any previous vote if uniqueOnly
            if (uniqueOnly) {
              deleteDuplicate(copy, activeItem);
            }

            return {
              ...copy,
              [entryId]: activeItem,
            };
          });
        } else {
          setVotes((prevVotes) => {
            const copy = { ...prevVotes };
            // Find and clear any previous vote if uniqueOnly
            if (uniqueOnly) {
              deleteDuplicate(copy, entryId);
            }

            return {
              ...prevVotes,
              [activeItem]: entryId,
            };
          });
        }
        setActiveItem(null);
      }
    },
    [activeItem, leftSideType, uniqueOnly]
  );

  useEffect(() => {
    if (completeCount) {
      setIsVotingComplete(Object.keys(votes).length === completeCount);
    }
  }, [completeCount, votes]);

  return { votes, setVotes, activeItem, activateItem, isVotingComplete };
}
