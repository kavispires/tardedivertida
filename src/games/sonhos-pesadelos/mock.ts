import { shuffle } from 'utils/helpers';

const mockedDreamClues = [
  'água',
  'bola',
  'calderão do huck',
  'dedo',
  'esmalte',
  'fatídico',
  'ganhar',
  'hereditário',
  'simpático',
  'abismo',
  'rola',
  'a branca de neve',
  'oops i did it again',
  'pesquisa',
  'saborosa',
  'amargo',
];

export const mockDream = (): string => shuffle(mockedDreamClues)[0];

export const mockVotes = (dreams: SDream[], table: ImageCard[], user: GamePlayer): StringDictionary => {
  const playersIds = shuffle(dreams.map((dream) => dream.id).filter((playerId) => playerId !== user.id));
  const shuffledTable = shuffle(table);

  return playersIds.reduce((acc: StringDictionary, playerId, index) => {
    acc[playerId] = shuffledTable[index];
    return acc;
  }, {});
};
