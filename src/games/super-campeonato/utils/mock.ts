// Types
import type { Bet, Bracket, FightingContender } from './type';
import { TextCard } from 'types/tdr';
// Utils
import { DEFAULT_BETS, TIER_BY_STEP, voteTarget } from './constants';
import { deepCopy, getRandomItem } from 'utils/helpers';
import { getSmartBetContenderOptions } from './helpers';

export function mockSelectChallenge(challenges: TextCard[]): CardId {
  return getRandomItem(challenges).id;
}

export function mockSelectContender(contenders: FightingContender[]): CardId {
  return getRandomItem(contenders).id;
}

export function mockBets(brackets: Bracket[]) {
  const bets: Bet = deepCopy(DEFAULT_BETS);

  for (let i = 0; i <= 2; i++) {
    const tier = TIER_BY_STEP[i];
    const options = getSmartBetContenderOptions(brackets, tier, bets, 'en');
    if (tier !== 'winner') {
      bets[tier] = getRandomItem(options).id;
    }
  }

  return bets;
}

export function mockVotes(bracketedContenders: Bracket[][], bets: Bet) {
  const betsList = Object.values(bets);
  return bracketedContenders.reduce((acc: NumberDictionary, pair) => {
    let vote = pair.find((entry) => betsList.includes(entry.id));
    if (!vote) {
      vote = getRandomItem(pair);
    }

    acc[voteTarget[vote.position]] = vote.position;
    return acc;
  }, {});
}
