import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CRUZA_PALAVRAS_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  translate,
  Translate,
} from '../../components';
import StepGuessing from './StepGuessing';

function PhaseGuessing({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onSubmitGuessesAPIRequest = useAPICall({
    apiFunction: CRUZA_PALAVRAS_API.submitAction,
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

  const onSubmitGuesses = (payload: any) => {
    onSubmitGuessesAPIRequest({
      action: 'SUBMIT_GUESSES',
      guesses: payload,
    });
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.GUESSING}>
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
          title={translate('Match!', 'Combine!', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Agora combine as dicas de cada jogador com as coordenadas corretas!
                  <br />
                  Basta clicar em uma das dicas no topo e então em uma das células da grade.
                </>
              }
              en={
                <>
                  Now match the clues from each player with the correct coordinates
                  <br />
                  Just click on one of the clues on top then in one of the cells in the grid.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGuessing
          user={user}
          grid={state.grid}
          clues={state.clues}
          onSubmitGuesses={onSubmitGuesses}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuessing;
