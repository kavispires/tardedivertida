import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Spin } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { Instruction, ReadyPlayersBar, Title } from './index';
import { translate } from './Translate';

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
  title: PropTypes.any.isRequired,
  instruction: PropTypes.any.isRequired,
  children: PropTypes.any,
};

export function DefaultWaitingRoom({ players }) {
  const language = useLanguage();

  return (
    <WaitingRoom
      players={players}
      title={translate('Pronto!', 'Done!', language)}
      instruction={translate(
        'Vamos aguardar os outros jogadores!',
        'Please wait for the other players!',
        language
      )}
    />
  );
}

DefaultWaitingRoom.propTypes = {
  players: PropTypes.object.isRequired,
};
