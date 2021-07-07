import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// Components
import { Instruction, Step, Title } from '../../shared';
import { UeSoIssoCard as Card } from '../../cards';
import { AvatarName } from '../../avatars';
import SuggestionEasel from './SuggestionEasel';

function SuggestionStep({ guesser, onSendSuggestions, secretWord, suggestionsNumber = 1 }) {
  const [suggestions, setSuggestions] = useState([]);

  const onChangeInput = (e) => {
    const { id, value } = e.target;
    if (id && value?.length > 1) {
      const indexStr = id.split('-')[1];
      const index = Number(indexStr) - 1;
      setSuggestions((s) => {
        const newState = { ...s };
        newState[index] = value.toUpperCase().trim();
        return newState;
      });
    }
  };

  const suggestionsValues = Object.values(suggestions);

  return (
    <Step>
      <Title>
        Escreva uma dica para <AvatarName player={guesser} />
      </Title>

      <Instruction contained>
        A dica tem que ser uma palavra única que ajude o adivinhador... adivinhar.
        <br />
        É proibido usar derivados, partes da palavra ou traduções em outras línguas.
        <br />
        E não seja tão óbvio, já que dicas similares são eliminadas.
        <br />
      </Instruction>

      <Card word={secretWord.text} header="Palavra Secreta" />

      {suggestionsNumber > 1 && (
        <Instruction contained>
          Já que esse jogo tem menos jogadores, você tem que escrever {suggestionsNumber} sugestões
        </Instruction>
      )}

      <Space className="u-word-suggestion-step__inputs">
        {Array(suggestionsNumber)
          .fill(1)
          .map((entry, index) => {
            const id = `suggestion-${entry + index}`;
            return <SuggestionEasel key={id} id={id} onChangeInput={onChangeInput} />;
          })}
      </Space>

      <Space className="u-word-suggestion-step__submit">
        <Button
          icon={<CloudUploadOutlined />}
          type="primary"
          onClick={() => onSendSuggestions({ suggestions: suggestionsValues })}
          disabled={suggestionsValues.length < suggestionsNumber}
        >
          {suggestionsNumber > 1 ? 'Enviar sugestões' : 'Enviar sugestão'}
        </Button>
      </Space>
    </Step>
  );
}

SuggestionStep.propTypes = {
  guesser: PropTypes.shape({
    avatarId: PropTypes.number,
    name: PropTypes.string,
  }),
  onSendSuggestions: PropTypes.func,
  secretWord: PropTypes.shape({ text: PropTypes.string }),
  suggestionsNumber: PropTypes.number,
};

SuggestionStep.defaultProps = {
  suggestionsNumber: 1,
};

export default SuggestionStep;
