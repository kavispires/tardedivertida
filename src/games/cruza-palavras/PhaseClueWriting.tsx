import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
import { useOnSubmitClueAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, RoundAnnouncement, StepSwitcher } from '../../components';
import StepClueWriting from './StepClueWriting';
import { WritingCluesRule } from './RulesBlobs';

function PhaseClueWriting({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onSubmitClue = useOnSubmitClueAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.CLUE_WRITING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={() => setStep(1)} buttonText=" " time={5} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="grid"
          title={translate('Escreva!', 'Write!')}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
        >
          <WritingCluesRule playerCount={Object.keys(players).length} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepClueWriting user={user} grid={state.grid} onSubmitClue={onSubmitClue} players={players} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseClueWriting;
