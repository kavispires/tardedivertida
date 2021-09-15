import { useCallback, useEffect, useState } from 'react';
import { SEPARATOR } from '../utils/constants';

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
            return {
              ...prevVotes,
              [entryId]: activeItem,
            };
          });
        } else {
          setVotes((prevVotes) => {
            return {
              ...prevVotes,
              [activeItem]: entryId,
            };
          });
        }
        setActiveItem(null);
      }
    },
    [activeItem, leftSideType]
  );

  useEffect(() => {
    if (completeCount) {
      setIsVotingComplete(Object.keys(votes).length === completeCount);
    }
  }, [completeCount, votes]);

  return { votes, setVotes, activeItem, activateItem, isVotingComplete };
}
