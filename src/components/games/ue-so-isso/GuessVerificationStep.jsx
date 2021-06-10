import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Button, message, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// Components
import { Instruction, Step, Title, View } from '../../shared';
import UeSoIssoCard from '../../cards/UeSoIssoCard';
import { AvatarName } from '../../avatars';
import SuggestionEasel from './SuggestionEasel';
import { messageContent } from '../../modals/messageContent';

function GuessVerificationStep({
  guess,
  guesser,
  isAdmin,
  isLoading,
  isUserTheGuesser,
  isUserTheNextGuesser,
  nextGuesser,
  secretWord,
  onConfirmGuess,
  validSuggestions,
}) {
  useEffect(() => {
    if (isUserTheNextGuesser) {
      message.info(
        messageContent('Você controla!', 'Selecione se o adivinhador acertou ou não', nextGuesser.name)
      );
    }
  }, [isUserTheNextGuesser, nextGuesser.name]);

  return (
    <Step>
      <View visibleIf={isUserTheGuesser}>
        <Title>
          <AvatarName player={guesser} addressUser /> disse "{guess}"
        </Title>

        <UeSoIssoCard word={secretWord.text} header="A Palavra Secreta é" />

        <Instruction contained>
          <AvatarName player={nextGuesser} /> está encarregado(a) de apertar os botões se você acertou ou não.{' '}
          <br />
          São 3 pontos se você acertar, -1 se errar, mas você pode passar e não tentar, covarde!.. <br />
          As dicas foram:
        </Instruction>

        <Space className="u-word-guess-phase__suggestions">
          {validSuggestions.map((suggestionEntry, index) => {
            const id = `${suggestionEntry.suggestion}-${index}`;
            return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
          })}
        </Space>
      </View>

      <View visibleIf={!isUserTheGuesser}>
        <Title>
          <AvatarName player={guesser} addressUser /> disse "{guess}"
        </Title>

        <UeSoIssoCard word={secretWord.text} header="A Palavra Secreta é" />

        <Instruction contained>
          <AvatarName player={nextGuesser} addressUser /> está encarregado(a) de apertar os botões se você
          acertou ou não. <br />
          São 3 pontos se você acertar, -1 se errar, mas você pode passar e não tentar, covarde!.. <br />
          As dicas são:
        </Instruction>

        <Space className="u-word-guess-phase__suggestions">
          {validSuggestions.map((suggestionEntry, index) => {
            const id = `${suggestionEntry.suggestion}-${index}`;
            return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
          })}
        </Space>

        {(isUserTheNextGuesser || isAdmin) && (
          <Space className={clsx('u-word-guess-phase__guess-submit', isAdmin && 'admin-container')}>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              style={{ backgroundColor: 'green' }}
              onClick={() => onConfirmGuess({ guess: 'CORRECT' })}
              disabled={isLoading}
            >
              Acertou
            </Button>
            <Button
              icon={<CloseOutlined />}
              type="primary"
              danger
              onClick={() => onConfirmGuess({ guess: 'WRONG' })}
              disabled={isLoading}
            >
              Errou
            </Button>
          </Space>
        )}
      </View>
    </Step>
  );
}

GuessVerificationStep.propTypes = {
  guess: PropTypes.string,
  guesser: PropTypes.shape({
    avatarId: PropTypes.number,
    name: PropTypes.string,
  }),
  isAdmin: PropTypes.bool,
  isLoading: PropTypes.bool,
  isUserTheGuesser: PropTypes.bool,
  isUserTheNextGuesser: PropTypes.bool,
  nextGuesser: PropTypes.shape({
    avatarId: PropTypes.number,
    name: PropTypes.string,
  }),
  onConfirmGuess: PropTypes.func,
  secretWord: PropTypes.shape({ text: PropTypes.string }),
  validSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      suggestion: PropTypes.string,
    })
  ),
};

export default GuessVerificationStep;
