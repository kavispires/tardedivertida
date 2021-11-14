import PropTypes from 'prop-types';
import { useState } from 'react';
// Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import {
  ButtonContainer,
  DefaultWaitingRoom,
  Instruction,
  Title,
  Translate,
  View,
  ViewSwitch,
} from '../../components/shared';
import Card from './Card';
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

function StepClueWriting({ players, currentCategories, target, onSendChosenSide }) {
  const language = useLanguage();
  const [view, setView] = useState('card');
  const [input, setInput] = useState({
    categoryId: null,
    clue: null,
  });

  const onChooseSide = (categoryId) => {
    setInput((s) => ({ ...s, categoryId }));
    setView('clue');
  };

  const onChangeInput = (e) => {
    setInput((s) => ({ ...s, clue: e.target.value }));
  };

  const onSendClue = (clue) => {
    console.log({ clue });
    onSendChosenSide(input);
    setView('sending');
  };

  const card = currentCategories.find((c) => c.id === input.categoryId);

  return (
    <ViewSwitch cases={[view === 'card', view === 'clue', view === 'sending']}>
      <View key="card">
        <div className="o-card-selection">
          <Title>
            <Translate pt="Você é Medium da rodada" en="You are the Psychic for this round" />
          </Title>
          <Instruction contained>
            <Translate
              pt="Como medium, seu objetivo é ajudar as pessoas escolherem a posição correta do medidor de ondas telepáticas. Primeiro, escolha uma das duas cartas que você acredita ser capaz de criar uma boa dica."
              en="As the Psychic, your goal is to help the other players to find the correct position of the needle in the wavelength measuring device. But first, choose one of these cards that you believe you will be able to write a good clue."
            />
          </Instruction>
          <div className="o-card-selection__container">
            {currentCategories.map((card) => (
              <button
                key={`card-button-${card.id}`}
                className="o-card-selection__button"
                onClick={() => onChooseSide(card.id)}
              >
                <Card left={card.left} right={card.right} />
              </button>
            ))}
          </div>
        </div>
      </View>

      <View key="clue">
        <Title>
          <Translate pt="Escreva sua dica" en="Write your clue" />
        </Title>
        <Instruction contained>
          <Translate
            pt={`O ponteiro está no ${Math.abs(target)} ${getTargetSide(
              target,
              card,
              language
            )}. Escreva uma dica que ajude os outros jogadores a escolher exatamente esse número! Revise as regras de quais dicas são válidas:`}
            en={`The needle is point at ${Math.abs(target)} ${getTargetSide(
              target,
              card,
              language
            )}. Write a clue that will help the other players to choose this exact number! Revise the rules for clue writing:`}
          />
          <ClueWritingRules />
        </Instruction>
        <Dial target={target} card={card} showTarget />
        <ButtonContainer>
          <Input onChange={onChangeInput} onPressEnter={onSendClue} />
          <Button type="primary" onClick={onSendClue}>
            <Translate pt="Enviar" en="Send" />
          </Button>
        </ButtonContainer>
      </View>

      <View key="sending">
        <DefaultWaitingRoom players={players} />
      </View>
    </ViewSwitch>
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
  onSendChosenSide: PropTypes.func,
  players: PropTypes.object,
  target: PropTypes.number,
};

export default StepClueWriting;
