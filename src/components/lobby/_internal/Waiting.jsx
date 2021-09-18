import React, { useCallback } from 'react';
// Design Resources
import { Button, Image, message, notification, Typography } from 'antd';
// API & Hooks
import { GAME_API } from '../../../adapters';
import { useLoading, useGlobalState, useLanguage } from '../../../hooks';
// Images
import avatars from '../../../images/avatars.svg';
// Utils and Resources
import { PUBLIC_URL } from '../../../utils/constants';
// Components
import { AdminOnly } from '../../admin/index';
import { Translate, translate } from '../../shared';

function Waiting({ info, players }) {
  const language = useLanguage();
  const [isLoading, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [gameMeta] = useGlobalState('gameMeta');

  const [username] = useGlobalState('username');
  const [userAvatarId] = useGlobalState('userAvatarId');

  const onLockGameAndStart = useCallback(async () => {
    try {
      setLoader('lock-game', true);
      const response = await GAME_API.lockGame({
        gameId,
        gameName,
      });
      if (response.data.isLocked) {
        message.success(
          translate(
            'Jogo trancado e iniciado com sucesso!',
            'Game locked and initialized successfully',
            language
          )
        );
      }
    } catch (e) {
      notification.error({
        message: translate(
          'Vixi, o aplicativo encontrou um erro ao tentar trancar e iniciar o jogo',
          'Oops, the application found an error while trying to lock and start the game',
          language
        ),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('lock-game', false);
    }
  }, [gameId, gameName, setLoader, language]);

  const numPlayers = Object.keys(players).length;
  return (
    <div className="lobby-waiting">
      <div className="lobby-waiting__card">
        <Image
          alt={info?.title[language]}
          src={`${PUBLIC_URL.BANNERS}game-image-${info?.gameName}-${language}.jpg`}
          fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
        />

        <h1 className="center">{username || 'Fulano'},</h1>
        <svg viewBox="0 0 100 100" className="lobby-waiting__avatar">
          <use href={avatars + `#avatar-${userAvatarId}`}></use>
        </svg>
        <h3 className="center">
          <Translate
            pt="Aguarde os outros jogadores entrarem."
            en="Please, wait while other players join..."
          />
        </h3>
        <AdminOnly className="lobby-waiting__lock-button">
          <Typography.Text className="center padding">
            <Translate pt="Jogadores necessários" en="Players needed" />: {numPlayers}/{gameMeta.min}
          </Typography.Text>
          <Button
            type="primary"
            danger
            onClick={onLockGameAndStart}
            disabled={isLoading || numPlayers < gameMeta.min}
            loading={isLoading}
          >
            <Translate pt="Trancar e Iniciar Jogo" en="Lock and Start Game" />
          </Button>
        </AdminOnly>
      </div>
    </div>
  );
}

export default Waiting;
