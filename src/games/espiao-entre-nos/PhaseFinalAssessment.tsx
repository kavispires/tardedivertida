// Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
import { useOnMakeAccusationAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepFinalAssessment } from './StepFinalAssessment';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { PeopleAssessmentIcon } from 'components/icons/PeopleAssessmentIcon';
import { OpinionsIcon } from 'components/icons/OpinionsIcon';

function PhaseFinalAssessment({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const isUserReady = useIsUserReady(players, state);
  const user = useUser(players);

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
            icon={<PeopleAssessmentIcon />}
            title={translate('O tempo acabou!', "Time's up!")}
            onClose={goToNextStep}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={2}
          />
        ) : (
          <PhaseAnnouncement
            icon={<OpinionsIcon />}
            title={translate('A avaliação final continua', 'The final assessment continues')}
            onClose={goToNextStep}
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
