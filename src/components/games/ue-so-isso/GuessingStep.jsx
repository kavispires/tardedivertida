import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// Components
import { Step } from '../../shared/StepSwitcher';
import Title from '../../shared/Title';
import Instruction from '../../shared/Instruction';
import UeSoIssoCard from '../../cards/UeSoIssoCard';
import Guess from './Guess';
import View from '../../shared/View';
import AvatarName from '../../avatars/AvatarName';
import SuggestionEasel from './SuggestionEasel';

function GuessingStep({
  guesser,
  isUserTheGuesser,
  secretWord,
  onSendGuess,
  onSubmitGuess,
  validSuggestions,
}) {
  return (
    <Step>
      <View visibleIf={isUserTheGuesser}>
        <Title>
          Hora de brilhar, <AvatarName player={guesser} />!
        </Title>
        <Instruction contained>Você tem uma única change de adivinhar a palavra secreta!</Instruction>

        <UeSoIssoCard word={<QuestionCircleOutlined />} header="A Palavra Secreta é" />

        <Instruction contained>Escreva seu chute no campo abaixo</Instruction>

        <Space className="u-word-guess-phase__suggestions">
          {validSuggestions.map((suggestionEntry, index) => {
            const id = `${suggestionEntry.suggestion}-${index}`;
            return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
          })}
        </Space>

        <Guess onSubmitGuess={onSubmitGuess} onSendGuess={onSendGuess} />
      </View>

      <View visibleIf={!isUserTheGuesser}>
        <Title>
          Hora de <AvatarName player={guesser} /> brilhar!
        </Title>
        <Instruction contained>
          {guesser.name} tem uma única change de adivinhar a palavra secreta!
        </Instruction>
        <UeSoIssoCard word={secretWord.text} header="A Palavra Secreta é" />
        <Instruction contained>{guesser.name} está pensando...</Instruction>

        <Space className="u-word-guess-phase__suggestions">
          {validSuggestions.map((suggestionEntry, index) => {
            const id = `${suggestionEntry.suggestion}-${index}`;
            return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
          })}
        </Space>
      </View>
    </Step>
  );
}

GuessingStep.propTypes = {
  guesser: PropTypes.shape({
    avatarId: PropTypes.number,
    name: PropTypes.string,
  }),
  isUserTheGuesser: PropTypes.bool,
  onSendGuess: PropTypes.func,
  onSubmitGuess: PropTypes.func,
  secretWord: PropTypes.shape({ text: PropTypes.string }),
  validSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      suggestion: PropTypes.string,
    })
  ),
};

export default GuessingStep;
