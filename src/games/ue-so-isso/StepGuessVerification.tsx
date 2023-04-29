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
import { SuggestionEasel } from './components/SuggestionEasel';
import { messageContent } from 'components/pop-up';
import { Step } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { ViewIf, ViewOr } from 'components/views';
import { VIPOnlyContainer } from 'components/vip';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepGuessVerificationProps = {
  guess: string;
  guesser: GamePlayer;
  isVIP: boolean;
  isLoading: boolean;
  isUserTheGuesser: boolean;
  isUserTheController: boolean;
  controller: GamePlayer;
  secretWord: UeSoIssoCard;
  onSubmitOutcome: GenericFunction;
  validSuggestions: UseSoIssoSuggestion[];
} & AnnouncementProps;

export function StepGuessVerification({
  guess,
  guesser,
  isVIP,
  isLoading,
  isUserTheGuesser,
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
        <ViewOr condition={isUserTheGuesser}>
          <Translate
            pt={
              <>
                <AvatarName player={controller} /> está encarregado(a) de apertar os botões se você acertou ou
                não. <br />
                São <PointsHighlight type="positive">3 pontos</PointsHighlight> se você acertar,{' '}
                <PointsHighlight type="negative">-1 ponto</PointsHighlight> se errar, mas você pode passar e
                não tentar, covarde!.. <br />
                As dicas foram:
              </>
            }
            en={
              <>
                <AvatarName player={controller} /> is in charge of confirming if you got it right or not.
                <br />
                It's <PointsHighlight type="positive">3 points</PointsHighlight> if you get it right but{' '}
                <PointsHighlight type="negative">-1 point</PointsHighlight> if you get it wrong. <br />
                The clues were:
              </>
            }
          />

          <Translate
            pt={
              <>
                <AvatarName player={controller} addressUser /> está encarregado(a) de apertar os botões se{' '}
                <AvatarName player={guesser} />
                acertou ou não. <br />
                São <PointsHighlight type="positive">3 pontos</PointsHighlight> se você acertar,{' '}
                <PointsHighlight type="negative">-1 ponto</PointsHighlight> se errar, mas você pode passar e
                não tentar, covarde!.. <br />
                As dicas são:
              </>
            }
            en={
              <>
                <AvatarName player={controller} addressUser /> is in charge to confirm if{' '}
                <AvatarName player={guesser} /> got it correct or not. <br />
                It's <PointsHighlight type="positive">3 points</PointsHighlight> if they got it right but{' '}
                <PointsHighlight type="negative">-1 point</PointsHighlight> if they got it wrong. <br />
                The clues were:
              </>
            }
          />
        </ViewOr>
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
