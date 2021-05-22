import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// Design Resources
import { message, notification } from 'antd';
// Adapters
import { GAME_API } from '../adapters';
// Hooks
import { useIsGameStale, useLoading, useGlobalState } from '../hooks';
// Utils
import { getGameIdFromURL, getGameIdFromLocation, isValidGameId } from '../utils';
import { GAME_COLLECTION } from '../utils/constants';
// Components
import LoadingPage from './loaders/LoadingPage';
import PageError from './errors/PageError';
import GameSessions from './games';

function Game() {
  const history = useHistory();
  const [, setLoader] = useLoading();
  const [gameId, setGameId] = useGlobalState('gameId');
  const [gameName, setGameName] = useGlobalState('gameName');
  const [gameMeta, setGameMeta] = useGlobalState('gameMeta');
  const [, setMe] = useGlobalState('me');
  const [, setMyAvatar] = useGlobalState('myAvatar');

  const [isPageLoading, setPageLoading] = useState(true);
  const isGameStale = useIsGameStale(gameMeta?.createdAt);

  // Verify url game code
  useEffect(() => {
    const urlGameId = getGameIdFromURL(history);
    if (isValidGameId(urlGameId)) {
      setGameId(urlGameId);
      setMe('');
      setMyAvatar('');
    } else {
      message.error('Vixi, a id do jogo na barra de endereços tá errada');
      history.push('/');
    }
  }, [history, setGameId, setMe, setMyAvatar]);

  // Keeps track of url changes
  useEffect(() => {
    return history.listen((location) => {
      const urlGameId = getGameIdFromLocation(location);
      if (isValidGameId(urlGameId)) {
        setGameId(urlGameId);

        message.info('Uma nova id de jogo foi provida');
      } else {
        message.error('Vixi, a id do jogo na barra de endereços tá errada');
        history.push('/');
      }
    });
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
          description: JSON.stringify(e.message),
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
        return <GameSessions.ArteRuim gameId={gameId} />;
      case GAME_COLLECTION.ESPIAO_ENTRE_NOS:
        return <GameSessions.EspiaoEntreNos gameId={gameId} />;
      case GAME_COLLECTION.ONDA_TELEPATICA:
        return <GameSessions.OndaTelepatica gameId={gameId} />;
      case GAME_COLLECTION.UE_SO_ISSO:
        return <GameSessions.UeSoIsso gameId={gameId} />;
      default:
        console.warn('Wrong game library provided');
    }
  }

  // If switch fails, it's an error
  return <PageError />;
}

export default Game;
