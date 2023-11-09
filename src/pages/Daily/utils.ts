import moment from 'moment';

export function getToday(): string {
  return moment().format('YYYY-MM-DD');
}

export function getLettersInWord(text: string): Record<string, boolean> {
  const cleanedUpText = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const letters = cleanedUpText.split('');
  const lettersInWord: Record<string, boolean> = {};

  letters.forEach((letter) => {
    if (letter.match(/[a-zA-Z]/)) {
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
  console.log({ char });
  return cleanupLetter(char).match(/[a-zA-Z]/) !== null;
}
