import { mockClue } from 'mock/clues';
import { mockDrawing } from 'mock/drawing';
import { getRandomItem } from 'utils/helpers';

export function mockSeeding(seeds: SeedEntry[]) {
  const data: PlainObject = {};
  seeds.forEach((seed) => {
    switch (seed.type) {
      case 'arte-ruim':
        data[seed.card.id] = JSON.stringify(mockDrawing());
        break;
      case 'labirinto-secreto':
        const ids = getIds(seed.cards);
        data[seed.tree.id] = getRandomItem(ids);
        break;
      case 'onda-telepatica':
        data.wave = mockClue();
        break;
      case 'polemica-da-vez':
        data.likeTopic = getRandomItem([true, false]);
        break;
      case 'retrato-falado':
        data[seed.card.id] = JSON.stringify(mockDrawing());
        break;
      case 'ue-so-isso':
        data.singleClue = mockClue();
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
