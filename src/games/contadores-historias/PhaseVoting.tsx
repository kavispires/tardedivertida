// Hooks
import { useWhichPlayerIsThe, useUser, useLanguage, useStep } from 'hooks';
import { useOnSubmitVoteAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { ImageCardPreloadHand } from 'components/cards';
import { StepVoting } from './StepVoting';
import { VotingRules } from './RulesBlogs';

function PhaseVoting({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);
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
          type="vote"
          title={translate('Votação', 'Voting')}
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
