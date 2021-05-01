import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// Design Resources
import { message, notification } from 'antd';
// Adapters
import { GAME_API } from '../adapters';
// Hooks
import { useIsGameStale, useLoading, useGlobalState } from '../hooks';
// Utils
import { getGameIdFromURL, isValidGameId } from '../utils';
// Components
import LoadingPage from './loaders/LoadingPage';
import PageError from './errors/PageError';
import SessionArteRuim from './arte-ruim/SessionArteRuim';
import { GAME_COLLECTION } from '../utils/constants';

function Game() {
  const history = useHistory();
  const [, setLoader] = useLoading();
  const [gameId, setGameId] = useGlobalState('gameId');
  const [gameName, setGameName] = useGlobalState('gameName');
  const [gameMeta, setGameMeta] = useGlobalState('gameMeta');

  const [isPageLoading, setPageLoading] = useState(true);
  const isGameStale = useIsGameStale(gameMeta?.createdAt);

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
      try {
        setLoader('load', true);
        const meta = await GAME_API.loadGame({ gameId });
        setGameName(meta.data.gameName);
        setGameMeta(meta.data);
      } catch (e) {
        console.error(e);
        notification.error({
          message: 'Erro ao carregar o jogo',
          description: JSON.stringify(e),
        });
        console.error(e);
      } finally {
        setPageLoading(false);
        setLoader('load', false);
      }
    }

    if (gameId) {
      loadGameSession();
    }
  }, [gameId]); // eslint-disable-line

  // Deffer to load screen if any major API call is running
  if (isPageLoading) {
    return <LoadingPage />;
  }

  if (isGameStale) {
    return (
      <PageError message="Jogo expirado" description="Esse jogo é muito antigo e não pode ser usado mais" />
    );
  }

  if (gameId && gameName) {
    switch (gameName) {
      case GAME_COLLECTION.ARTE_RUIM:
        return <SessionArteRuim gameId={gameId} />;
      default:
        console.warn('Wrong game library provided');
    }
  }

  // If switch fails, it's an error
  return <PageError />;
}

export default Game;
