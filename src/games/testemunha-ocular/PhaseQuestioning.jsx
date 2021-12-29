import { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Avatar, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
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
import { Suspects } from './Suspects';
import { Card } from '../../components';

function PhaseQuestioning({ state, players, info }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [step, setStep] = useState(0);
  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onAnswerRequest = useAPICall({
    apiFunction: TESTEMUNHA_OCULAR_API.submitAction,
    actionName: 'testimony',
    successMessage: translate('Testemunho enviada com sucesso', 'Testimony submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu testemunho',
      'Oops, the application found an error while trying to send your testimony',
      language
    ),
  });

  const onAnswer = (testimony) => {
    onAnswerRequest({
      action: 'GIVE_TESTIMONY',
      testimony,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.QUESTIONING}
      className="t-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="eye"
          title={translate('Questionamento', 'Questioning', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Nossa testemunha só sabe julgar por aparência.
                  <br />
                  <AvatarName player={witness} />, é hora de nos ajudar a pegar esse criminoso hediondo.
                </>
              }
              en={
                <>
                  Our witness loves to judge the book by its cover.
                  <br />
                  <AvatarName player={witness} />, it's time to help us find this heinous perpetrator!
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step key={1}>
          <Title level={3}>
            <Translate
              pt={
                <>
                  Testemunha <AvatarName player={witness} />, responda:
                </>
              }
              en={
                <>
                  Witness <AvatarName player={witness} />, please answer:
                </>
              }
            />
            <br />
            <div className="t-questioning-answer-grid">
              {isUserTheWitness ? (
                <Button
                  type="text"
                  size="large"
                  onClick={() => onAnswer(false)}
                  className="t-questioning-answer-grid__button t-questioning-answer-grid__button--no"
                  disabled={!isUserTheWitness || isLoading}
                >
                  <span className="t-questioning-answer-grid__answer">
                    <Translate pt="Não" en="No" />
                  </span>
                  <Avatar size="large" icon={<CloseOutlined />} style={{ backgroundColor: 'red' }} />
                </Button>
              ) : (
                <div></div>
              )}

              <Card
                header={translate('O suspeito...', 'The perpetrator...', language)}
                randomColor
                className="t-card"
              >
                {state.question.question}
              </Card>
              {isUserTheWitness ? (
                <Button
                  type="text"
                  size="large"
                  onClick={() => onAnswer(true)}
                  className="t-questioning-answer-grid__button t-questioning-answer-grid__button--no"
                  disabled={!isUserTheWitness || isLoading}
                >
                  <Avatar size="large" icon={<CheckOutlined />} style={{ backgroundColor: 'green' }} />
                  <span className="t-questioning-answer-grid__answer">
                    <Translate pt="Sim" en="Yes" />
                  </span>
                </Button>
              ) : (
                <div></div>
              )}
            </div>
          </Title>

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

PhaseQuestioning.propTypes = {
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
    question: PropTypes.shape({
      question: PropTypes.string,
    }),
    round: PropTypes.shape({
      current: PropTypes.number,
    }),
    suspects: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default PhaseQuestioning;
