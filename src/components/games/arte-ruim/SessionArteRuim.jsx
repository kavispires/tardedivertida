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
import DrawPhase from './DrawPhase';
import EvaluationPhase from './EvaluationPhase';
import GalleryPhase from './GalleryPhase';
import GameOverPhase from './GameOverPhase';
import GameInfoDrawer from '../../shared/GameInfoDrawer';

function getActiveComponent(phase) {
  switch (phase) {
    case PHASES.ARTE_RUIM.LOBBY:
      return Lobby;
    case PHASES.ARTE_RUIM.RULES:
      return Rules;
    case PHASES.ARTE_RUIM.DRAW:
      return DrawPhase;
    case PHASES.ARTE_RUIM.EVALUATION:
      return EvaluationPhase;
    case PHASES.ARTE_RUIM.GALLERY:
      return GalleryPhase;
    case PHASES.ARTE_RUIM.GAME_OVER:
      return GameOverPhase;
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
