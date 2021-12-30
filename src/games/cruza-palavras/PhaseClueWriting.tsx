import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CRUZA_PALAVRAS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  translate,
} from '../../components';
import StepClueWriting from './StepClueWriting';
import { WritingCluesRule } from './RulesBlobs';

function PhaseClueWriting({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onSubmitClueAPIRequest = useAPICall({
    apiFunction: CRUZA_PALAVRAS_API.submitAction,
    actionName: 'submit-clue',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Dica enviada com sucesso', 'Clue submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua dica',
      'Oops, the application failed to send your clue',
      language
    ),
  });

  const onSubmitClue = (payload: string) => {
    onSubmitClueAPIRequest({
      action: 'SUBMIT_CLUE',
      clue: payload.trim().toLowerCase(),
    });
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.CLUE_WRITING}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstruction={translate(
          'Vamos aguardar enquanto os outros jogadores terminam!',
          'Please wait while other players finish!',
          language
        )}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={() => setStep(1)} buttonText=" " time={5} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="writing"
          title={translate('Escreva!', 'Write!', language)}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
        >
          <WritingCluesRule playerCount={Object.keys(players).length} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepClueWriting user={user} grid={state.grid} onSubmitClue={onSubmitClue} players={players} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseClueWriting;
