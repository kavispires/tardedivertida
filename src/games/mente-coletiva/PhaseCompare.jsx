import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAPICall, useLanguage, useUser } from '../../hooks';
// Resources & Utils
import { MENTE_COLETIVA_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  DefaultWaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../components/shared';
import { CompareStep } from './CompareStep';

function PhaseCompare({ state, players, info }) {
  const language = useLanguage();
  const [step, setStep] = useState(0);
  const user = useUser(players);

  const onAddAnswerAPIRequest = useAPICall({
    apiFunction: MENTE_COLETIVA_API.updateAction,
    actionName: 'add-answer',
    successMessage: translate('Resposta adicionada com sucesso!', 'Answer added successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar adicionar respostar',
      'Oops, the application fail to add answer',
      language
    ),
  });

  const onNextQuestionAPIRequest = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'next-answers',
    successMessage: translate(
      'Próximas respostas acionadas com sucesso!',
      'Next answers triggered successfully!',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar avançar',
      'Oops, the application fail to advance',
      language
    ),
  });

  const onAddAnswer = (answer) => {
    onAddAnswerAPIRequest({
      action: 'ADD_ANSWER',
      answer,
    });
  };

  const onNextAnswer = (allowedList) => {
    onNextQuestionAPIRequest({
      action: 'NEXT_ANSWERS',
      allowedList,
    });
  };

  const answerGroup = state.answersList[0];

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.MENTE_COLETIVA.COMPARE}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="default"
          title={translate('Respostas', 'Respostas', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 20 : undefined}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Hora de comparar respostas!
                  <br />
                  O jogo agrupará todas as respostas iguais, mas agora vocês tem a chance de adicionar
                  palavras que o jogo não agrupou por conta de erro gramatical, acento ou plural.
                  <br />
                  Lembre-se gêneros são considerados diferentes <code>príncipe ≠ princesa</code>, assim como
                  geral vs específico <code>caminhão ≠ caminhão de mudança</code>.
                </>
              }
              en={
                <>
                  Time to compare answers!
                  <br />
                  The game will group all identical answers, but now the group has a chance to add answers
                  that it missed because of typo, accents, or pluralization.
                  <br />
                  Remember that genders are considered different <code>prince ≠ princess</code>, as well as
                  general vs specific <code>truck ≠ fire truck</code>.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <CompareStep
          currentQuestion={state.currentQuestion}
          answerGroup={answerGroup}
          players={players}
          user={user}
          allAnswers={state.allAnswers}
          onAddAnswer={onAddAnswer}
          onNextAnswer={onNextAnswer}
          remainingGroupsCount={state.answersList.length}
        />

        {/* Step 2 */}
        <Step fullWidth>
          <DefaultWaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseCompare.propTypes = {
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

export default PhaseCompare;
