import moment from 'moment';

export function getToday(): string {
  return moment().format('YYYY-MM-DD');
}

export function getLettersInWord(text: string): Record<string, boolean> {
  const normalizedText = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const letters = normalizedText.split('');
  const lettersInWord: Record<string, boolean> = {};

  letters.forEach((letter) => {
    if (letter.match(/[a-zA-Z\s]/)) {
      lettersInWord[letter] = false;
    }
  });

  return lettersInWord;
}

export function cleanupLetter(char: string): string {
  return char
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function isLetter(char: string): boolean {
  return cleanupLetter(char).match(/[a-zA-Z]/) !== null;
}
