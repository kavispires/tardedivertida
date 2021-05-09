import React from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { Button } from 'antd';
// Images
import rodadaTitle from '../../images/rodada-title.svg';
// Utils
import { inNSeconds } from '../../utils';

function RoundAnnouncement({ round, onPressButton, buttonText, time, children }) {
  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(time),
    autoStart: true,
    onExpire: Boolean(time) ? onPressButton : undefined,
  });

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
          {buttonText} {Boolean(time) && <span className="round-announcement__in-timed">{seconds}</span>}
        </Button>
      )}
    </div>
  );
}

RoundAnnouncement.propTypes = {
  round: PropTypes.number,
  onPressButton: PropTypes.func,
  buttonText: PropTypes.string,
  time: PropTypes.number,
};

RoundAnnouncement.defaultProps = {
  buttonText: 'Prosseguir',
  time: 0,
};

export default RoundAnnouncement;
