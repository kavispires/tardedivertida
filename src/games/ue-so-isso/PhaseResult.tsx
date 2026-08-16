// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { SpeechBubbleIcon } from '@icons/SpeechBubbleIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import { UE_SO_ISSO_PHASES } from './utils/constants';
import type { PhaseResultState } from './utils/types';
import { StepResult } from './StepResult';

export function PhaseResult({ state, players }: PhaseProps<PhaseResultState>) {
  const { step } = useStep(0);
  const [guesser] = useWhichPlayerIsThe('guesserId', state, players);

  const isPass = state.group.attempts.at(-1) === 'PASS';

  const announcement = (
    <PhaseAnnouncement
      icon={<SpeechBubbleIcon />}
      title={
        isPass ? (
          <Translate
            pt="E {guesser} passou..."
            en="And {guesser} passed..."
            values={{
              guesser: (
                <PlayerAvatarName
                  player={guesser}
                  addressUser
                  size="large"
                />
              ),
            }}
          />
        ) : (
          <Translate
            pt="E {guesser} disse..."
            en="And {guesser} said..."
            values={{
              guesser: (
                <PlayerAvatarName
                  player={guesser}
                  addressUser
                  size="large"
                />
              ),
            }}
          />
        )
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      {!isPass && (
        <Surface
          className="u-guess"
          contained
        >
          <TextHighlight>"{state.guess}"</TextHighlight>
        </Surface>
      )}
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={UE_SO_ISSO_PHASES.RESULT}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepResult
          guesser={guesser}
          guess={state.guess || '?'}
          validSuggestions={state.validSuggestions}
          suggestions={state.suggestions}
          secretWord={state.secretWord}
          announcement={announcement}
          group={state.group}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
