import { useState } from 'react';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
import { CloudUploadOutlined, MinusOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage, useLoading } from 'hooks';
// Components
import { Translate } from 'components';

type GuessProps = {
  onSubmitOutcome: GenericFunction;
  onSendGuess: GenericFunction;
};

export function Guess({ onSubmitOutcome, onSendGuess }: GuessProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [guess, setGuess] = useState('');

  const onPressEnter = () => {
    if (guess && guess.length > 0) {
      onSendGuess({ guess });
    }
  };

  return (
    <Space className="u-word-guess-phase__suggestions">
      <Input
        placeholder={translate('Digite aqui seu chute', 'Type your guess here')}
        onChange={(e) => setGuess(e.target.value)}
        onPressEnter={onPressEnter}
        size="large"
      />
      <Button
        icon={<CloudUploadOutlined />}
        type="primary"
        onClick={() => onSendGuess({ guess })}
        disabled={guess.length < 3 || isLoading}
        size="large"
      >
        <Translate pt="Enviar" en="Submit" />
      </Button>
      <span>
        <Translate pt="OU" en="OR" />
      </span>
      <Button
        icon={<MinusOutlined />}
        type="default"
        onClick={() => onSubmitOutcome({ outcome: 'PASS' })}
        disabled={isLoading}
      >
        <Translate pt="Passar a vez..." en="Skip turn" />
      </Button>
    </Space>
  );
}
