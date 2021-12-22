import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useGameState, useGlobalState, useGamePlayers } from '../../hooks';
// Utils
import gameList from '../../resources/games.json';
import { isDevEnv } from '../../utils/helpers';
// Components
import Lobby from '../lobby/Lobby';
import { GameInfoDrawer } from '../drawers';
import { AdminMenu } from '../admin/index';

export function Session({ gameId, gameCollection, getActiveComponent }) {
  const players = useGamePlayers(gameId, gameCollection);
  const state = useGameState(gameId, gameCollection);
  const [userId] = useGlobalState('userId');
  const [info, setInfo] = useState({});

  // Update game description as the gameId comes in
  useEffect(() => {
    setInfo(gameId?.[0] ? gameList[gameId[0]] : {});
  }, [gameId]);

  if (isDevEnv) {
    console.table(players);
    console.log({ state });
  }

  if (!userId) {
    return <Lobby players={players} state={state} info={info} />;
  }

  const ActiveComponent = getActiveComponent(state.phase);

  return (
    <Fragment>
      <GameInfoDrawer players={players} state={state} info={info} userId={userId} />
      <ActiveComponent players={players} state={state} info={info} />
      <AdminMenu state={state} />
    </Fragment>
  );
}

Session.propTypes = {
  gameId: PropTypes.string.isRequired,
  gameCollection: PropTypes.string.isRequired,
  getActiveComponent: PropTypes.func.isRequired,
};
