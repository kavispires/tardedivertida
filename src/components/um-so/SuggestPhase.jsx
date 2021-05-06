import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Typography } from 'antd';
// Components
import PhaseContainer from '../shared/PhaseContainer';
import { UM_SO_PHASES } from '../../utils/constants';

function SuggestPhase({ state, players, info }) {
  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={UM_SO_PHASES.WORD_SELECTION}
      className="word-selection-phase"
    >
      <p>this is the SuggestPhase</p>
    </PhaseContainer>
  );
}

SuggestPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default SuggestPhase;
