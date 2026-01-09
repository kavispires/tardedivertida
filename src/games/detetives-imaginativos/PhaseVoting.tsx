// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { VoteIcon } from 'icons/VoteIcon';
// Components
import { Translate } from 'components/language';
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
import { DETETIVES_IMAGINATIVOS_PHASES } from './utils/constants';
import type { PhaseVotingState } from './utils/types';
import { StepVoting } from './StepVoting';

export function PhaseVoting({ state, players, user }: PhaseProps<PhaseVotingState>) {
  const { isLoading } = useLoading();
  const { step } = useStep(0);

  const [, isUserTheLeader] = useWhichPlayerIsThe('leaderId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<VoteIcon />}
      title={
        <Translate
          pt="Votação"
          en="Vote"
        />
      }
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
      phase={state?.phase}
      allowedPhase={DETETIVES_IMAGINATIVOS_PHASES.VOTING}
      className="d-voting-phase"
    >
      <StepSwitcher
        step={step}
        players={players}
      >
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
      </StepSwitcher>
    </PhaseContainer>
  );
}
