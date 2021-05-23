import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
// Hooks
import { useAmIReady, useMe, useAmIActive } from '../../../hooks';
// Resources & Utils
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import RoundAnnouncement from '../../shared/RoundAnnouncement';
import Instruction from '../../shared/Instruction';
import StepSwitcher from '../../shared/StepSwitcher';

import Title from '../../shared/Title';
import Card from '../../cards/EspiaoEntreNosCard';
import { EnvironmentOutlined } from '@ant-design/icons';
import List from './List';
import Notes from './Notes';
import AdminTimerControlButton from './AdminTimerControlButton';

function AssignmentPhase({ state, players, info }) {
  const amIReady = useAmIReady(players, state);
  const user = useMe(players);
  const isSpy = useAmIActive(state, 'currentSpy');
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT}
      className="e-phase"
    >
      <StepSwitcher step={step} conditions={[!amIReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={5}>
          <Instruction className="e-phase-instruction">Há um espião entre nós!</Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <div className="e-phase-step">
          <Title level={2} className="e-phase-title">
            Você está no(a)...
          </Title>

          <Card location={user.location} role={user.role} />

          <AdminTimerControlButton label="Começar cronômetro" action="start" />

          <Instruction className="e-phase-instruction">
            {isSpy
              ? 'Você tem 10 minutos para descobrir onde os outros agentes estão! Pronto?'
              : 'Você tem 10 minutos para descobrir quem é o espião entre nós! Pronto?'}
          </Instruction>

          <Instruction className="e-lists">
            <List
              header="Possíveis Locais"
              headerIcon={<EnvironmentOutlined />}
              items={state.possibleLocations}
            />
          </Instruction>
          <Notes />
        </div>
      </StepSwitcher>
    </PhaseContainer>
  );
}

AssignmentPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default AssignmentPhase;
