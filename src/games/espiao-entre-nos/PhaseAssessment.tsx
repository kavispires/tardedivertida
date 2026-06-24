// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { AlertIcon } from '@icons/AlertIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
import { ESPIAO_ENTRE_NOS_PHASES } from './utils/constants';
import { StepVoting } from './StepVoting';

export function PhaseAssessment({ state, players, user }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);

  const [accuser, isUserTheAccuser] = useWhichPlayerIsThe('accuserId', state, players);
  const [target, isUserTheTarget] = useWhichPlayerIsThe('targetId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ESPIAO_ENTRE_NOS_PHASES.ASSESSMENT}
      className="e-phase"
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<AlertIcon />}
          title={
            <Translate
              pt="Acusação!"
              en="Accusation!"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement e-phase-announcement--alert"
          duration={5}
          type="block"
        >
          <Surface>
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
          </Surface>
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
