import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useUser, useAPICall, useIsUserThe } from '../../../hooks';
// Resources & Utils
import { ESPIAO_ENTRE_NOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { Instruction, PhaseContainer, ReadyPlayersBar, Title } from '../../shared';
import Card from '../../cards/EspiaoEntreNosCard';
import Notes from './Notes';
import AdminTimerControlButton from './AdminTimerControlButton';
import SuspectsList from './SuspectsList';
import EmergencyAlert from './EmergencyAlert';
import LocationsList from './LocationsList';

function AssessmentPhase({ state, players, info }) {
  const user = useUser(players);
  const isUserTheTarget = useIsUserThe('target', state);
  const isUserTheAccuser = useIsUserThe('accuser', state);
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

      {!state?.finalAssessment && <EmergencyAlert />}

      <div>
        {isUserTheAccuser || isUserTheTarget ? (
          <Instruction className="e-phase-instruction">
            Você não participa dessa votacão, afinal,{' '}
            {isUserTheTarget ? 'é você quem está no paredão!' : 'você quem acusou!'}
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
        <SuspectsList players={players} />
        <LocationsList locations={state.possibleLocations} />
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
