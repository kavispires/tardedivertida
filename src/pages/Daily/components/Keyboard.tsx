import { Space } from 'antd';
import clsx from 'clsx';
import { useCardWidth } from 'hooks/useCardWidth';

const FIRST_ROW = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const SECOND_ROW = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const THIRD_ROW = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

type KeyboardProps = {
  guessedLetters: BooleanDictionary;
  correctLetters: BooleanDictionary;
  onLetterClick: GenericFunction;
  disabled: boolean;
};

export function Keyboard({ guessedLetters, correctLetters, onLetterClick, disabled }: KeyboardProps) {
  const width = useCardWidth(FIRST_ROW.length + 2, { margin: 16, maxWidth: 30, containerId: 'root' });
  const baseClassName = 'daily-keyboard-key';

  return (
    <Space direction="vertical" align="center" className="keyboard" size="small">
      <Space size="small">
        {FIRST_ROW.map((letter) => (
          <Key
            key={letter}
            width={width}
            letter={letter}
            guessedLetters={guessedLetters}
            correctLetters={correctLetters}
            onLetterClick={onLetterClick}
            disabled={disabled}
          />
        ))}
      </Space>
      <Space size="small">
        {SECOND_ROW.map((letter) => (
          <Key
            key={letter}
            width={width}
            letter={letter}
            guessedLetters={guessedLetters}
            correctLetters={correctLetters}
            onLetterClick={onLetterClick}
            disabled={disabled}
          />
        ))}
      </Space>
      <Space size="small">
        {THIRD_ROW.map((letter) => (
          <Key
            key={letter}
            width={width}
            letter={letter}
            guessedLetters={guessedLetters}
            correctLetters={correctLetters}
            onLetterClick={onLetterClick}
            disabled={disabled}
          />
        ))}
      </Space>
      <Space size="small">
        <button
          className={clsx(
            baseClassName,
            guessedLetters[' '] && `${baseClassName}--guessed`,
            correctLetters[' '] && `${baseClassName}--correct`
          )}
          onClick={() => onLetterClick(' ')}
          disabled={disabled}
        >
          Space
        </button>
      </Space>
    </Space>
  );
}

type KeyProps = {
  letter: string;
  width: number;
} & KeyboardProps;

function Key({ letter, guessedLetters, correctLetters, onLetterClick, disabled }: KeyProps) {
  const baseClassName = 'daily-keyboard-key';
  const width = useCardWidth(FIRST_ROW.length + 2, { margin: 16, maxWidth: 30, containerId: 'root' });

  return (
    <button
      key={letter}
      style={{ width }}
      className={clsx(
        baseClassName,
        guessedLetters[letter] && `${baseClassName}--guessed`,
        correctLetters[letter] && `${baseClassName}--correct`
      )}
      onClick={() => onLetterClick(letter)}
      disabled={disabled}
    >
      {letter}
    </button>
  );
}
