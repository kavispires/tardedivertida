import { random, sample, sampleSize, shuffle } from 'lodash';
// Types
import type { GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Internal
import type { Concept, NewNameEntry, SubmitGuessesPayload } from './types';

export const mockConcept = (
  user: GamePlayer,
  concepts: Concept[],
  items: Dictionary<Item>,
  maxProposals: number,
  currentRound: number,
) => {
  const quantity = Math.max(Math.round(maxProposals / 1.5), 1);
  const newConcepts: Concept[] = [];
  let tries = 0;

  const usedConcept: BooleanDictionary = {};
  concepts.forEach((concept) => {
    usedConcept[concept.itemsIds.sort().join(',')] = true;
  });

  while (newConcepts.length < quantity && tries < 50) {
    const id = `c-${currentRound}-${user.id}-${Date.now()}-${tries}`;

    const itemsIds = shuffle(Object.keys(items)).slice(0, sample([2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5]) || 2);
    const itemsKey = itemsIds.sort().join(',');

    tries++;
    if (usedConcept[itemsKey]) {
      continue;
    }
    usedConcept[itemsKey] = true;

    newConcepts.push({
      id,
      key: '',
      soundId: '',
      syllable: { pt: '?', en: '?' },
      meaning: `Mock ${newConcepts.length + 1}`,
      itemsIds,
      playerId: user.id,
      age: currentRound,
      type: 'custom',
    });
  }

  return [...(user.proposedConcepts || []), ...newConcepts];
};

export const mockName = (basicConcepts: Concept[], concepts: Concept[], language: Language) => {
  const length = random(2, 3);

  const selectedConcepts = sampleSize(concepts, length).map((concept) => concept);

  // Add a prefix basic concept on each selected concept 20% of the time
  const syllables = selectedConcepts.flatMap((concept) => {
    if (Math.random() > 0.8) {
      return [sample(basicConcepts) || basicConcepts[0], concept];
    }
    return concept;
  });

  return {
    name: syllables.map((concept) => concept.syllable[language]).join(''),
    conceptsIds: selectedConcepts.map((concept) => concept.id),
  };
};

export const mockGuesses = (
  user: GamePlayer,
  pool: Item[],
  newNames: NewNameEntry[],
): SubmitGuessesPayload => {
  const guesses: Dictionary<string> = {};

  newNames.forEach((newName) => {
    if (newName.playerId === user.id) {
      return; // Skip guesses for the user's own new names
    }

    const options = [newName.itemId, newName.itemId, ...sampleSize(pool, 3).map((item) => item.id)];

    guesses[newName.playerId] = sample(options) || newName.itemId;
  });

  return { guesses };
};
