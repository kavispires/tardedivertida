import React from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { Button } from 'antd';
// Images
import rodadaTitle from '../../images/rodada-title.svg';
// Utils
import { inNSeconds } from '../../utils';
import AvatarName from '../avatars/AvatarName';

function Team({ team, players, className }) {
  return (
    <div className={className}>
      <h1>Time {team.name}</h1>
      <ul className="round-announcement__team-members">
        {team.members.map((playerName) => (
          <li key={`team-member-${playerName}`} className="round-announcement__team-member">
            <AvatarName player={players[playerName]} />
          </li>
        ))}
      </ul>
      <p>{team.score} pontos</p>
    </div>
  );
}

function RoundAnnouncement({ round, onPressButton, buttonText, time, teams, players, children }) {
  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(time),
    autoStart: true,
    onExpire: Boolean(time) ? onPressButton : undefined,
  });

  return (
    <div className="round-announcement">
      {Boolean(teams?.A) && (
        <Team className="round-announcement__team-left" team={teams.A} players={players} />
      )}

      <div className="round-announcement__main">
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

      {Boolean(teams?.B) && (
        <Team className="round-announcement__team-right" team={teams.B} players={players} />
      )}
    </div>
  );
}

RoundAnnouncement.propTypes = {
  round: PropTypes.number,
  onPressButton: PropTypes.func,
  buttonText: PropTypes.string,
  time: PropTypes.number,
  players: PropTypes.object,
  teams: PropTypes.object,
};

RoundAnnouncement.defaultProps = {
  buttonText: 'Prosseguir',
  time: 0,
};

export default RoundAnnouncement;
