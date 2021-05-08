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
import WordSelectionPhase from './WordSelectionPhase';
import SuggestPhase from './SuggestPhase';
import ComparePhase from './ComparePhase';
import GuessPhase from './GuessPhase';
import GameOver from '../../shared/GameOver';
import GameInfoDrawer from '../../shared/GameInfoDrawer';

function getActiveComponent(phase) {
  switch (phase) {
    case PHASES.UM_SO.LOBBY:
      return Lobby;
    case PHASES.UM_SO.RULES:
      return Rules;
    case PHASES.UM_SO.WORD_SELECTION:
      return WordSelectionPhase;
    case PHASES.UM_SO.SUGGEST:
      return SuggestPhase;
    case PHASES.UM_SO.COMPARE:
      return ComparePhase;
    case PHASES.UM_SO.GUESS:
      return GuessPhase;
    case PHASES.UM_SO.GAME_OVER:
      return GameOver;
    default:
      return PageError;
  }
}

function SessionUmSo({ gameId }) {
  const players = useGamePlayers(gameId, GAME_COLLECTION.UM_SO);
  const state = useGameState(gameId, GAME_COLLECTION.UM_SO);
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

export default SessionUmSo;
