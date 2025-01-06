// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useHost } from 'hooks/useHost';
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Step, StepSwitcher } from 'components/steps';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
import { StepGuessVerification } from './StepGuessVerification';

export function PhaseVerifyGuess({ state, players }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step, setStep } = useStep(0);
  const isHost = useHost();
  const [guesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);

  const isActionable = !['CONTINUE', 'WIN'].includes(state.group.outcome) && (isUserTheController || isHost);

  const announcement = (
    <PhaseAnnouncement
      icon={<AnimatedProcessingIcon />}
      title={<Translate pt="Processando o palpite..." en="Processing the guess..." />}
      currentRound={state?.round?.current}
      type="overlay"
      unskippable={!isActionable}
      duration={isActionable ? 3 : 300}
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.VERIFY_GUESS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={['CONTINUE', 'WIN'].includes(state.group.outcome)}>
          <Step announcement={announcement}>
            <HostNextPhaseButton autoTriggerTime={2} />
          </Step>

          <ViewOr condition={isActionable}>
            <StepGuessVerification
              guesser={guesser}
              guess={state.guess || '?'}
              onSubmitOutcome={onSubmitOutcome}
              validSuggestions={state.validSuggestions}
              secretWord={state.secretWord}
              controller={controller}
              isUserTheController={isUserTheController}
              isLoading={isLoading}
              announcement={announcement}
            />

            <Step announcement={announcement}>
              <div>{/* Users will just see the announcement */}</div>
            </Step>
          </ViewOr>
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
