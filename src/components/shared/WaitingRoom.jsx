import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Spin, Typography } from 'antd';
// Components
import ReadyPlayersBar from './ReadyPlayersBar';

const WaitingRoom = ({ players, title, instruction }) => {
  return (
    <div className="waiting-room">
      <Typography.Title className="waiting-room__title">{title}</Typography.Title>
      <Spin />
      <Typography.Paragraph className="waiting-room__paragraph">{instruction}</Typography.Paragraph>
      <ReadyPlayersBar players={players} />
    </div>
  );
};

WaitingRoom.propTypes = {
  players: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  instruction: PropTypes.string.isRequired,
};

export default WaitingRoom;
