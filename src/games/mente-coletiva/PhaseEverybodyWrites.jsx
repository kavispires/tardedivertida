import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAPICall, useLanguage, useUser } from '../../hooks';
// Resources & Utils
import { MENTE_COLETIVA_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  WaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../components/shared';
import AnsweringStep from './AnsweringStep';

function PhaseEverybodyWrites({ state, players, info }) {
  const language = useLanguage();
  const [step, setStep] = useState(0);
  const user = useUser(players);

  const onSubmitAnswersAPIRequest = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'submit-answers',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Respostas enviadas com sucesso!', 'Answers send successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar respostas',
      'Oops, the application failed to submit answers',
      language
    ),
  });

  const onSubmitAnswers = (payload) => {
    onSubmitAnswersAPIRequest({
      action: 'SUBMIT_ANSWERS',
      ...payload,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.MENTE_COLETIVA.EVERYBODY_WRITES}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="writing"
          title={translate('Todos Respondem', 'Everybody Writes', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 20 : undefined}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Agora é hora de responder!
                  <br />
                  Pense em respostas comuns que fará com que você responda igual a outros jogadores.
                  <br />
                  Você ganha 1 ponto para cada uma de suas respostas + 1 ponto para cada resposta igual a de
                  outro jogador (1 ponto por jogador).
                  <br />
                  Por exemplo, se 3 jogadores escreveram 'bola', são 3 pontos para cada.
                </>
              }
              en={
                <>
                  It's time to answer!
                  <br />
                  Think of common answers that will help you match the largest number of players.
                  <br />
                  You get 1 point for each of your answers PLUS 1 point for each match with other players.
                  <br />
                  For example, if 3 players write 'chicken', each of those players get 3 points.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <AnsweringStep
            currentQuestion={state.currentQuestion}
            players={players}
            roundType={state.roundType}
            onSubmitAnswers={onSubmitAnswers}
            user={user}
          />
        </Step>

        {/* Step 2 */}
        <Step fullWidth>
          <WaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseEverybodyWrites.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseEverybodyWrites;
