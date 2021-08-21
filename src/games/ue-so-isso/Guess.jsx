import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Input, Space } from 'antd';
import { CloudUploadOutlined, MinusOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage, useLoading } from '../../hooks';
import { translate, Translate } from '../../components/shared';

function Guess({ onSubmitOutcome, onSendGuess }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [guess, setGuess] = useState('');

  const onPressEnter = () => {
    if (guess && guess.length > 0) {
      onSendGuess({ guess });
    }
  };

  return (
    <Space className="u-word-guess-phase__suggestions">
      <Input
        placeholder={translate('Digite aqui seu chute', 'Type your guess here', language)}
        onChange={(e) => setGuess(e.target.value)}
        onPressEnter={onPressEnter}
      />
      <Button
        icon={<CloudUploadOutlined />}
        type="primary"
        onClick={() => onSendGuess({ guess })}
        disabled={guess.length < 3 || isLoading}
      >
        <Translate pt="Enviar" en="Submit" />
      </Button>
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

Guess.propTypes = {
  onSendGuess: PropTypes.func.isRequired,
  onSubmitOutcome: PropTypes.func.isRequired,
};

export default Guess;
