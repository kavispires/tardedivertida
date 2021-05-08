import React, { Fragment, useEffect, useState } from 'react';
// Hooks
import { useGameState, useGlobalState } from '../../hooks';
import { GAME_COLLECTION, ARTE_RUIM_PHASES } from '../../utils/constants';
// Hooks
import { useGamePlayers } from '../../hooks/useGamePlayers';
// Utils
import gameList from '../../resources/games.json';
// Components
import Lobby from '../lobby/Lobby';
import Rules from '../rules/Rules';
import PageError from '../errors/PageError';
import DrawPhase from './DrawPhase';
import EvaluationPhase from './EvaluationPhase';
import GalleryPhase from './GalleryPhase';
import GameInfoDrawer from '../shared/GameInfoDrawer';
import GameOver from '../shared/GameOver';

function getActiveComponent(phase) {
  switch (phase) {
    case ARTE_RUIM_PHASES.LOBBY:
      return Lobby;
    case ARTE_RUIM_PHASES.RULES:
      return Rules;
    case ARTE_RUIM_PHASES.DRAW:
      return DrawPhase;
    case ARTE_RUIM_PHASES.EVALUATION:
      return EvaluationPhase;
    case ARTE_RUIM_PHASES.GALLERY:
      return GalleryPhase;
    case ARTE_RUIM_PHASES.GAME_OVER:
      return GameOver;
    default:
      return PageError;
  }
}

function SessionArteRuim({ gameId }) {
  const players = useGamePlayers(gameId, GAME_COLLECTION.ARTE_RUIM);
  const state = useGameState(gameId, GAME_COLLECTION.ARTE_RUIM);
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

export default SessionArteRuim;
