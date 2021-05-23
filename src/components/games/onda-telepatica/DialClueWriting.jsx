import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Input, Space } from 'antd';
// Components
import Title from '../../shared/Title';
import Instruction from '../../shared/Instruction';
import Dial from './Dial';

const getHint = (card) => {
  if (card.target === 0) {
    return 'número 0, bem no centro,';
  }

  if (card.target < 0) {
    return `"${Math.abs(card.target)}" do lado "${card.left}"`;
  }

  return `"${card.target}" do lado "${card.right}"`;
};

function DialClueWriting({ onSendClue, card }) {
  const [clue, setClue] = useState('');

  return (
    <div className="o-dial-clue-writing">
      <Title>Escreva uma dica!</Title>
      <Instruction contained>
        Escreva uma dica que ajudará seu time a apontar o número {getHint(card)} do medidor de ondas
        telepáticas.
        <br />
        Regras:
        <ul>
          <li>
            Use uma única idea. Evite usar "mas", "enquanto", "quando", e também superlativos "super", "muito"
          </li>
          <li>Não invente coisas. Exemplo: 'Nicolas Cage cantando uma música dos Beatles' é inválido.</li>
          <li>Mantenha-se no assunto da carta. Exemplo: 'Amor' não é uma dica válida para 'Sujo'.</li>
          <li>Não use números para sugerir a posição do espectro.</li>
          <li>Não use partes, derivados ou sinônimos das palavras da carta.</li>
        </ul>
      </Instruction>

      <Dial card={card} showTarget target={card.target} />

      <Space className="container container--center container--transparent">
        <Input
          onChange={(e) => setClue(e.target.value.toUpperCase())}
          placeholder="Digite sua dica aqui"
          className="uppercase-input"
        />
        <Button
          type="primary"
          disabled={!Boolean(clue)}
          onClick={() => {
            onSendClue({ clue });
          }}
        >
          Enviar dica
        </Button>
      </Space>
    </div>
  );
}

DialClueWriting.propTypes = {
  onSendClue: PropTypes.func.isRequired,
  card: PropTypes.shape({
    id: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
  }).isRequired,
};

export default DialClueWriting;
