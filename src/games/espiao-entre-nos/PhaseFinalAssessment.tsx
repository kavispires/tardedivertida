// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { OpinionsIcon } from 'icons/OpinionsIcon';
import { PeopleAssessmentIcon } from 'icons/PeopleAssessmentIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnMakeAccusationAPIRequest } from './utils/api-requests';
import { ESPIAO_ENTRE_NOS_PHASES } from './utils/constants';
import { StepFinalAssessment } from './StepFinalAssessment';

export function PhaseFinalAssessment({ state, players, user }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);

  const onMakeAccusation = useOnMakeAccusationAPIRequest(setStep);

  const isUserTheAccuser =
    state.finalAssessment.playerOrder[state.finalAssessment.playerOrderIndex] === user.id;

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ESPIAO_ENTRE_NOS_PHASES.FINAL_ASSESSMENT}
      className="e-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        {state.finalAssessment.playerOrderIndex === 0 ? (
          <PhaseAnnouncement
            icon={<PeopleAssessmentIcon />}
            title={<Translate pt="O tempo acabou!" en="Time's up!" />}
            onClose={goToNextStep}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={2}
            type="block"
          />
        ) : (
          <PhaseAnnouncement
            icon={<OpinionsIcon />}
            title={<Translate pt="A avaliação final continua" en="The final assessment continues" />}
            onClose={goToNextStep}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={3}
            type="block"
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
