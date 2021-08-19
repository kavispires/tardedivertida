import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAPICall, useLanguage, useWhichPlayerIsThe, useIsUserThe } from '../../../hooks';
// Resources & Utils
import { MENTE_COLETIVA_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
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
} from '../../shared';

import { AvatarName } from '../../avatars';
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
      'Oops, the application fail to submit the question',
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
          type="default"
          title={translate('O Pasto Superlotado', 'A Overcroweded Pasture', language)}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 40 : 10}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Somos todos ovelhinhas e nosso pasto está superlotado! Precisamos decidir quem deve sair.
                  <br />
                  Vamos fazer uma pergunta e quem receber o menor número de pontos move uma seção para a
                  direita. Chega de inclusão!
                  <br />
                  Se você já está na última seção e tiver que mover pra direita, você cai no precipício e
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
                  Let's ask a question and whoever gets the fewest points moves one section to the right.
                  Enough with inclusion!
                  <br />
                  If you are already in the last section and have to move to the right, you fall off the cliff
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
