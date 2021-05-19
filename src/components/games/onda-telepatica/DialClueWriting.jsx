import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Input } from 'antd';
// Components
import Title from '../../shared/Title';
import Instruction from '../../shared/Instruction';
import Dial from './Dial';

function DialClueWriting({ onSendClue, card }) {
  const [clue, setClue] = useState('');
  console.log({ clue });
  return (
    <div className="o-dial-clue-writing">
      <Title>Escreva uma dica!</Title>
      <Instruction contained>
        Escreva uma dica que ajudará seu time a apontar para a faixa Azul (4) no espectro. Regras:
        <br />
        • Use uma única idea. Evite usar 'mas', 'enquanto', 'quando'.
        <br />
        • Não invente alguma coisa. Exemplo: 'Nicolas Cage cantando uma música dos Beatles' é inválido.
        <br />
        • Mantenha-se no assunto da carta. Exemplo: 'Amor' não é uma dica válida para 'Sujo'.
        <br />
        • Não use números para indicar a posição do espectro.
        <br />• Não use partes, derivados ou sinônimos das palavras da carta.
      </Instruction>

      <Dial card={card} showTarget target={card.target} showNeedle needle={card.target} />

      <div className="container container--center container--transparent">
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
      </div>
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
