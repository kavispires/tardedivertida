// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { SpeechBubbleIcon } from 'icons/SpeechBubbleIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { Instruction, TextHighlight } from 'components/text';
import { AvatarName } from 'components/avatars';
import { StepResult } from './StepResult';

export function PhaseResult({ state, players, info }: PhaseProps) {
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
                "E <AvatarName player={guesser} addressUser size="large" /> passou..."
              </>
            }
            en={
              <>
                And <AvatarName player={guesser} addressUser size="large" /> passed...
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                "E <AvatarName player={guesser} addressUser size="large" /> disse..."
              </>
            }
            en={
              <>
                And <AvatarName player={guesser} addressUser size="large" /> said...
              </>
            }
          />
        )
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Instruction className="u-guess" contained>
        {!isPass && <TextHighlight>"{state.guess}"</TextHighlight>}
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.RESULT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResult
          guesser={guesser}
          guess={state.guess}
          validSuggestions={state.validSuggestions}
          suggestions={state.suggestions}
          secretWord={state.secretWord}
          announcement={announcement}
          group={state.group}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
