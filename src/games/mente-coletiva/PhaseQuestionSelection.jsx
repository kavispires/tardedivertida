import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAPICall, useLanguage, useWhichPlayerIsThe, useIsUserThe } from '../../hooks';
// Resources & Utils
import { MENTE_COLETIVA_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  DefaultWaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  translate,
  ViewIf,
} from '../../components/shared';

import { AvatarName } from '../../components/avatars';
import QuestionSelectionWaiting from './QuestionSelectionWaiting';
import QuestionSelection from './QuestionSelection';

function PhaseQuestionSelection({ state, players, info }) {
  const language = useLanguage();
  const activePlayer = useWhichPlayerIsThe('activePlayer', state, players);
  const isUserTheActivePlayer = useIsUserThe('activePlayer', state);
  const [step, setStep] = useState(0);

  const onSubmitQuestionAPIRequest = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'submit-question',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Pergunta enviada com sucesso!', 'Question send successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a pergunta',
      'Oops, the application failed to submit the question',
      language
    ),
  });

  const onSubmitQuestion = (payload) => {
    onSubmitQuestionAPIRequest({
      action: 'SUBMIT_QUESTION',
      ...payload,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.MENTE_COLETIVA.QUESTION_SELECTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={3}>
          <Instruction contained>
            <Translate
              pt="Somos ovelhinhas e nosso pasto está superlotado!"
              en="We are sheep and our pasture is overcrowded!"
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="sheep"
          title={translate('O Pasto Superlotado', 'A Overcroweded Pasture', language)}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 40 : 10}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Precisamos reduzir essa população! Vamos fazer uma pergunta em que todos tem que escrever
                  uma certa quantidade de respostas. Você ganha um ponto para cada resposta igual a de outra
                  ovelha. Quem receber o menor número de pontos move uma seção para a direita.
                  <br />
                  Se você já está no último pasto e tiver que mover pra direita, você cai no precipício e
                  morre. O pasto fica menos lotado e todos mais felizes.
                  <br />
                  <Instruction contained>
                    <AvatarName player={activePlayer} /> escolherá uma pergunta para essa rodada.
                  </Instruction>
                </>
              }
              en={
                <>
                  We are sheep and our pasture is overcrowded! We need to decide who should leave.
                  <br />
                  Let's ask a question and everyone has to give a certain number of answers. You are trying to
                  match answers with other sheep to get points. Whoever gets the fewest points moves one
                  section to the right.
                  <br />
                  If you are already in the last pasture and have to move to the right, you fall off the cliff
                  and die. The pasture is less crowded and everyone is happier.
                  <br />
                  <Instruction contained>
                    <AvatarName player={activePlayer} /> will choose a question for this round.
                  </Instruction>
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <Step fullWidth>
          <ViewIf isVisible={isUserTheActivePlayer}>
            <QuestionSelection
              players={players}
              currentQuestions={state.currentQuestions}
              onSubmitQuestion={onSubmitQuestion}
              roundType={state.roundType}
            />
          </ViewIf>

          <ViewIf isVisible={!isUserTheActivePlayer}>
            <QuestionSelectionWaiting
              activePlayer={activePlayer}
              players={players}
              roundType={state.roundType}
            />
          </ViewIf>
        </Step>

        {/* Step 3 */}
        <Step fullWidth>
          <DefaultWaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseQuestionSelection.propTypes = {
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

export default PhaseQuestionSelection;
