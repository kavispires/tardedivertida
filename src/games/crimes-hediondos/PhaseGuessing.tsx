import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CRIMES_HEDIONDOS_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher, translate } from '../../components';
import { GuessMessage } from './RulesBlobs';
import { StepGuessing } from './StepGuessing';

function PhaseGuessing({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onSubmitGuessesAPIRequest = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
    actionName: 'submit-guesses',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Respostas enviadas com sucesso', 'Guesses submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas respostas',
      'Oops, the application failed to send your guesses',
      language
    ),
  });

  const onSubmitGuesses = (payload: PlainObject) => {
    onSubmitGuessesAPIRequest({
      action: 'SUBMIT_GUESSES',
      guesses: payload,
    });
  };

  const increaseStep = () => setStep((s: number) => ++s);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.GUESSING}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstruction={translate(
          'Vamos aguardar enquanto os outros jogadores terminam!',
          'Please wait while other players finish!',
          language
        )}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          type="guess"
          title={translate('Tente Adivinhar', 'Try to guess', language)}
          onClose={increaseStep}
          currentRound={state?.round?.current}
        >
          <GuessMessage />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGuessing
          user={user}
          groupedItems={state.groupedItems}
          items={state.items}
          players={players}
          scenes={state.scenes}
          scenesOrder={state.scenesOrder}
          crimes={state.crimes}
          onSubmitGuesses={onSubmitGuesses}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuessing;
