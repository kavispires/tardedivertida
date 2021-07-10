import React, { useEffect, useState } from 'react';
// Design Resources
import { Button } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
// State & Hooks
import { useAPICall, useGlobalState } from '../../../hooks';
// Resources and Utils
import { GAME_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { AdminOnlyButton } from '../../admin/index';
import { Instruction, PhaseContainer, RankingBoard, StepSwitcher, Step, Title } from '../../shared';
import GalleryWindow from './GalleryWindow';

function GalleryPhase({ players, state, info }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');
  const [cachedCanvasSize, setCachedCanvasSize] = useGlobalState('cachedCanvasSize');

  // The gallery needs a bigger image, its annoying that we are changing the users settings but whatever
  useEffect(() => {
    if (step === 0) {
      setCachedCanvasSize(canvasSize);
      setCanvasSize(Math.min(window.innerWidth / 2 - 100, 500));
    } else {
      setCanvasSize(cachedCanvasSize);
    }
  }, [step]); // eslint-disable-line

  const onGoToNextRound = useAPICall({
    apiFunction: GAME_API.goToNextPhase,
    actionName: 'go-to-next-phase',
    successMessage: 'Ranking!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ARTE_RUIM.GALLERY}
      className="a-gallery-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <Step className="a-gallery-phase__windows">
          <Title>Galeria de Arte</Title>
          {state?.gallery && (
            <GalleryWindow
              window={state.gallery[activeIndex]}
              galleryLength={state.gallery.length}
              cards={state.cards}
              players={players}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              setStep={setStep}
            />
          )}
        </Step>

        {/* Step 1 */}
        <Step>
          <Title>{state.pointsToVictory >= 0 ? 'Ranking' : 'Game Over'}</Title>
          <RankingBoard players={players} ranking={state.ranking} />
          {state.pointsToVictory >= 0 && (
            <Instruction contained>
              Faltam <strong>{state.pointsToVictory}</strong> pontos para o jogo acabar...
            </Instruction>
          )}

          <Button size="large" onClick={() => setStep(0)} icon={<PictureOutlined />}>
            Ver Galeria
          </Button>
          <AdminOnlyButton action={() => onGoToNextRound({})} label="Ir para próxima rodada ou game over" />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default GalleryPhase;
