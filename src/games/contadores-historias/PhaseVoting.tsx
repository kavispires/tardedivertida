// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { ImageCardPreloadHand } from 'components/cards';
import { StepVoting } from './StepVoting';
import { VotingRules } from './components/RulesBlobs';
import { VoteIcon } from 'components/icons/VoteIcon';
import { Translate } from 'components/language';

function PhaseVoting({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.CONTADORES_HISTORIAS.VOTING}
      className="c-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<VoteIcon />}
          title={<Translate pt="Votação" en="Voting" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <VotingRules />
          <ImageCardPreloadHand hand={state.table.map((entry: PlainObject) => entry.cardId)} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepVoting
          players={players}
          user={user}
          story={state.story}
          onSubmitVote={onSubmitVote}
          storyteller={storyteller}
          table={state.table}
          isUserTheStoryTeller={isUserTheStoryTeller}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseVoting;
