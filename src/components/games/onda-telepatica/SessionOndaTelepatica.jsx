import React, { Fragment, useEffect, useState } from 'react';
// Hooks
import { useGameState, useGlobalState } from '../../../hooks';
import { GAME_COLLECTION, PHASES } from '../../../utils/constants';
// Hooks
import { useGamePlayers } from '../../../hooks/useGamePlayers';
// Utils
import gameList from '../../../resources/games.json';
// Components
import Lobby from '../../lobby/Lobby';
import Rules from '../../rules/Rules';
import PageError from '../../errors/PageError';
import PhasePlaceholder from '../../shared/PhasePlaceholder';
import GameOver from '../../shared/GameOver';
import GameInfoDrawer from '../../shared/GameInfoDrawer';

function getActiveComponent(phase) {
  switch (phase) {
    case PHASES.ONDA_TELEPATICA.LOBBY:
      return Lobby;
    case PHASES.ONDA_TELEPATICA.RULES:
      return Rules;
    case PHASES.ONDA_TELEPATICA.DIAL_SIDES:
      return PhasePlaceholder;
    case PHASES.ONDA_TELEPATICA.DIAL_CLUE:
      return PhasePlaceholder;
    case PHASES.ONDA_TELEPATICA.GUESS:
      return PhasePlaceholder;
    case PHASES.ONDA_TELEPATICA.RIVAL_GUESS:
      return PhasePlaceholder;
    case PHASES.ONDA_TELEPATICA.REVEAL:
      return PhasePlaceholder;
    case PHASES.ONDA_TELEPATICA.GAME_OVER:
      return GameOver;
    default:
      return PageError;
  }
}

function SessionOndaTelepatica({ gameId }) {
  const players = useGamePlayers(gameId, GAME_COLLECTION.ONDA_TELEPATICA);
  const state = useGameState(gameId, GAME_COLLECTION.ONDA_TELEPATICA);
  const [me] = useGlobalState('me');
  const [info, setInfo] = useState({});

  // Update game description as the gameId comes in
  useEffect(() => {
    setInfo(gameId?.[0] ? gameList[gameId[0]] : {});
  }, [gameId]);

  if (process.env.NODE_ENV === 'development') {
    console.table(players);
    console.log({ state });
  }

  if (!me) {
    return <Lobby players={players} state={state} info={info} />;
  }

  const ActiveComponent = getActiveComponent(state.phase);

  return (
    <Fragment>
      <GameInfoDrawer players={players} state={state} info={info} me={me} />
      <ActiveComponent players={players} state={state} info={info} />
    </Fragment>
  );
}

export default SessionOndaTelepatica;
