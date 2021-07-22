import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
import { FireFilled } from '@ant-design/icons';

export const ForceNextPhaseButton = ({ isLoading, onGoToNextPhase }) => (
  <Button
    icon={<FireFilled />}
    type="primary"
    danger
    onClick={() => onGoToNextPhase({})}
    disabled={isLoading}
    size="large"
    className="full-width"
  >
    Force Next Phase
  </Button>
);

ForceNextPhaseButton.propTypes = {
  isLoading: PropTypes.bool,
  onGoToNextPhase: PropTypes.func.isRequired,
};
