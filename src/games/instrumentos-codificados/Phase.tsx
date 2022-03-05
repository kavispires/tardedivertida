import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher } from 'components';

function PhasePromptSelection({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.PROMPT_SELECTION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="?"
          title={translate('?', '?')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>Add text here</Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <div>Add Content Here</div>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhasePromptSelection;
