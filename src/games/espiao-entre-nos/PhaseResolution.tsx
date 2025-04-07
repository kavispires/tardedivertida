import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { HandcuffsIcon } from 'icons/HandcuffsIcon';
import { MapLocationIcon } from 'icons/MapLocationIcon';
import { NuclearExplosionIcon } from 'icons/NuclearExplosionIcon';
import { ThiefIcon } from 'icons/ThiefIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer, PhaseTimerReset } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { ViewOr } from 'components/views';
// Internal
import { useOnProgressGameAPIRequest } from './utils/api-requests';
import { determineView } from './utils/helpers';
import { ESPIAO_ENTRE_NOS_PHASES } from './utils/constants';
import { StepResolution } from './StepResolution';

export function PhaseResolution({ state, players }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);

  const [currentSpy, isUserTheSpy] = useWhichPlayerIsThe('currentSpyId', state, players);
  const [target] = useWhichPlayerIsThe('targetId', state, players);

  const onProgressGame = useOnProgressGameAPIRequest(setStep);

  const resolutionStatus = useMemo(
    () => determineView(state.resolution, isUserTheSpy, state.timeRemaining, state.locations),
    [state.resolution, isUserTheSpy, state.timeRemaining, state.locations],
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ESPIAO_ENTRE_NOS_PHASES.RESOLUTION}
      className="e-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={resolutionStatus.didSpyGuess}>
          <PhaseAnnouncement
            icon={<MapLocationIcon />}
            title={
              <Translate pt="O espião tentou adivinhar o local" en="The spy tried to guess the location" />
            }
            onClose={goToNextStep}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={5}
            type="block"
          />

          <PhaseAnnouncement
            icon={<ThiefIcon />}
            title={<Translate pt="A votação foi unanime!" en="The vote was unanimous!" />}
            onClose={goToNextStep}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={5}
            type="block"
          />
        </ViewOr>

        {/* Step 1 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 2 */}
        <PhaseAnnouncement
          icon={
            resolutionStatus.phaseIcon === 'nuclear-explosion' ? <NuclearExplosionIcon /> : <HandcuffsIcon />
          }
          title={<Translate pt="O fim chegou!" en="The end is here!" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement"
          duration={5}
          type="block"
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
