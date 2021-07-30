import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useLoading } from '../../../hooks';
// Design Resources
import { Button, Input } from 'antd';
// Components
import { ButtonContainer, Instruction, Title } from '../../shared';
import { ImageCardHand as Hand } from '../../cards';

function SecretClueWrite({ user, onSubmitClue }) {
  const [isLoading] = useLoading();
  const [clue, setClue] = useState('');

  const onButtonClick = () => {
    onSubmitClue({
      action: 'SUBMIT_CLUE',
      clue,
    });
  };

  const onEnterInput = (e) => {
    if (e.key === 'Enter') {
      onButtonClick();
    }
  };

  return (
    <div className="d-secret-clue-write">
      <Title>Escreva a Pista!</Title>
      <Instruction contained>
        <ul>
          <li>Escreva uma pista que relacione com duas das suas cartas.</li>
          <li>A pista pode ser qualquer coisa que você quiser. Não há restricões!</li>
          <li>Você ganha pontos somente se o Impostor não for encontrado, então escolha algo fácil.</li>
        </ul>
      </Instruction>
      <ButtonContainer className="d-input-container">
        <Input
          className="uppercase-input"
          placeholder="Escreva sua pista aqui"
          onChange={(e) => setClue(e.target.value)}
          onKeyPress={onEnterInput}
        />
        <Button type="primary" disabled={isLoading || clue.length < 1} onClick={onButtonClick}>
          Enviar pista secreta
        </Button>
      </ButtonContainer>
      <Hand hand={user.hand} />
    </div>
  );
}

SecretClueWrite.propTypes = {
  onSubmitClue: PropTypes.func,
  user: PropTypes.shape({
    hand: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SecretClueWrite;
