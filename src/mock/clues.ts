import { getRandomItem } from 'utils/helpers';

const lowClues = ['agua', 'bola', 'coco', 'dedo'];
const clues = ['agua', 'bola', 'coco', 'dedo', 'egua', 'flauta', 'gatilho', 'hélio', 'jaguar'];
const highClues = [
  'agua',
  'bola',
  'coco',
  'dedo',
  'egua',
  'flauta',
  'gatilho',
  'hélio',
  'jaguar',
  'ketchup',
  'lagoa',
  'manga',
  'ninja',
  'olho',
  'pato',
  'queijo',
  'raio',
  'sapo',
  'tigre',
  'urso',
  'vaca',
  'xarope',
  'zangado',
  'abacaxi',
  'banana',
  'cachorro',
  'dado',
  'elefante',
  'faca',
  'gato',
  'helicoptero',
  'igreja',
  'janela',
  'kiwi',
];

export const mockClue = (variety: 'low' | 'default' | 'high' = 'default'): string => {
  const bank = {
    low: lowClues,
    default: clues,
    high: highClues,
  }[variety];

  return getRandomItem(bank);
};
