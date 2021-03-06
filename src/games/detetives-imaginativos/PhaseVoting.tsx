// Hooks
import { useUser, useLoading, useLanguage, useWhichPlayerIsThe, useStep } from 'hooks';
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepVoting } from './StepVoting';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { VoteIcon } from 'components/icons/VoteIcon';

function PhaseVoting({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const { step, goToNextStep } = useStep(0);
  const user = useUser(players);
  const [, isUserTheLeader] = useWhichPlayerIsThe('leaderId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest();

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.VOTING}
      className="d-voting-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<VoteIcon />}
          title={translate('Votação', 'Vote')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Agora você vota! Escolha o jogador que você acredita ser o impostor. Você pode discutir com
                  os outros antes de votar, porque uma vez votado, você não pode mudar. O impostor só pede se
                  duas pessoas votarem nele.
                </>
              }
              en={
                <>
                  Now it's time to vote! Vote for the player you think is the impostor. You can discuss before
                  you vote because you can't change your vote. The impostor only loses if at least two people
                  voted for them.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepVoting
          players={players}
          leaderId={state.leaderId}
          user={user}
          onVote={onSubmitVote}
          isLoading={isLoading}
          isUserTheLeader={isUserTheLeader}
          table={state.table}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseVoting;
