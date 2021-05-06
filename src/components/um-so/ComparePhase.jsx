import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Typography } from 'antd';
// Components
import PhaseContainer from '../shared/PhaseContainer';
import { UM_SO_PHASES } from '../../utils/constants';

function ComparePhase({ state, players, info }) {
  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={UM_SO_PHASES.WORD_SELECTION}
      className="u-compare-phase"
    >
      <p>this is the ComparePhase</p>
    </PhaseContainer>
  );
}

ComparePhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default ComparePhase;
