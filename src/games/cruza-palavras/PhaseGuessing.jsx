import PropTypes from 'prop-types';
import React, { useState } from 'react';
// State & Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CRUZA_PALAVRAS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  translate,
  Translate,
  WaitingRoom,
} from '../../components/shared';
import StepGuessing from './StepGuessing';

function PhaseGuessing({ players, state, info }) {
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

  const onSubmitGuesses = (payload) => {
    onSubmitGuessesAPIRequest({
      action: 'SUBMIT_GUESSES',
      guesses: payload,
    });
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.GUESSING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]}>
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

        {/* Step 2 */}
        <StepGuessing user={user} grid={state.grid} clues={state.clues} onSubmitGuesses={onSubmitGuesses} />

        {/* Step 3 */}
        <Step fullWidth>
          <WaitingRoom
            players={players}
            title={translate('Pronto!', 'Done!', language)}
            instruction={translate(
              'Vamos aguardar enquanto os outros jogadores terminam!',
              'Please wait while other players finish!',
              language
            )}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseGuessing.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    clues: PropTypes.any,
    grid: PropTypes.any,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseGuessing;
