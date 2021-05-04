import React, { useCallback, useState } from 'react';
// Design Resources
import { Button, message, notification, Typography } from 'antd';
import { RocketFilled } from '@ant-design/icons';
// State & Hooks
import useGlobalState from '../../hooks/useGlobalState';
import { useLoading } from '../../hooks';
// Resources and Utils
import { ARTE_RUIM_API } from '../../adapters';
import { ARTE_RUIM_PHASES } from '../../utils/constants';
// Components
import GalleryWindow from './GalleryWindow';
import PhaseContainer from '../global/PhaseContainer';
import AdminOnly from '../global/AdminOnly';

function GalleryPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={ARTE_RUIM_PHASES.GALLERY}
      className="gallery-phase"
    >
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
      <AdminOnly>
        <Button icon={<RocketFilled />} danger type="primary" onClick={onGoToRankingPhase}>
          Ir para Ranking
        </Button>
      </AdminOnly>
    </PhaseContainer>
  );
}

export default GalleryPhase;
