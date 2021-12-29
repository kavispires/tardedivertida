import { useState } from 'react';
// Hooks
import { useWhichPlayerIsThe, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CONTADORES_HISTORIAS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  ImageCardPreloadHand,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  translate,
} from '../../components';
import StepVoting from './StepVoting';
import { VotingRules } from './RulesBlogs';

function PhaseVoting({ state, players, info }: PhaseProps) {
  const language = useLanguage();
  const user = useUser(players);
  const [storyteller] = useWhichPlayerIsThe('storytellerId', state, players);
  const [step, setStep] = useState(0);

  const onSubmitVote = useAPICall({
    apiFunction: CONTADORES_HISTORIAS_API.submitAction,
    actionName: 'submit-vote',
    onError: () => setStep(1),
    successMessage: translate('Voto submetido com sucesso', 'Vote submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      'Oops, the application found an error while trying to submit your card',
      language
    ),
  });

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
          title={translate('Votação', 'Voting', language)}
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
