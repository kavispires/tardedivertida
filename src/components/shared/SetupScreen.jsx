import PropTypes from 'prop-types';
import React from 'react';

// Components
import { PhaseContainer } from './index';
import { Translate } from './Translate';
import { Title } from './Title';
import { Gears } from '../icons';
import { Instruction } from './Instruction';

export function SetupScreen({ info, state }) {
  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase="SETUP" className="setup">
      <div className="phase-announcement">
        <Title>
          <Translate pt="Preparando o jogo..." en="Setting up...." />
        </Title>

        <Gears className="phase-announcement__icon" />

        <Instruction>
          <Translate pt="Aguarde um momento" en="Just a moment" />
        </Instruction>
      </div>
    </PhaseContainer>
  );
}

SetupScreen.propTypes = {
  info: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
  }),
};
