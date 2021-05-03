import React, { useCallback, useState } from 'react';
// Design Resources
import { Button, Layout, message, notification, Typography } from 'antd';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Hooks
import { useLoading } from '../../hooks';
// Components
import LoadingPage from '../loaders/LoadingPage';

import { ARTE_RUIM_API } from '../../adapters';
import GalleryWindow from './GalleryWindow';
import { RocketFilled } from '@ant-design/icons';

function GalleryPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAdmin] = useGlobalState('isAdmin');

  const onGoToRankingPhase = useCallback(async () => {
    try {
      setLoader('go-to-ranking', true);

      const response = await ARTE_RUIM_API.goToNextPhase({
        gameId,
        gameName,
        playerName: me,
      });
      if (response.data) {
        message.success('Ranking!');
      }
    } catch (e) {
      notification.error({
        message: 'Vixi, o aplicativo encontrou um erro ao tentar ir para o ranking',
        description: JSON.stringify(e),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('go-to-ranking', false);
    }
  }, [gameId, gameName, me, setLoader]);

  if (!info?.gameName || !state?.phase) {
    return <LoadingPage />;
  }

  return (
    <Layout.Content className="gallery-phase">
      <Typography.Title className="center">Galeria de Arte</Typography.Title>
      {state?.gallery && (
        <GalleryWindow
          window={state.gallery[activeIndex]}
          galleryLength={state.gallery.length}
          players={players}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      )}
      {isAdmin && (
        <Button icon={<RocketFilled />} danger type="primary" onClick={onGoToRankingPhase}>
          Ir para Ranking
        </Button>
      )}
    </Layout.Content>
  );
}

export default GalleryPhase;
