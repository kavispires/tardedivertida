import { useState } from 'react';
import { targetByTier, voteTarget } from './constants';

export function useBracketVoting(tier: WBracketTier) {
  const [votes, setVotes] = useState<NumberDictionary>({});

  function updateVote(vote: WBracket) {
    setVotes((v) => ({ ...v, [voteTarget[vote.position]]: vote.position }));
  }

  function checkActiveVote(position: number) {
    return Object.values(votes).includes(position);
  }

  return {
    votes,
    updateVote,
    isComplete: Object.keys(votes).length === targetByTier[tier],
    checkActiveVote,
  };
}
