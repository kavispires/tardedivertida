import clsx from 'clsx';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { Flex, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Internal
import type { LettersDictionary } from '../utils/types';

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const FIRST_ROW = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const SECOND_ROW = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const THIRD_ROW = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

type KeyboardProps = {
  onLetterClick: GenericFunction;
  lettersState?: LettersDictionary;
  disabled?: boolean;
  onEnterClick?: GenericFunction;
  onBackspaceClick?: GenericFunction;
  withNumbers?: boolean;
};

export function Keyboard({
  lettersState,
  onLetterClick,
  disabled,
  onBackspaceClick,
  onEnterClick,
  withNumbers,
}: KeyboardProps) {
  const width = useCardWidth(FIRST_ROW.length + 2, {
    margin: 16,
    maxWidth: 30,
  });

  useEffectOnce(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;
      if (disabled) return;

      if (key === 'Enter' && onEnterClick) {
        return onEnterClick();
      }
      if (key === 'Backspace' && onBackspaceClick) {
        return onBackspaceClick();
      }
      if (
        !disabled &&
        (FIRST_ROW.includes(key) || SECOND_ROW.includes(key) || THIRD_ROW.includes(key)) &&
        lettersState?.[key].disabled
      ) {
        return onLetterClick(key);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => window.removeEventListener('keyup', handleKeyUp);
  });

  return (
    <Space
      orientation="vertical"
      align="center"
      className="daily-keyboard"
      size="small"
    >
      {withNumbers && (
        <Flex className="daily-keyboard__row">
          {NUMBERS.map((letter) => (
            <Key
              key={letter}
              width={width}
              letter={letter}
              state={lettersState?.[letter]?.state}
              onLetterClick={onLetterClick}
              disabled={disabled || lettersState?.[letter]?.disabled}
            />
          ))}
        </Flex>
      )}
      <Flex className="daily-keyboard__row">
        {FIRST_ROW.map((letter) => (
          <Key
            key={letter}
            width={width}
            letter={letter}
            state={lettersState?.[letter]?.state}
            onLetterClick={onLetterClick}
            disabled={disabled || lettersState?.[letter]?.disabled}
          />
        ))}
      </Flex>
      <Flex className="daily-keyboard__row">
        {SECOND_ROW.map((letter) => (
          <Key
            key={letter}
            width={width}
            letter={letter}
            state={lettersState?.[letter]?.state}
            onLetterClick={onLetterClick}
            disabled={disabled || lettersState?.[letter]?.disabled}
          />
        ))}
      </Flex>
      <Flex className="daily-keyboard__row">
        {!!onEnterClick && (
          <button
            type="button"
            style={{ width }}
            className="daily-keyboard__key daily-keyboard__key--enter"
            onClick={onEnterClick}
            disabled={disabled}
          >
            Enter
          </button>
        )}
        {THIRD_ROW.map((letter) => (
          <Key
            key={letter}
            width={width}
            letter={letter}
            state={lettersState?.[letter]?.state}
            onLetterClick={onLetterClick}
            disabled={disabled || lettersState?.[letter]?.disabled}
          />
        ))}
        {!!onBackspaceClick && (
          <button
            type="button"
            style={{ width }}
            className="daily-keyboard__key daily-keyboard__key--backspace"
            onClick={onBackspaceClick}
            disabled={disabled}
          >
            ⌫
          </button>
        )}
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
  const width = useCardWidth(FIRST_ROW.length + 2, {
    margin: 16,
    maxWidth: 30,
  });

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
