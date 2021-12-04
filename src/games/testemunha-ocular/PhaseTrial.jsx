import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// Hooks
import { useIsUserThe, useWhichPlayerIsThe, useAPICall, useLoading, useLanguage } from '../../hooks';
// Resources & Utils
import { TESTEMUNHA_OCULAR_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  ButtonContainer,
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
import Card from '../../components/cards/Card';
import Avatar from 'antd/lib/avatar/avatar';

function PhaseTrial({ state, players, info }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [step, setStep] = useState(0);

  const witness = useWhichPlayerIsThe('witnessId', state, players);
  const isUserTheWitness = useIsUserThe('witnessId', state);
  const questioner = useWhichPlayerIsThe('questionerId', state, players);
  const isUserTheQuestioner = useIsUserThe('questionerId', state);

  const onEliminateSuspectRequest = useAPICall({
    apiFunction: TESTEMUNHA_OCULAR_API.submitAction,
    actionName: 'eliminate-suspect',
    successMessage: translate(
      'Suspeito eliminado com sucesso',
      'Suspect release submitted successfully',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar eliminar o suspeito',
      'Oops, the application found an error while trying to release the suspect',
      language
    ),
  });

  const onEliminate = (suspectId) => {
    onEliminateSuspectRequest({
      action: 'ELIMINATE_SUSPECT',
      suspectId,
      pass: false,
    });
  };

  const onPass = () => {
    onEliminateSuspectRequest({
      action: 'ELIMINATE_SUSPECT',
      suspectId: '',
      pass: true,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.TRIAL}
      className="t-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="law"
          title={translate('Julgamento', 'Trial', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Precisamos eliminar suspeitos! Para cada pergunta, pelo menos um suspeito tem que se
                  eliminado. Lembre-se que estamos tentando liberar testemunhas. Desvendamos o caso se o
                  último suspeito for o criminoso!
                  <br />
                  <AvatarName player={questioner} addressUser /> está encarregado(a) de selecionar os
                  inocentes.
                </>
              }
              en={
                <>
                  We need to eliminate suspects! For each question we must eliminate at least one suspect.
                  Remember we are trying to release witnesses. We solve the case if the last man (or woman)
                  standing is the perpetrator!
                  <br />
                  <AvatarName player={questioner} /> is in charge of selecting the innocent people.
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
                  <AvatarName player={witness} /> respondeu{' '}
                  {state.testimony ? (
                    <>
                      <Avatar size="large" icon={<CheckOutlined />} style={{ backgroundColor: 'green' }} />{' '}
                      SIM
                    </>
                  ) : (
                    <>
                      <Avatar size="large" icon={<CloseOutlined />} style={{ backgroundColor: 'red' }} /> NÃO
                    </>
                  )}{' '}
                  para a pergunta:
                </>
              }
              en={
                <>
                  <AvatarName player={witness} /> answered{' '}
                  {state.testimony ? (
                    <>
                      <Avatar size="large" icon={<CheckOutlined />} style={{ backgroundColor: 'green' }} />{' '}
                      YES
                    </>
                  ) : (
                    <>
                      <Avatar size="large" icon={<CloseOutlined />} style={{ backgroundColor: 'red' }} /> NO
                    </>
                  )}{' '}
                  for the question:
                </>
              }
            />
            <br />
            <ButtonContainer>
              <Card
                header={translate('O suspeito...', 'The perpetrator...', language)}
                color={state.testimony ? 'green' : 'red'}
              >
                {state.question.question}
              </Card>
            </ButtonContainer>
          </Title>
          {isUserTheQuestioner && (
            <Instruction contained>
              <Translate pt="Clique no suspeito para eliminá-lo" en="Click on a suspect card to release it" />
              <br />
              {Boolean(state?.eliminatedSuspects?.length && isUserTheQuestioner) && (
                <ButtonContainer>
                  <Button type="primary" onClick={onPass} disabled={isLoading}>
                    <Translate
                      pt="Parar de eliminar e ir para a próxima pergunta"
                      en="Stop releasing suspects and go to next question"
                    />
                  </Button>
                </ButtonContainer>
              )}
            </Instruction>
          )}

          <Suspects
            suspects={state.suspects}
            perpetrator={isUserTheWitness ? state.perpetrator : null}
            onCardClick={isUserTheQuestioner ? onEliminate : null}
            eliminatedSuspects={[
              ...(state?.eliminatedSuspects ?? []),
              ...(state?.previouslyEliminatedSuspects ?? []),
            ]}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseTrial.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    eliminatedSuspects: PropTypes.arrayOf(PropTypes.string),
    perpetrator: PropTypes.string,
    phase: PropTypes.string,
    previouslyEliminatedSuspects: PropTypes.arrayOf(PropTypes.string),
    question: PropTypes.shape({
      question: PropTypes.string,
    }),
    round: PropTypes.shape({
      current: PropTypes.number,
    }),
    suspects: PropTypes.arrayOf(PropTypes.string),
    testimony: PropTypes.bool,
  }),
};

export default PhaseTrial;
