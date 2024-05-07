import { DailyPalavreadoEntry } from './types';

const defaultValue: Pick<DailyPalavreadoEntry, 'id' | 'number' | 'language' | 'type'> = {
  id: '',
  number: 0,
  type: 'palavreado',
  language: 'pt',
};

export const SAMPLE: DailyPalavreadoEntry[] = [
  {
    ...defaultValue,

    letters: ['m', 'l', 'o', 'o', 'c', 'i', 'v', 'a', 'd', 'g', 'r', 'e', 'f', 'u', 'o', 'a'],
    words: ['mudo', 'vice', 'foro', 'alga'],
    keyword: 'mira',
  },
  {
    ...defaultValue,

    letters: ['p', 'l', 'ê', 'u', 'g', 'o', 'g', 'n', 'a', 't', 'r', 'ú', 'j', 'i', 'ó', 'o'],
    words: ['patê', 'gogó', 'júri', 'nulo'],
    keyword: 'poro',
  },
  {
    ...defaultValue,

    letters: ['c', 'f', 'á', 'o', 'a', 'a', 'e', 'u', 'n', 'v', 'b', 'z', 'h', 'l', 'i', 'o'],
    words: ['cine', 'vaza', 'fubá', 'olho'],
    keyword: 'cabo',
  },
  {
    ...defaultValue,

    letters: ['n', 'o', 'ã', 'c', 'd', 'a', 'b', 'o', 'u', 'f', 'v', 'l', 'i', 'a', 'j', 'e'],
    words: ['nojo', 'faca', 'divã', 'bule'],
    keyword: 'nave',
  },
  {
    ...defaultValue,

    letters: ['f', 'a', 'é', 'p', 'i', 'o', 'n', 'ê', 'b', 'a', 'f', 'b', 'u', 'v', 'c', 'o'],
    words: ['fava', 'boné', 'bufê', 'pico'],
    keyword: 'fofo',
  },
  {
    ...defaultValue,

    letters: ['u', 'e', 'l', 'a', 'r', 'n', 'd', 's', 'e', 'r', 'i', 'g', 'c', 'o', 'á', 'r'],
    words: ['usar', 'onde', 'ágil', 'crer'],
    keyword: 'unir',
  },
  {
    ...defaultValue,

    letters: ['s', 'x', 'e', 'c', 'y', 'a', 'f', 'u', 'v', 'b', 'i', 'm', 'ç', 'r', 'a', 'a'],
    words: ['sexy', 'vaca', 'brim', 'fuça'],
    keyword: 'saia',
  },
  {
    ...defaultValue,

    letters: ['m', 'a', 's', 'u', 'a', 'o', 'i', 'n', 'l', 'g', 'e', 'g', 'p', 'ó', 'a', 'r'],
    words: ['mais', 'gogó', 'pneu', 'alar'],
    keyword: 'moer',
  },
  {
    ...defaultValue,

    letters: ['a', 's', 'r', 't', 'x', 'q', 'u', 'a', 'o', 'á', 'u', 'e', 'm', 'd', 'i', 'i'],
    words: ['amor', 'aqui', 'deus', 'táxi'],
    keyword: 'aqui',
  },
  {
    ...defaultValue,

    letters: ['a', 's', 'r', 't', 'x', 'q', 'u', 'a', 'o', 'á', 'u', 'e', 'm', 'd', 'i', 'i'],
    words: ['amor', 'aqui', 'deus', 'táxi'],
    keyword: 'aqui',
  },
  {
    ...defaultValue,
    letters: ['x', 's', 'o', 'á', 'a', 'u', 'i', 'ó', 'g', 'l', 'x', 'm', 't', 'd', 'ô', 'a'],
    words: ['xodó', 'sumô', 'táxi', 'alga'],
    keyword: 'xuxa',
  },
];
