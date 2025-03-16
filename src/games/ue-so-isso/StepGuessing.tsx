import { useState } from 'react';
// Ant Design Resources
import { MinusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Input } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { AvatarName } from 'components/avatars';
import { SendButton } from 'components/buttons';
import { SuggestionEasel } from 'components/game/SuggestionEasel';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { TimerBar } from 'components/timers';
// Internal
import type { SecretWord, SendGuessPayload, SubmitOutcomePayload, Suggestion } from './utils/types';
import { GUESSING_DURATION } from './utils/constants';
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { Hint } from './components/Hint';

type StepGuessingProps = {
  guesser: GamePlayer;
  onSendGuess: (payload: SendGuessPayload) => void;
  onSubmitOutcome: (payload: SubmitOutcomePayload) => void;
  validSuggestions: Suggestion[];
  secretWord: SecretWord;
  timerEnabled: boolean;
  hintsEnabled: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepGuessing({
  guesser,
  onSendGuess,
  onSubmitOutcome,
  validSuggestions,
  announcement,
  secretWord,
  timerEnabled,
  hintsEnabled,
}: StepGuessingProps) {
  const { translate } = useLanguage();

  const [guess, setGuess] = useState('');
  const { timeLeft } = useCountdown({
    duration: GUESSING_DURATION,
    disabled: !timerEnabled,
    onExpire: () => onSendGuess({ guess }),
  });

  const onPressEnter = () => {
    if (guess && guess.length > 0) {
      onSendGuess({ guess });
    }
  };

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Hora de brilhar" en="Time to shine" />, <AvatarName player={guesser} />!
      </StepTitle>
      {timerEnabled && (
        <TimerBar
          value={timeLeft}
          total={GUESSING_DURATION}
          status={timeLeft < 15 ? 'exception' : 'active'}
          size="small"
        />
      )}
      <Hint
        isTheGuesser
        guesser={guesser}
        secretWord={secretWord}
        hintsEnabled={hintsEnabled}
        showFirstHint={timeLeft < 60}
        showSecondHint={timeLeft < 30}
      />

      <Card word={<QuestionCircleOutlined />} />

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              <strong>Escreva</strong> sua adivinhação abaixo.
              <br />
              Se você acertar, o grupo ganha <PointsHighlight type="positive">2 pontos</PointsHighlight> mas
              se você errar, o grupo perde <PointsHighlight type="negative">1 ponto</PointsHighlight>.
              <br />
              Você pode pular se não estiver se sentindo seguro.
            </>
          }
          en={
            <>
              <strong>Write</strong> your guess below.
              <br />
              If you get it right, the group wins <PointsHighlight type="positive">2 points</PointsHighlight>{' '}
              but if you get it wrong, the group loses{' '}
              <PointsHighlight type="negative">1 point</PointsHighlight>.
              <br />
              You can skip if you're not feeling confident.
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer>
        <Input
          placeholder={translate('Digite aqui seu chute', 'Type your guess here')}
          onChange={(e) => setGuess(e.target.value)}
          onPressEnter={onPressEnter}
          size="large"
        />
        <SendButton
          type="primary"
          onClick={() => onSendGuess({ guess })}
          disabled={guess.length < 3 || timeLeft <= 0}
          size="large"
        >
          <Translate pt="Enviar" en="Submit" />
          {timeLeft}
        </SendButton>
        <span>
          <Translate pt="OU" en="OR" />
        </span>
        <SendButton
          icon={<MinusOutlined />}
          type="default"
          onClick={() => onSubmitOutcome({ outcome: 'PASS' })}
          disabled={timeLeft <= 0}
        >
          <Translate pt="Passar a vez..." en="Skip turn" />
        </SendButton>
      </SpaceContainer>

      <SpaceContainer wrap>
        {validSuggestions.map((suggestionEntry, index) => {
          const id = `${suggestionEntry.suggestion}-${index}`;
          return <SuggestionEasel key={id} id={id} value={suggestionEntry.suggestion} />;
        })}
        {validSuggestions.length === 0 && (
          <RuleInstruction type="alert">
            <Translate
              pt="Seus companheiros eliminaram todas as dicas, super burros..."
              en="All clues were eliminated! Good luck..."
            />
          </RuleInstruction>
        )}
      </SpaceContainer>
    </Step>
  );
}
