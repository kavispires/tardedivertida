import { useState } from 'react';
// Hooks
import { useIsUserReady, useAPICall, useLanguage } from '../../hooks';
// Utils
import { ARTE_RUIM_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import { PhaseContainer, StepSwitcher, PhaseAnnouncement, translate } from '../../components';

import StepEvaluation from './StepEvaluation';
import RulesEvaluation from './RulesEvaluation';

function EvaluationPhase({ players, state, info }: PhaseProps) {
  const language = useLanguage();

  const isUserReady = useIsUserReady(players, state);

  const [step, setStep] = useState(0);

  const onSubmitVotingAPIRequest = useAPICall({
    apiFunction: ARTE_RUIM_API.submitAction,
    actionName: 'submit-drawing',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      'Avaliação enviada! Agora aguarde os outros jogadores',
      'Evaluation sent successfully! Wait for the other players',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua avaliação',
      'Oops, the application failed to send your evaluation',
      language
    ),
  });

  const onSubmitVoting = (payload: any) => {
    onSubmitVotingAPIRequest({
      action: 'SUBMIT_VOTING',
      ...payload,
    });
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ARTE_RUIM.EVALUATION}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstruction={translate(
          'Vamos aguardar enquanto os outros jogadores terminam de avaliar!',
          'Please wait while other players finish their evaluations!',
          language
        )}
      >
        {/*Step 0 */}
        <PhaseAnnouncement
          type="evaluate"
          title={translate('Adivinhação', 'Match the Pairs', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <RulesEvaluation />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepEvaluation
          drawings={state.drawings}
          cards={state.cards}
          players={players}
          onSubmitVoting={onSubmitVoting}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default EvaluationPhase;
