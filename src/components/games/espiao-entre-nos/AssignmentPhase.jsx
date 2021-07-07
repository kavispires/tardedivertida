import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
// Hooks
import { useIsUserReady, useUser, useIsUserThe } from '../../../hooks';
// Resources & Utils
import { PHASES } from '../../../utils/constants';
// Components
import { Instruction, PhaseContainer, RoundAnnouncement, StepSwitcher, Title } from '../../shared';
import { EspiaoEntreNosCard as Card } from '../../cards';
import Notes from './Notes';
import AdminTimerControlButton from './AdminTimerControlButton';
import LocationsList from './LocationsList';

function AssignmentPhase({ state, players, info }) {
  const isUserReady = useIsUserReady(players, state);
  const user = useUser(players);
  const isUserTheSpy = useIsUserThe('currentSpy', state);
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT}
      className="e-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={() => setStep(1)}
          time={5}
          className="e-round-announcement"
        >
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
            {isUserTheSpy
              ? 'Você terá 10 minutos para descobrir onde os outros agentes estão! Pronto?'
              : 'Você terá 10 minutos para descobrir quem é o espião entre nós! Pronto?'}
          </Instruction>

          <Instruction className="e-lists">
            <LocationsList locations={state.possibleLocations} />
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
