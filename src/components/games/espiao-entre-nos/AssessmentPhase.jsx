import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
import { AimOutlined, EnvironmentOutlined } from '@ant-design/icons';
// Hooks
import { useMe, useAPICall, useAmIActive } from '../../../hooks';
// Resources & Utils
import { ESPIAO_ENTRE_NOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import Instruction from '../../shared/Instruction';
import Title from '../../shared/Title';
import Card from '../../cards/EspiaoEntreNosCard';
import List from './List';
import Notes from './Notes';
import AdminTimerControlButton from './AdminTimerControlButton';
import ReadyPlayersBar from '../../shared/ReadyPlayersBar';

function AssessmentPhase({ state, players, info }) {
  const user = useMe(players);
  const amITheTarget = useAmIActive(state, 'target');
  const amITheAccuser = useAmIActive(state, 'accuser');
  const [submittedAction, setSubmitAction] = useState(false);

  const onSubmitVoting = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.submitVoting,
    actionName: 'guess',
    onBeforeCall: () => setSubmitAction(true),
    onError: () => setSubmitAction(false),
    successMessage: 'Voto enviado com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.ASSESSMENT}
      className="e-phase"
    >
      <Title level={2} className="e-phase-title">
        {state.accuser} está acusando {state.target} de ser o espião. Concorda?
      </Title>

      <div>
        {amITheAccuser || amITheTarget ? (
          <Instruction className="e-phase-instruction">
            Você não participa dessa votacão, afinal,{' '}
            {amITheTarget ? 'é você quem está no paredão!' : 'você quem acusou!'}
          </Instruction>
        ) : (
          <Space className="a">
            <Button ghost disabled={submittedAction} onClick={() => onSubmitVoting({ vote: true })}>
              Também acho!
            </Button>
            <Button ghost disabled={submittedAction} onClick={() => onSubmitVoting({ vote: false })}>
              Não é ele(a)
            </Button>
          </Space>
        )}
      </div>

      <Card location={user.location} role={user.role} />

      <ReadyPlayersBar players={players} readyText="Votei" readyTextPlural="Votamos" />

      <Instruction className="e-lists">
        <List header="Suspeitos" headerIcon={<AimOutlined />} items={Object.keys(players)} />
        <List
          header="Possíveis Locais"
          headerIcon={<EnvironmentOutlined />}
          items={state.possibleLocations}
        />
      </Instruction>

      <Notes />

      <AdminTimerControlButton label="Forçar continuar cronômetro" action="resume" />
    </PhaseContainer>
  );
}

AssessmentPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default AssessmentPhase;
