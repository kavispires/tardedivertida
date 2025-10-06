import { type ChangeEvent, useEffect, useRef, useState } from 'react';
// Ant Design Resources
import { Flex, Input, type InputRef, Space } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
// Internal
import type { SubmitCluePayload } from '../utils/types';

type WordFormProps = {
  x: string;
  y: string;
  index: number;
  onSubmit: (payload: SubmitCluePayload) => void;
  disabled?: boolean;
};

export function WordForm({ x, y, onSubmit, disabled, index }: WordFormProps) {
  const [clue, setClue] = useState('');
  const textInput = useRef<InputRef | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClue(e.target.value);
  };

  useEffect(() => textInput?.current?.focus(), []);

  // DEV: Submit made-up words
  useMock(() => {
    onSubmit({
      clue: `${x.substring(0, x.length / 2)}${y.substring(y.length / 2)}`,
      currentClueCoordinate: index,
    });
  }, []);

  return (
    <Space direction="vertical">
      <Input
        ref={textInput}
        placeholder={`${x} + ${y}`}
        onChange={onChange}
        onPressEnter={() => onSubmit({ clue, currentClueCoordinate: index })}
      />
      <Flex justify="flex-end">
        <SendButton
          onClick={() => onSubmit({ clue, currentClueCoordinate: index })}
          disabled={disabled || !clue.length}
        >
          <Translate pt="Enviar" en="Submit" />
        </SendButton>
      </Flex>
    </Space>
  );
}
