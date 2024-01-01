import { useState } from 'react';
// Types
import type { Bracket, BracketTier } from './type';
// Utils
import { targetByTier, voteTarget } from './constants';

export function useBracketVoting(tier: BracketTier) {
  const [votes, setVotes] = useState<NumberDictionary>({});

  function updateVote(vote: Bracket) {
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
