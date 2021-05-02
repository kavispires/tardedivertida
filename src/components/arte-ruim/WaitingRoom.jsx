import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Spin, Typography } from 'antd';
// Components
import ReadyPlayersBar from '../ReadyPlayersBar';

const WaitingRoom = (players) => {
  return (
    <div className="waiting-room">
      <Typography.Title className="waiting-room__title">Pronto!</Typography.Title>
      <Spin />
      <Typography.Paragraph className="waiting-room__paragraph">
        Vamos aguardar enquanto os outros jogadores terminam!
      </Typography.Paragraph>
      <ReadyPlayersBar players={players} />
    </div>
  );
};

WaitingRoom.propTypes = {
  players: PropTypes.object.isRequired,
};

export default WaitingRoom;
