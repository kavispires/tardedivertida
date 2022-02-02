import { useState } from 'react';
// Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
import { useOnMakeAccusationAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from '../../components';
import { StepFinalAssessment } from './StepFinalAssessment';

function PhaseFinalAssessment({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const isUserReady = useIsUserReady(players, state);
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onMakeAccusation = useOnMakeAccusationAPIRequest(setStep);

  const isUserTheAccuser =
    state.finalAssessment.playerOrder[state.finalAssessment.playerOrderIndex] === user.id;

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT}
      className="e-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        {state.finalAssessment.playerOrderIndex === 0 ? (
          <PhaseAnnouncement
            type="people-assessment"
            title={translate('O tempo acabou!', "Time's up!")}
            onClose={() => setStep(1)}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={2}
          />
        ) : (
          <PhaseAnnouncement
            type="opinions"
            title={translate('A avaliação final continua', 'The final assessment continues')}
            onClose={() => setStep(1)}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={3}
          >
            <Instruction>
              <Translate pt="A votação não foi unanime" en="The vote wasn't unanimous" />
            </Instruction>
          </PhaseAnnouncement>
        )}

        {/* Step 1 */}
        <StepFinalAssessment
          onMakeAccusation={onMakeAccusation}
          players={players}
          finalAssessment={state.finalAssessment}
          outcome={state.outcome}
          user={user}
          locations={state.locations}
          isUserTheAccuser={isUserTheAccuser}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseFinalAssessment;
