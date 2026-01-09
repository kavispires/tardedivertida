// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { SuggestionEasel } from 'components/game/SuggestionEasel';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { TimerBar } from 'components/timers';
// Internal
import type { SecretWord, Suggestion } from './utils/types';
import { GUESSING_DURATION } from './utils/constants';
import { UeSoIssoCard as Card } from './components/UeSoIssoCard';
import { Hint } from './components/Hint';

type StepWaitingForGuessProps = {
  guesser: GamePlayer;
  secretWord: SecretWord;
  validSuggestions: Suggestion[];
  timerEnabled: boolean;
  hintsEnabled: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepWaitingForGuess({
  guesser,
  secretWord,
  validSuggestions,
  announcement,
  timerEnabled,
  hintsEnabled,
}: StepWaitingForGuessProps) {
  const { timeLeft } = useCountdown({
    duration: GUESSING_DURATION,
    disabled: !timerEnabled,
    onExpire: () => {},
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={
            <>
              Hora de <PlayerAvatarName player={guesser} /> brilhar!
            </>
          }
          en={
            <>
              Time for <PlayerAvatarName player={guesser} /> to shine!
            </>
          }
        />
      </StepTitle>
      {timerEnabled && (
        <TimerBar
          value={timeLeft}
          total={GUESSING_DURATION}
          status={timeLeft < 15 ? 'exception' : 'active'}
          size="small"
        />
      )}

      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              {guesser.name} tem uma única chance de adivinhar a palavra secreta!
              <br />
              Se acertar, o grupo ganha <PointsHighlight type="positive">2 pontos</PointsHighlight> mas se
              errar, o grupo perde <PointsHighlight type="negative">1 pontos</PointsHighlight>.
              <br />
              Há a opção de pular a rodada, mas só faz o grupo perder tempo.
            </>
          }
          en={
            <>
              {guesser.name} has a single chance to guess the secret word!
              <br />
              If they get it right, the group wins <PointsHighlight type="positive">2 points</PointsHighlight>{' '}
              but if they get it wrong, the group loses{' '}
              <PointsHighlight type="negative">1 points</PointsHighlight>.
              <br />
              There's the option to skip the round, but it only wastes time.
            </>
          }
        />
      </RuleInstruction>

      <Card word={secretWord.text} />

      <Hint
        isTheGuesser={false}
        guesser={guesser}
        secretWord={secretWord}
        hintsEnabled={hintsEnabled}
        showFirstHint={timeLeft < 60}
        showSecondHint={timeLeft < 30}
      />

      <Space className="u-word-guess-phase__suggestions">
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
      </Space>

      {validSuggestions.length === 0 && (
        <RuleInstruction type="alert">
          <Translate
            pt="Vocês eliminaram todas as dicas, super burros... coitado do(a) adivinhador(a)"
            en="Y'all eliminated all the clues! Poor guesser..."
          />
        </RuleInstruction>
      )}
    </Step>
  );
}
