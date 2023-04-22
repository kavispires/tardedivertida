// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { VoteIcon } from 'icons/VoteIcon';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepVoting } from './StepVoting';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';

function PhaseVoting({ state, players, info }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step } = useStep(0);
  const user = useUser(players, state);
  const [, isUserTheLeader] = useWhichPlayerIsThe('leaderId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<VoteIcon />}
      title={<Translate pt="Votação" en="Vote" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Agora você vota! Escolha o jogador que você acredita ser o impostor. Você pode discutir com os
              outros antes de votar, porque uma vez votado, você não pode mudar. O impostor só pede se
              <PlayersHighlight>2+</PlayersHighlight> pessoas votarem nele.
            </>
          }
          en={
            <>
              Now it's time to vote! Vote for the player you think is the impostor. You can discuss before you
              vote because you can't change your vote. The impostor only loses if at least{' '}
              <PlayersHighlight>2+</PlayersHighlight> people voted for them.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.VOTING}
      className="d-voting-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepVoting
          players={players}
          leaderId={state.leaderId}
          user={user}
          onVote={onSubmitVote}
          isLoading={isLoading}
          isUserTheLeader={isUserTheLeader}
          table={state.table}
          announcement={announcement}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseVoting;
