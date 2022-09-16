import { deepCopy, getRandomItem } from 'utils/helpers';
import { DEFAULT_BETS, TIER_BY_STEP, voteTarget } from './constants';
import { getSmartBetContenderOptions } from './helpers';

export function mockSelectChallenge(challenges: DefaultTextCard[]): CardId {
  return getRandomItem(challenges).id;
}

export function mockSelectContender(contenders: WContender[]): CardId {
  return getRandomItem(contenders).id;
}

export function mockBets(brackets: WBracket[]) {
  const bets: WBets = deepCopy(DEFAULT_BETS);

  for (let i = 0; i <= 2; i++) {
    const tier = TIER_BY_STEP[i];
    const options = getSmartBetContenderOptions(brackets, tier, bets, 'en');
    if (tier !== 'winner') {
      bets[tier] = getRandomItem(options).id;
    }
  }

  return bets;
}

export function mockVotes(bracketedContenders: WBracket[][], bets: WBets) {
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
