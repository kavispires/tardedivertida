import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Input, Space } from 'antd';
import { CloudUploadOutlined, MinusOutlined } from '@ant-design/icons';
// Hooks
import { useLoading } from '../../../hooks';

function Guess({ onSubmitGuess, onSendGuess }) {
  const [isLoading] = useLoading();
  const [guess, setGuess] = useState('');

  const onEnterInput = (e) => {
    if (e.key === 'Enter') {
      onSendGuess({ guess });
    }
  };

  return (
    <Space className="u-word-guess-phase__suggestions">
      <Input
        placeholder="Digite aqui seu chute"
        onChange={(e) => setGuess(e.target.value)}
        onKeyPress={onEnterInput}
      />
      <Button
        icon={<CloudUploadOutlined />}
        type="primary"
        onClick={() => onSendGuess({ guess })}
        disabled={guess.length < 3 || isLoading}
      >
        Enviar
      </Button>
      <Button
        icon={<MinusOutlined />}
        type="default"
        onClick={() => onSubmitGuess({ guess: 'PASS' })}
        disabled={isLoading}
      >
        Passar a vez...
      </Button>
    </Space>
  );
}

Guess.propTypes = {
  onSendGuess: PropTypes.func.isRequired,
  onSubmitGuess: PropTypes.func.isRequired,
};

export default Guess;
