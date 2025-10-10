// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { SpeechBubbleIcon } from 'icons/SpeechBubbleIcon';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight } from 'components/text';
// Internal
import { UE_SO_ISSO_PHASES } from './utils/constants';
import { StepResult } from './StepResult';

export function PhaseResult({ state, players }: PhaseProps) {
  const { step } = useStep(0);
  const [guesser] = useWhichPlayerIsThe('guesserId', state, players);

  const isPass = state.group.attempts.at(-1) === 'PASS';

  const announcement = (
    <PhaseAnnouncement
      icon={<SpeechBubbleIcon />}
      title={
        isPass ? (
          <Translate
            pt={
              <>
                E <PlayerAvatarName player={guesser} addressUser size="large" /> passou...
              </>
            }
            en={
              <>
                And <PlayerAvatarName player={guesser} addressUser size="large" /> passed...
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                E <PlayerAvatarName player={guesser} addressUser size="large" /> disse...
              </>
            }
            en={
              <>
                And <PlayerAvatarName player={guesser} addressUser size="large" /> said...
              </>
            }
          />
        )
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      {!isPass && (
        <Instruction className="u-guess" contained>
          <TextHighlight>"{state.guess}"</TextHighlight>
        </Instruction>
      )}
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={UE_SO_ISSO_PHASES.RESULT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResult
          guesser={guesser}
          guess={state.guess || '?'}
          validSuggestions={state.validSuggestions}
          suggestions={state.suggestions}
          secretWord={state.secretWord}
          announcement={announcement}
          group={state.group}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
