// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useUser, useLanguage, useStep } from 'hooks';
import { useOnSubmitVoteAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from 'components';
import { StepVoting } from './StepVoting';

function PhaseAssessment({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [accuser, isUserTheAccuser] = useWhichPlayerIsThe('accuserId', state, players);
  const [target, isUserTheTarget] = useWhichPlayerIsThe('targetId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.ASSESSMENT}
      className="e-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="alert"
          title={translate('Acusação!', 'Accusation!')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement e-phase-announcement--alert"
          duration={5}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Alguém foi acusado! Bafo!
                  <br />
                  Apenas se a votação for unanime que o resultado é revelado.
                </>
              }
              en={
                <>
                  Someone was accused! Drama!!!
                  <br />
                  The solution is revealed only if the voting is unanimous.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepVoting
          user={user}
          locations={state.locations}
          players={players}
          onSubmitVote={onSubmitVote}
          accuser={accuser}
          isUserTheAccuser={isUserTheAccuser}
          target={target}
          isUserTheTarget={isUserTheTarget}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseAssessment;
