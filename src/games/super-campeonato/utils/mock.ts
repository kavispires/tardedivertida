import { cloneDeep, sampleSize } from 'lodash';
// Types
import type { TextCardData } from 'types/tdr';
// Utils
import { getRandomItem } from '@utils/helpers';
// Internal
import type { Bet, Bracket, FightingContender } from './type';
import { DEFAULT_BETS, TIER_BY_STEP, voteTarget } from './constants';
import { getSmartBetContenderOptions } from './helpers';

export function mockSelectChallenge(challenges: TextCardData[]): UID {
  return getRandomItem(challenges).id;
}

export function mockSelectContenders(
  contenders: FightingContender[],
  contendersPerPlayerNeeded: number,
): UID[] {
  return sampleSize(contenders, contendersPerPlayerNeeded).map((c) => c.id);
}

export function mockBets(brackets: Bracket[]) {
  const bets: Bet = cloneDeep(DEFAULT_BETS);

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
  return bracketedContenders.reduce((acc: Dictionary<number>, pair) => {
    let vote = pair.find((entry) => betsList.includes(entry.id));
    if (!vote) {
      vote = getRandomItem(pair);
    }

    acc[voteTarget[vote.position]] = vote.position;
    return acc;
  }, {});
}
