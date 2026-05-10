import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
// Ant Design Resources
import { Tooltip } from 'antd';
// Components
import { Translate } from 'components/language/Translate';

type GuessedLocationProps = {
  typedLocation: string;
  fragments: string[];
};

export function GuessedLocation({ typedLocation, fragments }: GuessedLocationProps) {
  const displayText = useMemo(() => {
    if (!typedLocation) return [];
    return typedLocation.split('');
  }, [typedLocation]);

  const highlightedIndices = useMemo(() => {
    const highlighted = new Set<number>();

    // Find the next non-underscore fragment
    const findNextLetterFragment = (startIndex: number): number => {
      for (let i = startIndex; i < fragments.length; i++) {
        if (fragments[i] !== '_') {
          return i;
        }
      }
      return -1; // No more letter fragments
    };

    // Start by finding the first letter fragment
    let fragmentIndex = findNextLetterFragment(0);
    if (fragmentIndex === -1) return highlighted; // All underscores, nothing to highlight

    for (let i = 0; i < typedLocation.length; i++) {
      const char = typedLocation[i].toUpperCase();
      const expectedChar = fragments[fragmentIndex];

      if (char === expectedChar) {
        highlighted.add(i);
        // Move to the next letter fragment
        fragmentIndex = findNextLetterFragment(fragmentIndex + 1);
        if (fragmentIndex === -1) break; // No more fragments to match
      }
    }

    return highlighted;
  }, [typedLocation, fragments]);

  return (
    <div className="guessed-location">
      {displayText.map((char, i) => (
        <span
          key={i}
          className={clsx('guessed-location__letter', {
            'guessed-location__space': char === ' ',
            'guessed-location__highlighted': highlightedIndices.has(i),
          })}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      <motion.span
        className="guessed-location__cursor"
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
      >
        |
      </motion.span>
    </div>
  );
}

type LocationFragmentsProps = {
  fragments: string[];
};

export function LocationFragments({ fragments }: LocationFragmentsProps) {
  if (fragments.length === 0) {
    return null;
  }

  return (
    <Tooltip
      title={
        <Translate
          pt="Partes da palavra que você acertou, os espaços em cinza podem remeter a espaços ou letras que você ainda não acertou."
          en="Parts of the word you got right, the gray spaces can represent either spaces or letters you haven't guessed yet."
        />
      }
    >
      <div className="location-fragments">
        {fragments.map((fragment, i) => (
          <span
            key={i}
            className={fragment === '_' ? 'location-fragments__unknown' : 'location-fragments__letter'}
          >
            {fragment}
          </span>
        ))}
      </div>
    </Tooltip>
  );
}
