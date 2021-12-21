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
  RoundAnnouncement,
  Step,
  StepSwitcher,
  translate,
  Translate,
  WaitingRoom,
} from '../../components/shared';
import StepClueWriting from './StepClueWriting';

function PhaseClueWriting({ players, state, info }) {
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

  const onSubmitClue = (payload) => {
    onSubmitClueAPIRequest({
      action: 'SUBMIT_CLUE',
      clue: payload,
    });
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.CLUE_WRITING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={() => setStep(1)} buttonText=" " time={5} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="writing"
          title={translate('Escreva!', 'Write!', language)}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Você tem uma coordenada específica e única na grade de palavras.
                  <br />
                  Escreva uma dica (palavra única) que conecte as palavras da linha e da coluna assinalada a
                  você.
                  <br />
                  Escreva algo bem simples e óbvio porque se ninguém entender você perderá{' '}
                  {Object.keys(players).length} pontos.
                </>
              }
              en={
                <>
                  You will get an unique coordinate in the word grid.
                  <br />
                  You must write a single word clue that connects the word in the column and in the row of
                  your coordinate.
                  <br />
                  Write something simple and obvious because if nobody gets your clue you will lose{' '}
                  {Object.keys(players).length} points.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepClueWriting user={user} grid={state.grid} onSubmitClue={onSubmitClue} />

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

PhaseClueWriting.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    grid: PropTypes.any,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseClueWriting;
