import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Input, Space } from 'antd';
// Hooks
import { useLoading, useAPICall } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { MinusOutlined } from '@ant-design/icons';

function Guess({ onSubmitGuess }) {
  const [isLoading] = useLoading();
  const [guess, setGuess] = useState('');

  const onSendGuess = useAPICall({
    apiFunction: UE_SO_ISSO_API.sendGuess,
    actionName: 'guess',
    successMessage: 'Resultado enviado com sucesso!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar o resultado',
  });

  return (
    <Fragment>
      <Space className="u-word-guess-phase__suggestions">
        <Input placeholder="Digite aqui seu chute" onChange={(e) => setGuess(e.target.value)} />
        <Button
          type="primary"
          onClick={() => onSendGuess({ guess })}
          disabled={guess.length < 3 || isLoading}
        >
          Enviar
        </Button>
      </Space>
      <Space className="u-word-guess-phase__suggestions">
        <Button
          icon={<MinusOutlined />}
          type="default"
          onClick={() => onSubmitGuess({ guess: 'PASS' })}
          disabled={isLoading}
        >
          Passar a vez...
        </Button>
      </Space>
    </Fragment>
  );
}

Guess.propTypes = {
  onSubmitGuess: PropTypes.func.isRequired,
};

export default Guess;
