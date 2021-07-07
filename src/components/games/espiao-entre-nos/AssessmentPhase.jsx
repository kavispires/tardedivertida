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
import { Instruction, PhaseContainer, ReadyPlayersBar, Title, View, ViewSwitch } from '../../shared';
import { EspiaoEntreNosCard as Card } from '../../cards';
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

      <ViewSwitch cases={[isUserTheAccuser, isUserTheTarget, true]}>
        <View key="accuser">
          <Instruction className="e-phase-instruction">
            Você não participa dessa votacão, afinal, você quem acusou!
          </Instruction>
        </View>

        <View key="target">
          <Instruction className="e-phase-instruction">
            Você não participa dessa votacão, afinal, é você quem está no paredão!
          </Instruction>
        </View>

        <View key="others">
          <Space>
            <Button ghost disabled={submittedAction} onClick={() => onSubmitVoting({ vote: true })}>
              Também acho!
            </Button>
            <Button ghost disabled={submittedAction} onClick={() => onSubmitVoting({ vote: false })}>
              Não é ele(a)
            </Button>
          </Space>
        </View>
      </ViewSwitch>

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
