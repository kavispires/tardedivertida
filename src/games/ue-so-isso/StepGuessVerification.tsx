import { useEffect } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Button, message, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { messageContent } from 'components/pop-up';
import { Step } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { ViewIf } from 'components/views';
import { VIPOnlyContainer } from 'components/vip';
import { SuggestionEasel } from 'components/game/SuggestionEasel';

type StepGuessVerificationProps = {
  guess: string;
  guesser: GamePlayer;
  isLoading: boolean;
  isUserTheController: boolean;
  controller: GamePlayer;
  secretWord: UeSoIssoCard;
  onSubmitOutcome: GenericFunction;
  validSuggestions: UseSoIssoSuggestion[];
} & AnnouncementProps;

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
  }, [isUserTheController, controller.id, translate, isLoading]);

  return (
    <Step fullWidth announcement={announcement}>
      <Title className={getAnimationClass('heartBeat')}>
        <AvatarName player={guesser} addressUser /> <Translate pt="disse" en="said" />{' '}
        <TextHighlight>{guess}</TextHighlight>
      </Title>

      <Card word={secretWord.text} />

      <Instruction contained>
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
      </Instruction>

      <Space className="u-word-guess-phase__suggestions space-container">
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
        })}
      </Space>

      <ViewIf condition={isUserTheController}>
        <ConfirmationButton onSubmitOutcome={onSubmitOutcome} isLoading={isLoading} />
      </ViewIf>

      {!isUserTheController && (
        <VIPOnlyContainer
          label={
            <Translate
              pt="VIP Controls (use somente se o jogador controlador não controlar)"
              en="VIP Controls (only use if the assign player doesn't)"
            />
          }
        >
          <ConfirmationButton onSubmitOutcome={onSubmitOutcome} isLoading={isLoading} />
        </VIPOnlyContainer>
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
