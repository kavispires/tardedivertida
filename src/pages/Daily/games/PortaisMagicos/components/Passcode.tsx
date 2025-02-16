import clsx from 'clsx';
import { motion } from 'framer-motion';
// Utils
import { getAnimation } from 'utils/animations';

type PasscodeProps = {
  passcode: string;
  latestGuess: string;
  words: string[];
  currentCorridorIndexes: number[];
  onSlideWordPosition: (index: number) => void;
  disabled: boolean;
};

export function Passcode({
  passcode,
  latestGuess = '',
  words,
  onSlideWordPosition,
  currentCorridorIndexes,
  disabled,
}: PasscodeProps) {
  const wordsLength = words[0].length;

  return (
    <div className="passcode" style={{ gridTemplateColumns: `repeat(${words.length}, 1fr)` }}>
      {words.map((word, wordIndex) => {
        const isCorrect = passcode[wordIndex] === latestGuess[wordIndex];

        return (
          <motion.button
            type="button"
            key={word}
            className={clsx('passcode-word-container')}
            onClick={() => onSlideWordPosition(wordIndex)}
            disabled={isCorrect || disabled}
            {...getAnimation('fadeIn', { delay: wordIndex * 0.1 })}
          >
            <div className="passcode-letter-outline" />
            <div className={clsx('passcode-word', `passcode-word--pos-${currentCorridorIndexes[wordIndex]}`)}>
              {word.split('').map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className={clsx(
                    'passcode-letter',
                    isCorrect &&
                      wordsLength - 1 - currentCorridorIndexes[wordIndex] === index &&
                      'passcode-letter--correct',
                  )}
                >
                  {letter}
                </span>
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
