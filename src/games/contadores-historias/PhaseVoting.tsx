// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { VoteIcon } from 'icons/VoteIcon';
// Components
import { ImageCardPreloadHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
import { CONTADORES_HISTORIAS_PHASES } from './utils/constants';
import { VotingRules } from './components/RulesBlobs';
import { StepVoting } from './StepVoting';

export function PhaseVoting({ state, players }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<VoteIcon />}
      title={<Translate pt="Votação" en="Voting" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <VotingRules isUserTheStoryTeller={isUserTheStoryTeller} />
      <ImageCardPreloadHand hand={state.table.map((entry: PlainObject) => entry.cardId)} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CONTADORES_HISTORIAS_PHASES.VOTING}
      className="c-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepVoting
          players={players}
          user={user}
          story={state.story}
          onSubmitVote={onSubmitVote}
          storyteller={storyteller}
          table={state.table}
          isUserTheStoryTeller={isUserTheStoryTeller}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
