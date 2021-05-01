import React from 'react';
// Hooks
import { useGameInfo, useGameState, useGlobalState } from '../../hooks';
import { GAME_COLLECTION, ARTE_RUIM_PHASES } from '../../utils/constants';
// Components
import Lobby from '../lobby/Lobby';
import Rules from '../rules/Rules';
import PageError from '../errors/PageError';

function getActiveComponent(phase) {
  switch (phase) {
    case ARTE_RUIM_PHASES.LOBBY:
      return Lobby;
    case ARTE_RUIM_PHASES.RULES:
      return Rules;
    default:
      return PageError;
  }
}

function SessionArteRuim({ gameId }) {
  const info = useGameInfo(gameId, GAME_COLLECTION.ARTE_RUIM);
  const state = useGameState(gameId, GAME_COLLECTION.ARTE_RUIM);
  const [me] = useGlobalState('me');
  console.log({ info });
  console.log({ state });

  if (!me) {
    return <Lobby info={info} state={state} />;
  }

  const ActiveComponent = getActiveComponent(state.phase);

  return <ActiveComponent info={info} state={state} />;
}

export default SessionArteRuim;
