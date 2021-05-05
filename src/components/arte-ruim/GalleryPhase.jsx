import React, { Fragment, useCallback, useEffect, useState } from 'react';
// Design Resources
import { Button, message, notification, Typography } from 'antd';
import { PictureOutlined, RocketFilled } from '@ant-design/icons';
// State & Hooks
import useGlobalState from '../../hooks/useGlobalState';
import { useLoading } from '../../hooks';
// Resources and Utils
import { ARTE_RUIM_API } from '../../adapters';
import { ARTE_RUIM_PHASES } from '../../utils/constants';
// Components
import GalleryWindow from './GalleryWindow';
import PhaseContainer from '../shared/PhaseContainer';
import AdminOnly from '../shared/AdminOnly';
import RankingBoard from '../shared/RankingBoard';

function GalleryPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [, setCanvasSize] = useGlobalState('canvasSize');

  // The gallery needs a bigger image, its annoying that we are changing the users settings but whatever
  useEffect(() => {
    setCanvasSize(500);
  }, []); // eslint-disable-line

  const onGoToNextRound = useCallback(async () => {
    try {
      setLoader('go-to-next-round', true);

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
        message: 'Vixi, o aplicativo encontrou um erro ao tentar ir para a proxima rodada',
        description: JSON.stringify(e),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('go-to-next-round', false);
    }
  }, [gameId, gameName, me, setLoader]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={ARTE_RUIM_PHASES.GALLERY}
      className="gallery-phase"
    >
      {step === 0 && (
        <Fragment>
          <Typography.Title className="center">Galeria de Arte</Typography.Title>
          {state?.gallery && (
            <GalleryWindow
              window={state.gallery[activeIndex]}
              galleryLength={state.gallery.length}
              players={players}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              setStep={setStep}
            />
          )}
        </Fragment>
      )}

      {step === 1 && (
        <Fragment>
          <Typography.Title className="center">
            {state.pointsToVictory >= 0 ? 'Ranking' : 'Game Over'}
          </Typography.Title>
          <RankingBoard players={players} ranking={state.ranking} />
          <Button
            className="gallery-window__go-to-ranking"
            size="large"
            onClick={() => setStep(0)}
            icon={<PictureOutlined />}
          >
            Ver Galeria
          </Button>
          <AdminOnly>
            <Button icon={<RocketFilled />} danger type="primary" onClick={onGoToNextRound}>
              Ir para próxima rodada ou game over
            </Button>
          </AdminOnly>
        </Fragment>
      )}
    </PhaseContainer>
  );
}

export default GalleryPhase;
