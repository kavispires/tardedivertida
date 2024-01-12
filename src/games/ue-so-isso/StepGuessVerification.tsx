import { useEffect } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Button, App, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer } from 'types/player';
import type { TextCard } from 'types/tdr';
import type { Suggestion } from './utils/types';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { messageContent } from 'components/pop-up';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, TextHighlight, Title } from 'components/text';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { ViewIf } from 'components/views';
import { HostOnlyContainer } from 'components/host';
import { SuggestionEasel } from 'components/game/SuggestionEasel';

type StepGuessVerificationProps = {
  guess: string;
  guesser: GamePlayer;
  isLoading: boolean;
  isUserTheController: boolean;
  controller: GamePlayer;
  secretWord: TextCard;
  onSubmitOutcome: GenericFunction;
  validSuggestions: Suggestion[];
} & Pick<StepProps, 'announcement'>;

export function StepGuessVerification({
  guess,
  guesser,
  isLoading,
  isUserTheController,
  controller,
  secretWord,
  onSubmitOutcome,
  validSuggestions,
  announcement,
}: StepGuessVerificationProps) {
  const { message } = App.useApp();
  const { translate } = useLanguage();

  useEffect(() => {
    if (isUserTheController && !isLoading) {
      message.info(
        messageContent(
          translate('Você controla!', 'You control!'),
          translate('Selecione se o adivinhador acertou ou não', 'Select if the guesser got it right or not'),
          controller.id,
          3
        )
      );
    }
  }, [isUserTheController, controller.id, translate, isLoading, message]);

  return (
    <Step fullWidth announcement={announcement}>
      <Title className={getAnimationClass('heartBeat')}>
        <AvatarName player={guesser} addressUser /> <Translate pt="disse" en="said" />{' '}
        <TextHighlight>{guess}</TextHighlight>
      </Title>

      <Card word={secretWord.text} />

      <RuleInstruction type="alert">
        <Translate
          pt={
            <>
              O sistema não pode verificar se a resposta está correta.
              <br />
              Por favor, confirme se <AvatarName player={guesser} /> acertou ou não.
            </>
          }
          en={
            <>
              The system wasn't able to verify the guess.
              <br />
              Please confirm if <AvatarName player={guesser} /> got it right or not.
            </>
          }
        />
      </RuleInstruction>

      <Space className="u-word-guess-phase__suggestions space-container">
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
        })}
      </Space>

      <ViewIf condition={isUserTheController}>
        <RuleInstruction type="action">
          <Translate pt="Aperte o botão correspondente" en="Press the corresponding button" />:
        </RuleInstruction>
        <ConfirmationButton onSubmitOutcome={onSubmitOutcome} isLoading={isLoading} />
      </ViewIf>

      {!isUserTheController && (
        <HostOnlyContainer
          label={
            <Translate
              pt="Host Controls (use somente se o jogador controlador não controlar)"
              en="Host Controls (only use if the assign player doesn't)"
            />
          }
        >
          <ConfirmationButton onSubmitOutcome={onSubmitOutcome} isLoading={isLoading} />
        </HostOnlyContainer>
      )}
    </Step>
  );
}

type ConfirmationButtonProps = {
  onSubmitOutcome: GenericFunction;
  isLoading: boolean;
};

function ConfirmationButton({ onSubmitOutcome, isLoading }: ConfirmationButtonProps) {
  return (
    <Space className={clsx('u-word-guess-phase__guess-submit')}>
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
  );
}
