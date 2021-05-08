import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
// Images
import rodadaTitle from '../../images/rodada-title.svg';

function RoundAnnouncement({ round, onPressButton, buttonText, children }) {
  return (
    <div className="round-announcement">
      <div className="round-announcement__title">
        <img src={rodadaTitle} alt="Rodada" />
      </div>
      <div className="round-announcement__round-wrapper">
        <div className="round-announcement__circle"></div>
        <div className="round-announcement__number">{round ?? 0}</div>
      </div>

      {children}

      {Boolean(onPressButton) && (
        <Button type="primary" onClick={onPressButton} className="round-announcement__go-button">
          {buttonText ?? 'Prosseguir'}
        </Button>
      )}
    </div>
  );
}

RoundAnnouncement.propTypes = {
  round: PropTypes.number,
  onPressButton: PropTypes.func,
  buttonText: PropTypes.string,
};

export default RoundAnnouncement;
