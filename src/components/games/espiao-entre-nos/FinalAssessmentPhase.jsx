import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Select } from 'antd';
import { AimOutlined, EnvironmentOutlined } from '@ant-design/icons';
// Hooks
import { useUser, useAPICall } from '../../../hooks';
// Resources & Utils
import { ESPIAO_ENTRE_NOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { AdminOnly, Instruction, PhaseContainer, Title } from '../../shared';
import Card from '../../cards/EspiaoEntreNosCard';
import List from './List';
import Notes from './Notes';

function FinalAssessmentPhase({ state, players, info }) {
  const user = useUser(players);
  const [accuser, setAccuser] = useState(null);
  const [target, setTarget] = useState(null);

  const onAdminControl = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.handleAdminAction,
    actionName: 'admin-control',
    successMessage: 'Admin action com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar ação',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT}
      className="e-phase"
    >
      <Title level={2} className="e-phase-title">
        Última Chance!
      </Title>

      <Instruction className="e-phase-instruction">
        Já que vocês falharam em encontrar o espião, há uma última possibilidade!
        <ul>
          <li>
            Um jogador de cada vez e começando por {state?.playerOrder[0]}, cada jogador faz uma acusação em
            voz alta.
          </li>
          <li>Os outros jogadores votam também em voz alta (menos o acusado, claro)</li>
          <li>Se a votação for unânime, o admnistrador vai enviar o voto para o servidor</li>
          <li>Sem discussão dessa vez, simplesmente acuse alguém! Não temos mais tempo!</li>
          <li>Siga essa ordem: {state?.playerOrder.join(', ')}</li>
        </ul>
      </Instruction>

      <Card location={user.location} role={user.role} />

      <Instruction className="e-lists">
        <List header="Suspeitos" headerIcon={<AimOutlined />} items={Object.keys(players)} />
        <List
          header="Possíveis Locais"
          headerIcon={<EnvironmentOutlined />}
          items={state.possibleLocations}
        />
      </Instruction>

      <Notes />

      <AdminOnly className="e-admin-final-assessment">
        <span>Acusador:</span>
        <Select onChange={setAccuser} className="e-select" placeholder="Acusador">
          {Object.keys(players).map((playerName) => (
            <Select.Option key={playerName} value={playerName}>
              {playerName}
            </Select.Option>
          ))}
        </Select>
        <span>Acusado:</span>
        <Select onChange={setTarget} className="e-select" placeholder="Acusado">
          {Object.keys(players).map((playerName) => (
            <Select.Option key={playerName} value={playerName}>
              {playerName}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          disabled={!accuser || !target || accuser === target}
          onClick={() =>
            onAdminControl({
              action: {
                accuser,
                target,
              },
            })
          }
        >
          Enviar decisão final
        </Button>
      </AdminOnly>
    </PhaseContainer>
  );
}

FinalAssessmentPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default FinalAssessmentPhase;
