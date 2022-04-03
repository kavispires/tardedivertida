import { useMemo } from 'react';
// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useLanguage, useStep } from 'hooks';
import { useOnProgressGameAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { determineView } from './helpers';
// Components
import { StepSwitcher, ViewOr } from 'components';
import { StepResolution } from './StepResolution';
import { PhaseAnnouncement, PhaseContainer, PhaseTimerReset } from 'components/phases';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const isUserReady = useIsUserReady(players, state);
  const [currentSpy, isUserTheSpy] = useWhichPlayerIsThe('currentSpyId', state, players);
  const [target] = useWhichPlayerIsThe('targetId', state, players);

  const onProgressGame = useOnProgressGameAPIRequest(setStep);

  const resolutionStatus = useMemo(
    () => determineView(state.resolution, isUserTheSpy, state.timeRemaining, state.locations),
    [state.resolution, isUserTheSpy, state.timeRemaining, state.locations]
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.RESOLUTION}
      className="e-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <ViewOr orCondition={resolutionStatus.didSpyGuess}>
          <PhaseAnnouncement
            type="map-location"
            title={translate('O espião tentou adivinhar o local', 'The spy tried to guess the location')}
            onClose={goToNextStep}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={5}
          />

          <PhaseAnnouncement
            type="thief"
            title={translate('A votação foi unanime!', 'The vote was unanimous!')}
            onClose={goToNextStep}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={5}
          />
        </ViewOr>

        {/* Step 1 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 2 */}
        <PhaseAnnouncement
          type={resolutionStatus.phaseIcon}
          title={translate('O fim chegou!', 'The end is here!')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement"
          duration={5}
        />

        {/* Step 3 */}
        <StepResolution
          players={players}
          target={target}
          resolutionStatus={resolutionStatus}
          currentSpy={currentSpy}
          onProgressGame={onProgressGame}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
