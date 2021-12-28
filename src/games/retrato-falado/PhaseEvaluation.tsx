import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useAPICall, useLanguage, useWhichPlayerIsThe, useUser } from '../../hooks';
// Resources & Utils
import { RETRATO_FALADO_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  DefaultWaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  translate,
  Translate,
} from '../../components';
import StepVote from './StepVote';

function PhaseEvaluation({ players, state, info }: PhaseProps) {
  const language = useLanguage();
  const user = useUser(players);

  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const [, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitVoteAPIRequest = useAPICall({
    apiFunction: RETRATO_FALADO_API.submitAction,
    actionName: 'submit-vote',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Voto enviado com sucesso', 'Vote submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      'Oops, the application failed to send your vote',
      language
    ),
  });

  const onSubmitVote = (payload: any) => {
    onSubmitVoteAPIRequest({
      action: 'SUBMIT_VOTE',
      ...payload,
    });
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.EVALUATION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="choice"
          title={translate('Vote!', 'Vote!', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={<>Vote no desenho que você acha que mais parece com o mostro meliante.</>}
              en={<>Vote for the sketch that best represents the monster.</>}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepVote
          isUserTheWitness={isUserTheWitness}
          currentMonster={state.currentMonster}
          sketches={state.sketches}
          onSubmitVote={onSubmitVote}
          user={user}
          players={players}
        />

        {/* Step 2 */}
        <Step fullWidth>
          <DefaultWaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseEvaluation;
