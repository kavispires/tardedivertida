import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Spin } from 'antd';
// Components
import { Instruction, ReadyPlayersBar, Title } from './index';

export function WaitingRoom({ players, title, instruction, children }) {
  return (
    <div className="waiting-room">
      <Title>{title}</Title>
      <Spin />
      <Instruction>{instruction}</Instruction>
      {children}
      <ReadyPlayersBar players={players} showNames />
    </div>
  );
}

WaitingRoom.propTypes = {
  players: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  instruction: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default WaitingRoom;
