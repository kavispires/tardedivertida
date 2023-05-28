// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
import { useVIP } from 'hooks/useVIP';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
// Components
import { Step, StepSwitcher } from 'components/steps';
import { StepGuessVerification } from './StepGuessVerification';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { VIPNextPhaseButton } from 'components/vip';
import { ViewOr } from 'components/views';

export function PhaseVerifyGuess({ state, players, info }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step, setStep } = useStep(0);
  const isVIP = useVIP();
  const [guesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);

  const isActionable = state.group.outcome !== 'CONTINUE' && (isUserTheController || isVIP);

  const announcement = (
    <PhaseAnnouncement
      icon={<AnimatedProcessingIcon />}
      title={<Translate pt="Processando o palpite..." en="Processing the guess..." />}
      currentRound={state?.round?.current}
      type="overlay"
      unskippable={!isActionable}
      duration={isActionable ? 3 : 300}
    >
      <Instruction className="u-guess" contained>
        Beep boop beep boop
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.VERIFY_GUESS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={state.group.outcome === 'CONTINUE'}>
          <Step announcement={announcement}>
            <VIPNextPhaseButton autoTriggerTime={2} />
          </Step>

          <ViewOr condition={isActionable}>
            <StepGuessVerification
              guesser={guesser}
              guess={state.guess}
              onSubmitOutcome={onSubmitOutcome}
              validSuggestions={state.validSuggestions}
              secretWord={state.secretWord}
              controller={controller}
              isUserTheController={isUserTheController}
              isLoading={isLoading}
              announcement={announcement}
            />

            <Step announcement={announcement}>
              <></>
            </Step>
          </ViewOr>
        </ViewOr>

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
