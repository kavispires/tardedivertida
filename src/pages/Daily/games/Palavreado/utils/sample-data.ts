// Internal
import { DailyPalavreadoEntry } from './types';

const defaultValue: Pick<DailyPalavreadoEntry, 'id' | 'number' | 'language' | 'type'> = {
  id: '2023/10/31',
  number: 0,
  type: 'palavreado',
  language: 'pt',
};

export const SAMPLE: DailyPalavreadoEntry[] = (() => {
  return [
    {
      letters: ['m', 'l', 'o', 'o', 'c', 'i', 'v', 'a', 'd', 'g', 'r', 'e', 'f', 'u', 'o', 'a'],
      words: ['mudo', 'vice', 'foro', 'alga'],
      keyword: 'mira',
    },
    {
      letters: ['p', 'l', 'ê', 'u', 'g', 'o', 'g', 'n', 'a', 't', 'r', 'ú', 'j', 'i', 'ó', 'o'],
      words: ['patê', 'gogó', 'júri', 'nulo'],
      keyword: 'poro',
    },
    {
      letters: ['c', 'f', 'á', 'o', 'a', 'a', 'e', 'u', 'n', 'v', 'b', 'z', 'h', 'l', 'i', 'o'],
      words: ['cine', 'vaza', 'fubá', 'olho'],
      keyword: 'cabo',
    },
    {
      letters: ['n', 'o', 'ã', 'c', 'd', 'a', 'b', 'o', 'u', 'f', 'v', 'l', 'i', 'a', 'j', 'e'],
      words: ['nojo', 'faca', 'divã', 'bule'],
      keyword: 'nave',
    },
    {
      letters: ['f', 'a', 'é', 'p', 'i', 'o', 'n', 'ê', 'b', 'a', 'f', 'b', 'u', 'v', 'c', 'o'],
      words: ['fava', 'boné', 'bufê', 'pico'],
      keyword: 'fofo',
    },
    {
      letters: ['u', 'e', 'l', 'a', 'r', 'n', 'd', 's', 'e', 'r', 'i', 'g', 'c', 'o', 'á', 'r'],
      words: ['usar', 'onde', 'ágil', 'crer'],
      keyword: 'unir',
    },
    {
      letters: ['s', 'x', 'e', 'c', 'y', 'a', 'f', 'u', 'v', 'b', 'i', 'm', 'ç', 'r', 'a', 'a'],
      words: ['sexy', 'vaca', 'brim', 'fuça'],
      keyword: 'saia',
    },
    {
      letters: ['m', 'a', 's', 'u', 'a', 'o', 'i', 'n', 'l', 'g', 'e', 'g', 'p', 'ó', 'a', 'r'],
      words: ['mais', 'gogó', 'pneu', 'alar'],
      keyword: 'moer',
    },
    {
      letters: ['a', 's', 'r', 't', 'x', 'q', 'u', 'a', 'o', 'á', 'u', 'e', 'm', 'd', 'i', 'i'],
      words: ['amor', 'aqui', 'deus', 'táxi'],
      keyword: 'aqui',
    },
    {
      letters: ['x', 's', 'o', 'á', 'a', 'u', 'i', 'ó', 'g', 'l', 'x', 'm', 't', 'd', 'ô', 'a'],
      words: ['xodó', 'sumô', 'táxi', 'alga'],
      keyword: 'xuxa',
    },
    {
      letters: ['z', 'g', 'i', 's', 't', 'e', 'ê', 'o', 'v', 'a', 'b', 'a', 'p', 'l', 'o', 'u'],
      words: ['zaga', 'tevê', 'lobo', 'psiu'],
      keyword: 'zebu',
    },
    {
      letters: ['b', 'v', 'c', 'd', 'r', 'o', 'e', 'l', 't', 'a', 'f', 'a', 'u', 'ê', 'a', 'e'],
      words: ['bata', 'você', 'lufa', 'rede'],
      keyword: 'bofe',
    },
    {
      letters: ['a', 'a', 'o', 'z', 'i', 'm', 'a', 'l', 'o', 's', 'é', 'f', 'a', 'r', 'v', 'm'],
      words: ['alfa', 'amar', 'viés', 'zoom'],
      keyword: 'amém',
    },
    {
      letters: ['p', 't', 'a', 'j', 'o', 'e', 'i', 'e', 'z', 'u', 'l', 'b', 's', 'u', 'c', 'o'],
      words: ['pica', 'sete', 'zulu', 'bojo'],
      keyword: 'pelo',
    },
    {
      letters: ['d', 'a', 'a', 'c', 'o', 'o', 'v', 'p', 'l', 's', 'z', 'i', 'e', 'm', 'a', 'e'],
      words: ['dias', 'como', 'vaza', 'pele'],
      keyword: 'doze',
    },
  ].map((data) => ({ ...data, ...defaultValue }));
})();
