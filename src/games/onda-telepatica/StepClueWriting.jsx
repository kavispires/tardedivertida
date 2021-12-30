import PropTypes from 'prop-types';
import { useState } from 'react';
// Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage, useLoading } from '../../hooks';
// Components
import { ButtonContainer, Instruction, Title, translate, Translate } from '../../components/shared';
import ClueWritingRules from './ClueWritingRules';
import Dial from './Dial';

const getTargetSide = (target, card, language) => {
  if (!card) {
    return '';
  }
  if (target === 0) {
    return language === 'pt' ? 'exatamente entre os dois' : 'exactly in between both ideas';
  }

  const side = target < 0 ? card.left : card.right;

  return language === 'pt' ? `do lado "${side}"` : `on the "${side}" side`;
};

function StepClueWriting({ currentCategories, currentCategoryId, target, onSendClue }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [clue, setClue] = useState('');

  const onChangeInput = (e) => {
    setClue(e.target.value);
  };

  const onSubmitClue = () => {
    onSendClue({ clue });
  };

  const card = currentCategories.find((c) => c.id === currentCategoryId);

  return (
    <div>
      <Title>
        <Translate pt="Escreva sua dica" en="Write your clue" />
      </Title>
      <Instruction contained>
        <Translate
          pt={`O ponteiro está no ${Math.abs(target)} ${getTargetSide(
            target,
            card,
            language
          )}. Escreva uma dica que ajude os outros jogadores a escolher exatamente esse número! Revise as regras de quais dicas são válidas clicando no Icone de Livrinho.`}
          en={`The needle is point at ${Math.abs(target)} ${getTargetSide(
            target,
            card,
            language
          )}. Write a clue that will help the other players to choose this exact number! Revise the rules for clue writing by clicking on the Book Icon.`}
        />
        <ClueWritingRules />
      </Instruction>
      <Dial target={target} card={card} showTarget />
      <ButtonContainer>
        <Input
          onChange={onChangeInput}
          onPressEnter={onSubmitClue}
          placeholder={translate('Escreva aqui', 'Write here', language)}
        />
        <Button type="primary" onClick={onSubmitClue} disabled={isLoading}>
          <Translate pt="Enviar" en="Send" />
        </Button>
      </ButtonContainer>
    </div>
  );
}

StepClueWriting.propTypes = {
  currentCategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      left: PropTypes.string,
      right: PropTypes.string,
    })
  ),
  currentCategoryId: PropTypes.string,
  onSendChosenSide: PropTypes.func,
  onSendClue: PropTypes.func,

  target: PropTypes.number,
};

export default StepClueWriting;
