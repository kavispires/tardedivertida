import { mockClue } from 'mock/clues';
import { mockDrawing } from 'mock/drawing';
// Utils
import { getRandomItem } from 'utils/helpers';
// Internal
import type { SeedEntry } from './types';

export function mockSeeding(seeds: SeedEntry[]) {
  const data: PlainObject = {};
  seeds.forEach((seed) => {
    switch (seed.type) {
      case 'arte-ruim':
        data[seed.card.id] = JSON.stringify(mockDrawing());
        break;
      case 'contadores-historias':
        data.prompt = getRandomItem(seed.prompts);
        break;
      case 'labirinto-secreto':
        data[seed.tree.id] = getRandomItem(getIds(seed.cards));
        break;
      case 'mente-coletiva':
        data.answers = [mockClue(), mockClue('low')];
        break;
      case 'onda-telepatica':
        data.wave = mockClue();
        break;
      case 'polemica-da-vez':
        data.likeTweet = getRandomItem([true, false]);
        break;
      case 'retrato-falado':
        data[seed.card.id] = JSON.stringify(mockDrawing());
        break;
      case 'ue-so-isso':
        data.singleClue = mockClue('high');
        break;
      case 'party':
        data.partyAnswers = seed.cards.reduce((acc: StringDictionary, card) => {
          acc[card.id] = mockClue('high');
          return acc;
        }, {});
        break;
      case 'clubber':
        data.clubberId = seed.outfits[0];
        break;
      default:
        return {};
    }
  });

  return data;
}

export function mockSelection(options: unknown[], propertyName?: string) {
  const random = getRandomItem(options) as PlainObject;
  return propertyName ? random[propertyName] : random;
}

export function mockText() {
  return getRandomItem(['bola', 'bolas', 'prata', 'prato', 'pirulito', 'domingo']);
}

export function getIds(list: PlainObject[]) {
  return list.map((entry) => entry.id);
}
