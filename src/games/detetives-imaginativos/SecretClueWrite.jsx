import { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useLanguage, useLoading } from '../../hooks';
// Design Resources
import { Button, Input } from 'antd';
// Components
import { ButtonContainer, Instruction, Title, translate, Translate } from '../../components/shared';
import { ImageCardHand as Hand } from '../../components/cards';

function SecretClueWrite({ user, onSubmitClue }) {
  const language = useLanguage();
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
      <Title>
        <Translate pt="Escreva a Pista!" en="Write a Clue!" />
      </Title>
      <Instruction contained>
        <ul>
          <li>
            <Translate
              pt="Escreva uma pista que relacione com duas das suas cartas."
              en="Write a clue that relates to two of your cards."
            />
          </li>
          <li>
            <Translate
              pt="A pista pode ser qualquer coisa que você quiser. Não há restricões!"
              en="The clue can be anything you want. There are no restrictions!"
            />
          </li>
          <li>
            <Translate
              pt="Você ganha pontos somente se o Impostor não for encontrado, então escolha algo fácil e generalizado."
              en="You only get points if the Impostor is not found by the others, so choose something easy and general."
            />
          </li>
        </ul>
      </Instruction>
      <ButtonContainer className="d-input-container">
        <Input
          className="uppercase-input"
          placeholder={translate('Escreva sua pista aqui', 'Write your clue here', language)}
          onChange={(e) => setClue(e.target.value)}
          onKeyPress={onEnterInput}
        />
        <Button type="primary" disabled={isLoading || clue.length < 1} onClick={onButtonClick}>
          <Translate pt="Enviar pista secreta" en="Send secret clue" />
        </Button>
      </ButtonContainer>
      <Hand hand={user.hand} sizeRatio={6} />
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
