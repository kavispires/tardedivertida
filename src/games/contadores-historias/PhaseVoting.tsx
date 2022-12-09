// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitVoteAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { NOOP } from 'utils/constants';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { ImageCardPreloadHand } from 'components/cards';
import { StepVoting } from './StepVoting';
import { VotingRules } from './components/RulesBlobs';
import { VoteIcon } from 'components/icons/VoteIcon';
import { Translate } from 'components/language';

function PhaseVoting({ state, players, info }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<VoteIcon />}
      title={<Translate pt="Votação" en="Voting" />}
      onClose={NOOP}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <VotingRules />
      <ImageCardPreloadHand hand={state.table.map((entry: PlainObject) => entry.cardId)} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.CONTADORES_HISTORIAS.VOTING}
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

        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseVoting;
