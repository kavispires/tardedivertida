import { useEffect, useRef, useState } from 'react';
//Design Resources
import { Button, Input, Space } from 'antd';
// Hooks
import { useMock } from 'hooks';
// Components
import { Translate } from 'components';

type WordFormProps = {
  x: string;
  y: string;
  onSubmit: GenericFunction;
  disabled?: boolean;
};

function WordForm({ x, y, onSubmit, disabled }: WordFormProps) {
  const [clue, setClue] = useState('');
  const textInput = useRef<Input | null>(null);

  const onChange = (e: any) => {
    setClue(e.target.value);
  };

  useEffect(() => textInput && textInput.current!.focus(), []);

  // DEV: Submit made-up words
  useMock(() => {
    onSubmit(`${x.substring(0, x.length / 2)}${y.substring(y.length / 2)}`);
  }, []);

  return (
    <Space direction="vertical">
      <Input
        ref={textInput}
        placeholder={`${x} + ${y}`}
        onChange={onChange}
        onPressEnter={() => onSubmit(clue)}
      />
      <Button type="primary" onClick={() => onSubmit(clue)} disabled={disabled || !clue.length}>
        <Translate pt="Enviar" en="Submit" />
      </Button>
    </Space>
  );
}

export default WordForm;
