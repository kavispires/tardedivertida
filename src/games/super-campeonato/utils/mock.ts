import { getRandomItem, shuffle } from 'utils/helpers';
import { voteTarget } from './constants';

export function mockSelectChallenge(challenges: DefaultTextCard[]): CardId {
  return getRandomItem(challenges).id;
}

export function mockSelectContender(contenders: WContender[]): CardId {
  return getRandomItem(contenders).id;
}

export function mockBets(brackets: WBracket[]) {
  const contenders = shuffle(
    brackets.filter((entry) => entry.tier === 'quarter').map((entry) => ({ id: entry.id, name: entry.name }))
  );

  return {
    quarter: contenders[0].id,
    semi: contenders[1].id,
    final: contenders[2].id,
  };
}

export function mockVotes(bracketedContenders: WBracket[][]) {
  return bracketedContenders.reduce((acc: NumberDictionary, pair) => {
    const vote = getRandomItem(pair);
    acc[voteTarget[vote.position]] = vote.position;
    return acc;
  }, {});
}
