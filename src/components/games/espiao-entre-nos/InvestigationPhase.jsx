import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { AimOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { message } from 'antd';
// Hooks
import { useUser, useAPICall, useAmIActive } from '../../../hooks';
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
import PlayerSelect from './PlayerSelect';
import LocationSelect from './LocationSelect';
import Timer from './Timer';
import AdminTimerControlButton from './AdminTimerControlButton';

function InvestigationPhase({ state, players, info }) {
  const user = useUser(players);
  const isSpy = useAmIActive(state, 'currentSpy');

  const onMakeAccusation = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.makeAccusation,
    actionName: 'accuse',
    successMessage: 'Jogador acusado com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar acusar',
  });

  const onGuessLocation = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.guessLocation,
    actionName: 'guess',
    successMessage: 'Chute enviado com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar chutar o local',
  });

  useEffect(() => {
    if (state?.outcome === 'VOTE_FAIL') {
      message.warning(`A votação não foi unânime`, 4);
      message.info(state?.votedYes ? `Votaram sim: ${state?.votedYes}` : 'Ninguém votou sim', 6);
    }

    if (state.timeRemaining > 590000) {
      message.info(`${Object.keys(players)[0]} começa perguntando!`, 3);
    }
  }, []); // eslint-disable-line

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION}
      className="e-phase"
    >
      <div className="e-phase-step-header">
        <div className="e-phase-step-header__timer-container">
          <Timer timeRemaining={state.timeRemaining} />
        </div>

        <div className="e-phase-step-header__center">
          <Title level={2} className="e-phase-title">
            {isSpy ? 'Onde eles estão?' : 'Quem é o Espião?'}
          </Title>
          <Card location={user.location} role={user.role} />
        </div>
      </div>

      {isSpy && <LocationSelect locations={state.possibleLocations} onSend={onGuessLocation} />}

      {!user?.usedAccusation ? (
        <PlayerSelect playersList={Object.keys(players)} onSend={onMakeAccusation} />
      ) : (
        <Instruction className="e-phase-instruction">Você já usou sua chance de acusar</Instruction>
      )}

      <Instruction className="e-lists">
        <List header="Suspeitos" headerIcon={<AimOutlined />} items={Object.keys(players)} />
        <List
          header="Possíveis Locais"
          headerIcon={<EnvironmentOutlined />}
          items={state.possibleLocations}
        />
      </Instruction>

      <Notes />

      <AdminTimerControlButton label="Forçar pausar cronômetro" action="pause" />
    </PhaseContainer>
  );
}

InvestigationPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default InvestigationPhase;
