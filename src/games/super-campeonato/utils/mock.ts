import { getRandomItem } from 'utils/helpers';

export function mockSelectChallenge(challenges: DefaultTextCard[]): CardId {
  return getRandomItem(challenges).id;
}

export function mockSelectContender(contenders: WContender[]): CardId {
  return getRandomItem(contenders).id;
}
