// Utils
import { getRandomItem } from 'utils/helpers';

// 1-2 words
const shortSentences = ['Bom dia', 'Vamos lá', 'Até logo', 'Tudo bem?', 'Não sei', 'Belo trabalho'];

// 3-5 words
const defaultSentences = [
  'O dia está lindo',
  'Gosto muito de café',
  'Vamos ao parque hoje?',
  'A água está fria',
  'Preciso de férias logo',
  'O gato dormiu cedo',
];

// 5-8 words
const longSentences = [
  'O cachorro correu atrás da bola vermelha',
  'Amanhã nós vamos viajar para a praia',
  'Eu gosto de estudar programação de manhã',
  'A comida estava deliciosa ontem à noite',
  'O sol nasceu muito cedo hoje',
  'Ela comprou um carro novo semana passada',
];

export const mockSentence = (size: 'short' | 'default' | 'long' = 'default'): string => {
  const bank = {
    short: shortSentences,
    default: defaultSentences,
    long: longSentences,
  }[size];

  return getRandomItem(bank);
};
