import { useCallback, useEffect, useState } from 'react';
import { SEPARATOR } from '../utils/constants';

/**
 * Delete duplicated votes on the 'value' side of the votes object
 * @param votes
 * @param target
 */
const deleteDuplicate = (votes: PlainObject, target: string) => {
  const votesArray = Object.entries(votes);
  const duplicateIndex = votesArray.findIndex((el) => el[1] === target);
  if (duplicateIndex > -1) {
    const duplicateKey = votesArray[duplicateIndex][0];
    delete votes[duplicateKey];
  }
};

type Votes = {
  [key: string]: string;
};

/**
 * Keeps track of an object with votes following the schema:
 * {<typeSEPARATORid...>: <typeSEPARATORid...>
 * @param keyType the type of the entry that will work as the key of the voting object
 * @param uniqueOnly Indicates if it is allow to voting duplicates
 * @param completeCount
 * @returns
 */
export function useVotingMatch(
  keyType: string,
  allowDuplicates: boolean = true,
  completeCount?: number,
  initialState: Votes = {}
): {
  votes: Votes;
  setVotes: React.Dispatch<any>;
  activeItem: string;
  activateItem: (entryId: string) => void;
  isVotingComplete: boolean;
  resetVoting: (newInitialState: Votes) => void;
} {
  const [votes, setVotes]: [Votes, React.Dispatch<any>] = useState({ ...initialState });
  const [activeItem, setActiveItem]: [string, React.Dispatch<any>] = useState('');
  const [isVotingComplete, setIsVotingComplete]: [boolean, React.Dispatch<any>] = useState(false);

  const activateItem = useCallback(
    (entryId: string) => {
      // When new Item is already the active item, deselect it
      if (entryId === activeItem) {
        return setActiveItem('');
      }

      const [type] = entryId.split(SEPARATOR);

      // When no active item or type of new item is the same as active item, set it
      if (!activeItem || activeItem.startsWith(type)) {
        return setActiveItem(entryId);
      }

      // When new item type is a key
      if (type === keyType) {
        setVotes((prevVotes: Votes) => {
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
        return setActiveItem('');
      }

      // When new item is a value
      setVotes((prevVotes: Votes) => {
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

      return setActiveItem('');
    },
    [activeItem, keyType, allowDuplicates]
  );

  const resetVoting = (newInitialState: Votes) => {
    setVotes(newInitialState ?? initialState);
    setActiveItem('');
  };

  useEffect(() => {
    if (completeCount) {
      setIsVotingComplete(Object.keys(votes).length === completeCount);
    }
  }, [completeCount, votes]);

  return { votes, setVotes, activeItem, activateItem, isVotingComplete, resetVoting };
}
