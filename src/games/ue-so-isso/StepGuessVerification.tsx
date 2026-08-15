import clsx from 'clsx';
import { useEffect } from 'react';
// Ant Design Resources
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, App, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { SuggestionEasel } from '@components/game-elements/SuggestionEasel';
import { HostOnlyContainer } from '@components/host/HostOnlyContainer';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { messageContent } from '@components/pop-up/messageContent';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import type { SecretWord, SubmitOutcomePayload, Suggestion } from './utils/types';
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';

type StepGuessVerificationProps = {
  guess: string;
  guesser: GamePlayer;
  isLoading: boolean;
  isUserTheController: boolean;
  controller: GamePlayer;
  secretWord: SecretWord;
  onSubmitOutcome: (payload: SubmitOutcomePayload) => void;
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
          translate({ pt: 'Você controla!', en: 'You control!' }),
          translate({
            pt: 'Selecione se o adivinhador acertou ou não',
            en: 'Select if the guesser got it right or not',
          }),
          controller.id,
          3,
        ),
      );
    }
  }, [isUserTheController, controller.id, translate, isLoading, message]);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle className={getAnimationClass('heartBeat')}>
        <PlayerAvatarName
          player={guesser}
          addressUser
        />{' '}
        <Translate
          pt="disse"
          en="said"
        />{' '}
        <TextHighlight>{guess}</TextHighlight>
      </StepTitle>

      <Card word={secretWord.text} />

      <RuleInstruction type="alert">
        <Translate
          pt={
            <>
              O sistema não pode verificar se a resposta está correta.
              <br />
              Por favor, confirme se <PlayerAvatarName player={guesser} /> acertou ou não.
            </>
          }
          en={
            <>
              The system wasn't able to verify the guess.
              <br />
              Please confirm if <PlayerAvatarName player={guesser} /> got it right or not.
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer className="u-word-guess-phase__suggestions">
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return (
            <SuggestionEasel
              key={id}
              id={id}
              value={suggestionEntry.suggestion}
            />
          );
        })}
      </SpaceContainer>

      <ViewIf condition={isUserTheController}>
        <RuleInstruction type="action">
          <Translate
            pt="Aperte o botão correspondente"
            en="Press the corresponding button"
          />
          :
        </RuleInstruction>
        <ConfirmationButton
          onSubmitOutcome={onSubmitOutcome}
          isLoading={isLoading}
        />
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
          <ConfirmationButton
            onSubmitOutcome={onSubmitOutcome}
            isLoading={isLoading}
          />
        </HostOnlyContainer>
      )}
    </Step>
  );
}

type ConfirmationButtonProps = {
  onSubmitOutcome: (payload: SubmitOutcomePayload) => void;
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
        <Translate
          pt="Acertou"
          en="Correct"
        />
      </Button>
      <Button
        icon={<CloseOutlined />}
        type="primary"
        danger
        onClick={() => onSubmitOutcome({ outcome: 'WRONG' })}
        disabled={isLoading}
      >
        <Translate
          pt="Errou"
          en="Wrong"
        />
      </Button>
    </Space>
  );
}
