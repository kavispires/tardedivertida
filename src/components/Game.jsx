import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GAME_API } from '../adapters';

import useGameState from '../states/useGameState';
import { getGameIdFromURL, isValidGameId } from '../utils';
import LoadingPage from './loaders/LoadingPage';

function Game() {
  const history = useHistory();
  const [isPageLoading, setPageLoading] = useState(true);
  // const [isLoading, setLoading] = useState(true);
  const [isGameStale, setGameStale] = useState(false);

  const [gameId, setGameId] = useGameState('gameId');
  const [gameName, setGameName] = useGameState('gameName');
  const [gameCreatedAt, setGameCreatedAt] = useGameState('createdAt');

  // Verify url game code
  useEffect(() => {
    const urlGameId = getGameIdFromURL(history);
    if (isValidGameId(urlGameId)) {
      setGameId(urlGameId);
    } else {
      message.error('Vixi, the provided game id does not look right');
      history.push('/');
    }
  }, [history, setGameId]);

  // Load game
  useEffect(() => {
    setPageLoading(true);
    async function loadGameSession() {
      console.log('Loading game...');
      const meta = await GAME_API.loadGame({ gameId });
      console.log({ meta });
      setGameName(meta.data.name);
      setGameCreatedAt(meta.data.createdAt);
      setPageLoading(false);
    }

    if (gameId) {
      loadGameSession();
    }
  }, [gameId, setGameName, setGameCreatedAt]);

  // Verify if game is stale/older than one day
  useEffect(() => {
    setGameStale(Date.now() - 24 * 60 * 60 * 1000 < gameCreatedAt);
  }, [gameCreatedAt, setGameStale]);

  // Deffer to load screen if any major API call is running
  if (isPageLoading) {
    return <LoadingPage />;
  }
  console.log({ isGameStale });
  if (gameId && gameName && !isGameStale) {
    console.log('should show lobby');
  }
  // Redirect to Lobby screen

  return (
    <div className="">
      <h1>Game</h1>
    </div>
  );
}

export default Game;
