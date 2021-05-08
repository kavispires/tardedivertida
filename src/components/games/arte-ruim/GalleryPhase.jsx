import React, { Fragment, useCallback, useEffect, useState } from 'react';
// Design Resources
import { Button, message, notification } from 'antd';
import { PictureOutlined, RocketFilled } from '@ant-design/icons';
// State & Hooks
import useGlobalState from '../../../hooks/useGlobalState';
import { useLoading } from '../../../hooks';
// Resources and Utils
import { ARTE_RUIM_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import GalleryWindow from './GalleryWindow';
import PhaseContainer from '../../shared/PhaseContainer';
import AdminOnly from '../../shared/AdminOnly';
import RankingBoard from '../../shared/RankingBoard';
import Title from '../../shared/Title';
import Instruction from '../../shared/Instruction';
import StepSwitcher from '../../shared/StepSwitcher';

function GalleryPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');
  const [cachedCanvasSize, setCachedCanvasSize] = useState(canvasSize);

  // The gallery needs a bigger image, its annoying that we are changing the users settings but whatever
  useEffect(() => {
    if (step === 0) {
      setCachedCanvasSize(canvasSize);
      setCanvasSize(500);
    } else {
      setCanvasSize(cachedCanvasSize);
    }
  }, [step]); // eslint-disable-line

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
      allowedPhase={PHASES.ARTE_RUIM.GALLERY}
      className="a-gallery-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <div className="a-gallery-phase__windows">
          <Title>Galeria de Arte</Title>
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
        </div>

        {/* Step 1 */}
        <Fragment>
          <Title>{state.pointsToVictory >= 0 ? 'Ranking' : 'Game Over'}</Title>
          <RankingBoard players={players} ranking={state.ranking} />
          {state.pointsToVictory >= 0 && (
            <Instruction contained>
              Faltam <strong>{state.pointsToVictory}</strong> pontos para{' '}
              <strong>{state?.ranking?.[0]?.playerName ?? 'alguém'}</strong> ganhar...
            </Instruction>
          )}

          <Button size="large" onClick={() => setStep(0)} icon={<PictureOutlined />}>
            Ver Galeria
          </Button>
          <AdminOnly>
            <Button icon={<RocketFilled />} danger type="primary" onClick={onGoToNextRound}>
              Ir para próxima rodada ou game over
            </Button>
          </AdminOnly>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default GalleryPhase;
