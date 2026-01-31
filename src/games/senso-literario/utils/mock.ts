// Internal
import { COLORS, GENRES, LETTERS } from './constants';

export function mockBookPattern(sequence: string[]): string {
  // Parse the sequence to extract attributes
  const cards = sequence.map((card) => {
    const [color, genre, letter] = card.split('-');
    return { color, genre, letter };
  });

  // Get attribute order from constants
  const colorOrder = COLORS.map((c) => c.key);
  const genreOrder = GENRES.map((g) => g.key);
  const letterOrder = [...LETTERS];

  // Find the second most common value for each attribute (or first if only one unique value exists)
  const getSecondMostCommon = (attr: 'color' | 'genre' | 'letter', order: string[]): string => {
    const counts: Record<string, number> = {};
    cards.forEach((card) => {
      const value = card[attr];
      // Exclude wildcard values
      if (value && value !== 'wildcard') {
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    // Sort by count (descending), then by order in the original array for ties
    const sorted = Object.entries(counts).sort(([keyA, countA], [keyB, countB]) => {
      if (countB !== countA) return countB - countA;
      return order.indexOf(keyA) - order.indexOf(keyB);
    });

    // Return second most common, or first if only one unique value
    return sorted.length > 1 ? sorted[1][0] : sorted[0][0];
  };

  const baseColor = getSecondMostCommon('color', colorOrder);
  const baseGenre = getSecondMostCommon('genre', genreOrder);
  const baseLetter = getSecondMostCommon('letter', letterOrder);

  // 30% chance of variation for each attribute
  const shouldVary = () => Math.random() < 0.3;

  const getRandomDifferent = (current: string, options: string[]): string => {
    const differentValues = options.filter((v) => v !== current);
    if (differentValues.length === 0) return current;
    return differentValues[Math.floor(Math.random() * differentValues.length)];
  };

  const finalColor = shouldVary() ? getRandomDifferent(baseColor, colorOrder) : baseColor;
  const finalGenre = shouldVary() ? getRandomDifferent(baseGenre, genreOrder) : baseGenre;
  const finalLetter = shouldVary() ? getRandomDifferent(baseLetter, letterOrder) : baseLetter;

  return `${finalColor}-${finalGenre}-${finalLetter}`;
}
