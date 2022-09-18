export const onRotate = (value: number, direction: number = 1) => {
  return direction === 1 ? value + 90 : value - 90;
};

export const parseRotation = (value: number) => {
  return value % 360;
};

export const cleanupGuesses = (guesses: YGuesses) => {
  Object.values(guesses).forEach((guess) => {
    if (guess?.rotation) {
      guess.rotation = parseRotation(guess.rotation);
    }
  });

  return guesses;
};
