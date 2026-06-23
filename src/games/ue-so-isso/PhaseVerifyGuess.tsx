import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useHost } from '@hooks/useHost';
import { useLoading } from '@hooks/useLoading';
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Utils
import { isDevEnv } from '@utils/helpers';
// Icons
import { AnimatedProcessingIcon } from '@icons/AnimatedProcessingIcon';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { Step } from '@components/steps/Step';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
import { UE_SO_ISSO_PHASES } from './utils/constants';
import type { PhaseVerifyGuessState } from './utils/types';
import { StepGuessVerification } from './StepGuessVerification';

export function PhaseVerifyGuess({ state, players }: PhaseProps<PhaseVerifyGuessState>) {
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
      title={
        <Translate
          pt="Processando o palpite..."
          en="Processing the guess..."
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      unskippable={!isActionable}
      duration={isActionable ? 3 : isDevEnv && isHost ? 3 : 300}
      hideContinueButton={!isActionable}
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={UE_SO_ISSO_PHASES.VERIFY_GUESS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={['CONTINUE', 'WIN'].includes(state.group.outcome)}>
            <Step announcement={announcement}>
              <HostNextPhaseButton autoTriggerTime={2} />
            </Step>
          </ViewIf>
          <ViewIf condition={!['CONTINUE', 'WIN'].includes(state.group.outcome)}>
            <ViewIf condition={isActionable}>
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
            </ViewIf>
            <ViewIf condition={!isActionable}>
              <Step announcement={announcement}>
                <div>{/* Users will just see the announcement */}</div>
              </Step>
            </ViewIf>
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
