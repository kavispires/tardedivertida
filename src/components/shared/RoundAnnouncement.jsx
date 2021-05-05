import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Typography } from 'antd';
// Images
import rodadaTitle from '../../images/rodada-title.svg';

function RoundAnnouncement({ round, instructions, onPressButton, buttonText }) {
  return (
    <div className="round-announcement">
      <div className="round-announcement__title">
        <img src={rodadaTitle} alt="Rodada" />
      </div>
      <div className="round-announcement__round-wrapper">
        <div className="round-announcement__circle"></div>
        <div className="round-announcement__number">{round ?? 0}</div>
      </div>
      <Typography.Text className="round-announcement__instructions">{instructions}</Typography.Text>
      <Button type="primary" onClick={onPressButton} className="round-announcement__go-button">
        {buttonText ?? 'Um dó, lá, si... vamos ir... JÁ!'}
      </Button>
    </div>
  );
}

RoundAnnouncement.propTypes = {
  round: PropTypes.number,
  instructions: PropTypes.string.isRequired,
  onPressButton: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
};

export default RoundAnnouncement;
