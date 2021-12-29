import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAPICall, useLanguage } from '../../hooks';
// Resources & Utils
import { POLEMICA_DA_VEZ_API } from '../../adapters';
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
import LikingStep from './LikingStep';

function PhaseReact({ state, players, info }) {
  const language = useLanguage();
  const [step, setStep] = useState(0);

  const onSubmitReactionAPIRequest = useAPICall({
    apiFunction: POLEMICA_DA_VEZ_API.submitAction,
    actionName: 'submit-topic',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Respostas enviada com sucesso!', 'Answers send successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas respostas',
      'Oops, the application failed to submit your answers',
      language
    ),
  });

  const onSubmitReaction = (payload) => {
    onSubmitReactionAPIRequest({
      action: 'SUBMIT_REACTION',
      ...payload,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.POLEMICA_DA_VEZ.REACT}
      className="p-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="feedback"
          title={translate('Qual a polêmica da vez?', "What's trending now?", language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 30 : undefined}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Um assunto polêmico está abalando as redes sociais!
                  <br />
                  Curta (ou não) e tente descobrir quantas curtidas ele vai receber.
                </>
              }
              en={
                <>
                  A topic is trending in all social media!
                  <br />
                  Like (or not) and try to guess how many likes it will get!
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <LikingStep
            currentTopic={state.currentTopic}
            customTopic={state.customTopic}
            onSubmitReaction={onSubmitReaction}
            players={players}
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

PhaseReact.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    currentTopic: PropTypes.object,
    customTopic: PropTypes.string,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseReact;
