import { useEffect, useRef, useState } from 'react';
// Ant Design Resources
import { Button, Input, InputRef, Space } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { Translate } from 'components/language';

type WordFormProps = {
  x: string;
  y: string;
  index: number;
  onSubmit: GenericFunction;
  disabled?: boolean;
};

export function WordForm({ x, y, onSubmit, disabled, index }: WordFormProps) {
  const [clue, setClue] = useState('');
  const textInput = useRef<InputRef | null>(null);

  const onChange = (e: any) => {
    setClue(e.target.value);
  };

  useEffect(() => textInput && textInput.current!.focus(), []);

  // DEV: Submit made-up words
  useMock(() => {
    onSubmit({ clue: `${x.substring(0, x.length / 2)}${y.substring(y.length / 2)}`, coordinate: index });
  }, []);

  return (
    <Space direction="vertical">
      <Input
        ref={textInput}
        placeholder={`${x} + ${y}`}
        onChange={onChange}
        onPressEnter={() => onSubmit({ clue, coordinate: index })}
      />
      <Button
        type="primary"
        onClick={() => onSubmit({ clue, coordinate: index })}
        disabled={disabled || !clue.length}
      >
        <Translate pt="Enviar" en="Submit" />
      </Button>
    </Space>
  );
}
