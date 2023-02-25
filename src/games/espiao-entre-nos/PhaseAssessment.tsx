// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { AlertIcon } from 'icons/AlertIcon';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepVoting } from './StepVoting';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseAssessment({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

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
      <StepSwitcher step={step} conditions={[!user.isReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<AlertIcon />}
          title={<Translate pt="Acusação!" en="Accusation!" />}
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
