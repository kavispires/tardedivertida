import { useEffect } from 'react';
import clsx from 'clsx';
// Design Resources
import { Button, message, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import {
  AvatarName,
  Instruction,
  messageContent,
  Step,
  Title,
  TitleHighlight,
  Translate,
  ViewIf,
} from '../../components';
import Card from './UeSoIssoCard';
import SuggestionEasel from './SuggestionEasel';

type StepGuessVerificationProps = {
  guess: string;
  guesser: GamePlayer;
  isAdmin: boolean;
  isLoading: boolean;
  isUserTheGuesser: boolean;
  isUserTheController: boolean;
  controller: GamePlayer;
  secretWord: UeSoIssoCard;
  onSubmitOutcome: GenericFunction;
  validSuggestions: UseSoIssoSuggestion[];
};

function StepGuessVerification({
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
}: StepGuessVerificationProps) {
  const { translate } = useLanguage();
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
  }, [isUserTheController, controller.id, translate]);

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

export default StepGuessVerification;
