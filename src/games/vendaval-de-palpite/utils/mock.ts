import { shuffle } from 'utils/helpers';

const suggestedWords = [
  'tall',
  'round',
  'alive',
  'furry',
  'big',
  'red',
  'lives in water',
  'related to death',
  'can be touched',
  'edible',
  'long',
  'do I have it?',
  'harmful',
  'virtual',
  'yellow',
  'can I put in my mouth?',
  'is it legal?',
];

export function mockClues(quantity: number): string[] {
  const randomWords = shuffle(suggestedWords);

  return randomWords.slice(0, quantity);
}
