import React, { useState } from 'react';
// Design Resources
import { Button, Input, Space } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// Components
import Title from '../shared/Title';
import Instruction from '../shared/Instruction';
import Card from '../cards/UmSoCard';

function SuggestionStep({ onSendSuggestions, secretWordId, suggestionsNumber = 1 }) {
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
    <div className="u-word-suggestion-step">
      <Title white>Escreva uma dica</Title>

      <Instruction white>
        A dica tem que ser uma palavra única que ajude o adivinhador... adivinhar.
        <br />E não seja tão óbvio, já que dicas similares são eliminadas.
      </Instruction>

      <Card id={secretWordId} title="Palavra Secreta" />

      {suggestionsNumber > 1 && (
        <Instruction white>
          Já que esse jogo tem menos jogadores, você tem que escrever {suggestionsNumber} sugestões
        </Instruction>
      )}

      <Space className="u-word-suggestion-step__inputs">
        {Array(suggestionsNumber)
          .fill(1)
          .map((entry, index) => {
            const id = `suggestion-${entry + index}`;
            return (
              <Input
                placeholder="Escreva sua dica aqui..."
                key={id}
                id={id}
                onChange={onChangeInput}
                className="u-word-suggestion-step__input"
              />
            );
          })}
      </Space>

      <Space className="u-word-suggestion-step__submit">
        <Button
          icon={<CloudUploadOutlined />}
          type="primary"
          onClick={() => onSendSuggestions(suggestionsValues)}
          disabled={suggestionsValues.length < suggestionsNumber}
        >
          {suggestionsNumber > 1 ? 'Enviar sugestões' : 'Enviar sugestão'}
        </Button>
      </Space>
    </div>
  );
}

export default SuggestionStep;
