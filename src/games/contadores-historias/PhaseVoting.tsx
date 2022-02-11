import { useState } from 'react';
// Hooks
import { useWhichPlayerIsThe, useUser, useLanguage } from '../../hooks';
import { useOnSubmitVoteAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  ImageCardPreloadHand,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
} from '../../components';
import { StepVoting } from './StepVoting';
import { VotingRules } from './RulesBlogs';

function PhaseVoting({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const user = useUser(players);
  const [storyteller] = useWhichPlayerIsThe('storytellerId', state, players);
  const [step, setStep] = useState(0);

  const onSubmitVote = useOnSubmitVoteAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.CONTADORES_HISTORIAS.VOTING}
      className="c-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="vote"
          title={translate('Votação', 'Voting')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <VotingRules />
          <ImageCardPreloadHand hand={state.table.map((entry: PlainObject) => entry.cardId)} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <StepVoting
            players={players}
            user={user}
            story={state.story}
            onSubmitVote={onSubmitVote}
            storyteller={storyteller}
            table={state.table}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseVoting;
