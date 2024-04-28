import { Flex, Space } from 'antd';
import clsx from 'clsx';
import { useCardWidth } from 'hooks/useCardWidth';
import { useEffect } from 'react';

import { LettersDictionary } from '../utils/types';

const FIRST_ROW = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const SECOND_ROW = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const THIRD_ROW = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

type KeyboardProps = {
  onLetterClick: GenericFunction;
  lettersState?: LettersDictionary;
  disabled?: boolean;
  onEnterClick?: GenericFunction;
  onBackspaceClick?: GenericFunction;
};

export function Keyboard({
  lettersState,
  onLetterClick,
  disabled,
  onBackspaceClick,
  onEnterClick,
}: KeyboardProps) {
  const width = useCardWidth(FIRST_ROW.length + 2, { margin: 16, maxWidth: 30 });

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === 'Enter' && onEnterClick) {
        return onEnterClick();
      }
      if (key === 'Backspace' && onBackspaceClick) {
        return onBackspaceClick();
      }
      if (
        !disabled &&
        (FIRST_ROW.includes(key) || SECOND_ROW.includes(key) || THIRD_ROW.includes(key)) &&
        lettersState?.[key] !== 'disabled'
      ) {
        return onLetterClick(key);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Space direction="vertical" align="center" className="daily-keyboard" size="small">
      <Flex className="daily-keyboard__row">
        {FIRST_ROW.map((letter) => (
          <Key
            key={letter}
            width={width}
            letter={letter}
            state={lettersState?.[letter]}
            onLetterClick={onLetterClick}
            disabled={disabled}
          />
        ))}
      </Flex>
      <Flex className="daily-keyboard__row">
        {SECOND_ROW.map((letter) => (
          <Key
            key={letter}
            width={width}
            letter={letter}
            state={lettersState?.[letter]}
            onLetterClick={onLetterClick}
            disabled={disabled}
          />
        ))}
      </Flex>
      <Flex className="daily-keyboard__row">
        {THIRD_ROW.map((letter) => (
          <Key
            key={letter}
            width={width}
            letter={letter}
            state={lettersState?.[letter]}
            onLetterClick={onLetterClick}
            disabled={disabled}
          />
        ))}
      </Flex>
    </Space>
  );
}

type KeyProps = {
  letter: string;
  width: number;
  state?: string;
} & Pick<KeyboardProps, 'onLetterClick' | 'disabled'>;

function Key({ letter, state, onLetterClick, disabled }: KeyProps) {
  const baseClassName = 'daily-keyboard__key';
  const width = useCardWidth(FIRST_ROW.length + 2, { margin: 16, maxWidth: 30 });

  return (
    <button
      type="button"
      data-key={letter}
      key={letter}
      style={{ width }}
      className={clsx(baseClassName, `${baseClassName}--${state}`)}
      onClick={() => onLetterClick(letter)}
      disabled={disabled || state === 'disabled'}
    >
      {letter}
    </button>
  );
}
