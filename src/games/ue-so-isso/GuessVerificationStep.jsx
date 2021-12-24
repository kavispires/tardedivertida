import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Button, message, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// Components
import {
  Instruction,
  Step,
  Title,
  TitleHighlight,
  translate,
  Translate,
  ViewIf,
} from '../../components/shared';
import { UeSoIssoCard as Card } from '../../components/cards';
import { AvatarName } from '../../components/avatars';
import { messageContent } from '../../components/modals/messageContent';
import SuggestionEasel from './SuggestionEasel';
import { useLanguage } from '../../hooks';

function GuessVerificationStep({
  guess,
  guesser,
  isAdmin,
  isLoading,
  isUserTheGuesser,
  isUserTheController,
  controller,
  secretWord,
  onSubmitOutcome,
  validSuggestions,
}) {
  const language = useLanguage();

  useEffect(() => {
    if (isUserTheController) {
      message.info(
        messageContent(
          translate('Você controla!', 'You control!'),
          translate('Selecione se o adivinhador acertou ou não', 'Select if the guesser got it right or not'),
          controller.id,
          3
        )
      );
    }
  }, [isUserTheController, controller.id]);

  return (
    <Step>
      <Title>
        <AvatarName player={guesser} addressUser /> <Translate pt="disse" en="said" />{' '}
        <TitleHighlight>{guess}</TitleHighlight>
      </Title>

      <Card word={secretWord.text} />

      <ViewIf isVisible={isUserTheGuesser}>
        <Instruction contained>
          <Translate
            pt={
              <>
                <AvatarName player={controller} /> está encarregado(a) de apertar os botões se você acertou ou
                não. <br />
                São 3 pontos se você acertar, -1 se errar, mas você pode passar e não tentar, covarde!..{' '}
                <br />
                As dicas foram:
              </>
            }
            en={
              <>
                <AvatarName player={controller} /> is in charge of confirming if you got it right or not.
                <br />
                It's 3 points if you got it right but -1 if you got it wrong. <br />
                The clues were:
              </>
            }
          />
        </Instruction>
      </ViewIf>

      <ViewIf isVisible={!isUserTheGuesser}>
        <Instruction contained>
          <Translate
            pt={
              <>
                <AvatarName player={controller} addressUser /> está encarregado(a) de apertar os botões se{' '}
                <AvatarName player={guesser} />
                acertou ou não. <br />
                São 3 pontos se você acertar, -1 se errar, mas você pode passar e não tentar, covarde!..{' '}
                <br />
                As dicas são:
              </>
            }
            en={
              <>
                <AvatarName player={controller} addressUser /> is in charge to confirm if{' '}
                <AvatarName player={guesser} /> got it correct or not. <br />
                It's 3 points if they got it right but -1 if they got it wrong. <br />
                The clues were:
              </>
            }
          />
        </Instruction>
      </ViewIf>
      <Space className="u-word-guess-phase__suggestions">
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
        })}
      </Space>

      {(isUserTheController || isAdmin) && (
        <Space className={clsx('u-word-guess-phase__guess-submit', isAdmin && 'admin-container')}>
          <Button
            icon={<CheckOutlined />}
            type="primary"
            style={{ backgroundColor: 'green' }}
            onClick={() => onSubmitOutcome({ outcome: 'CORRECT' })}
            disabled={isLoading}
          >
            <Translate pt="Acertou" en="Correct" />
          </Button>
          <Button
            icon={<CloseOutlined />}
            type="primary"
            danger
            onClick={() => onSubmitOutcome({ outcome: 'WRONG' })}
            disabled={isLoading}
          >
            <Translate pt="Errou" en="Wrong" />
          </Button>
        </Space>
      )}
    </Step>
  );
}

GuessVerificationStep.propTypes = {
  controller: PropTypes.shape({
    id: PropTypes.string,
  }),
  guess: PropTypes.string,
  guesser: PropTypes.shape({
    avatarId: PropTypes.string,
    name: PropTypes.string,
  }),
  isAdmin: PropTypes.bool,
  isLoading: PropTypes.bool,
  isUserTheController: PropTypes.bool,
  isUserTheGuesser: PropTypes.bool,
  isUserTheNextGuesser: PropTypes.bool,
  nextGuesser: PropTypes.shape({
    avatarId: PropTypes.string,
    name: PropTypes.string,
  }),
  onSubmitOutcome: PropTypes.func,
  secretWord: PropTypes.shape({
    text: PropTypes.string,
  }),
  validSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      suggestion: PropTypes.string,
    })
  ),
};

export default GuessVerificationStep;
