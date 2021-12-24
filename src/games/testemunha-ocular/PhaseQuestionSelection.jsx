import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useWhichPlayerIsThe, useAPICall, useLoading, useLanguage } from '../../hooks';
// Resources & Utils
import { TESTEMUNHA_OCULAR_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Title,
  Translate,
  translate,
} from '../../components/shared';
import { AvatarName } from '../../components/avatars';
import { LoadingClock } from '../../components/icons';
import { Suspects } from './Suspects';
import { SelectQuestion } from './SelectQuestion';

function PhaseQuestionSelection({ state, players, info }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [step, setStep] = useState(0);

  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);
  const [questioner, isUserTheQuestioner] = useWhichPlayerIsThe('questionerId', state, players);

  const onSelectQuestionCall = useAPICall({
    apiFunction: TESTEMUNHA_OCULAR_API.submitAction,
    actionName: 'select-question',
    successMessage: translate('Pergunta enviada com sucesso', 'Question submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar pergunta',
      'Oops, the application found an error while trying to submit question',
      language
    ),
  });

  const onSelectQuestion = (questionId) => {
    onSelectQuestionCall({
      action: 'SELECT_QUESTION',
      questionId,
    });
  };

  const roundsLeft = (state?.round?.total ?? 0) - (state?.round?.current ?? 0) || 11;

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.QUESTION_SELECTION}
      className="t-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="investigation"
          title={translate('Seleção da Pergunta', 'Question Selection', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Agora que encontramos nossa testemunha (<AvatarName player={witness} />) é hora de
                  questioná-la.
                  <br />
                  Só temos tempo para {roundsLeft} perguntas. Portanto, <AvatarName player={questioner} />,
                  escolha a pergunta certa.
                </>
              }
              en={
                <>
                  Now that we have a Witness (<AvatarName player={witness} />
                  ), it's time to choose the question to ask them.
                  <br />
                  We can only have time for {roundsLeft} questions. So <AvatarName player={questioner} />,
                  choose a question
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step key={1}>
          {isUserTheQuestioner ? (
            <SelectQuestion
              questions={state.questions}
              onSelectQuestion={onSelectQuestion}
              isLoading={isLoading}
            />
          ) : (
            <div>
              <Title level={3}>
                <LoadingClock />
                <br />
                <Translate
                  pt={
                    <>
                      Examine os suspeitos enquanto <AvatarName player={questioner} /> escolhe uma pergunta
                    </>
                  }
                  en={
                    <>
                      Examine the suspects while <AvatarName player={questioner} /> chooses a question.
                    </>
                  }
                />
              </Title>
            </div>
          )}
          {isUserTheWitness && (
            <Instruction contained>
              <Translate
                pt="O crimimoso que você viu está marcado com borda amarela"
                en="The criminal you saw is highlighted in yellow"
              />
            </Instruction>
          )}
          <Suspects
            suspects={state.suspects}
            perpetrator={isUserTheWitness ? state.perpetrator : null}
            eliminatedSuspects={state?.previouslyEliminatedSuspects}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseQuestionSelection.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    perpetrator: PropTypes.shape({
      id: PropTypes.string,
      pt: PropTypes.string,
      en: PropTypes.string,
      gender: PropTypes.string,
    }),
    phase: PropTypes.string,
    previouslyEliminatedSuspects: PropTypes.arrayOf(PropTypes.string),
    questions: PropTypes.any,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
    suspects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        pt: PropTypes.string,
        en: PropTypes.string,
        gender: PropTypes.string,
      })
    ),
  }),
};

export default PhaseQuestionSelection;
