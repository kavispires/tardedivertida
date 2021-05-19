import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Spin } from 'antd';
// Components
import ReadyPlayersBar from './ReadyPlayersBar';
import Title from './Title';
import Instruction from './Instruction';

const WaitingRoom = ({ players, title, instruction, children }) => {
  return (
    <div className="waiting-room">
      <Title>{title}</Title>
      <Spin />
      <Instruction>{instruction}</Instruction>
      {children}
      <ReadyPlayersBar players={players} />
    </div>
  );
};

WaitingRoom.propTypes = {
  players: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  instruction: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default WaitingRoom;
