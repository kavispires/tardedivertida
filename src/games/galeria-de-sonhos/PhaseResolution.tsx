import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useLanguage } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher } from 'components';

function PhaseResolution({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.RESOLUTION}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstructionType="SERVER"
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          type="sleep"
          title={translate('Tema dos Sonhos', 'The Dream Theme')}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
        >
          TODO
        </PhaseAnnouncement>

        {/* Step 1 */}
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
