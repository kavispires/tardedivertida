import { sample } from 'lodash';
import { DiagramArea } from './types';

export const mockDiagramSelection = (hand: CardId[], diagrams: Dictionary<DiagramArea>) => {
  const selectedItem = sample(hand);

  const counts = Object.values(diagrams).reduce((acc: Dictionary<string[]>, diagram) => {
    const count = diagram.itemsIds.length;

    if (!acc[count]) {
      acc[count] = [diagram.key];
    } else {
      acc[count].push(diagram.key);
    }

    return acc;
  }, {});

  const max = Math.max(...Object.keys(counts).map(Number));

  const selectedDiagrams = counts[max];
  if (counts[max - 1]) {
    selectedDiagrams.push(...counts[max - 1]);
  }
  selectedDiagrams.push(...['O', 'O', 'O']);

  return { itemId: selectedItem ?? hand[0], position: sample(selectedDiagrams) ?? 'O' };
};
