import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// import useGameState from '../states/useGameState';
import { getGameIdFromURL, isValidGameId } from '../utils';

function Game() {
  const history = useHistory();
  // const [gameId, setGameId] = useGameState('gameId');
  // const [gameName, setGameName] = useGameState('gameName');
  // const [gameCreatedAt, setGameCreatedAt] = useGameState('createdAt');

  // If not game code, or weird game code, redirect
  useEffect(() => {
    const urlGameId = getGameIdFromURL(history);
    if (!isValidGameId(urlGameId)) {
      history.push('/');
      return <div></div>;
    }
  }, [history]);

  // // Try to load the game
  // useEffect(() => {
  //   functions.loadGame()
  // }, []);

  // if (!gameId) {
  //   return <div className="">Loading</div>;
  // }

  // Try to load game
  // functions.

  // Redirect to Join screen

  return (
    <div className="">
      <h1>Game</h1>
    </div>
  );
}

export default Game;
