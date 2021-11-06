import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Design Resources
import { Button } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
// State & Hooks
import { useLanguage } from '../../hooks';
// Resources and Utils
import { PHASES } from '../../utils/constants';
// Components
import { AdminForceNextPhase } from '../../components/admin/index';
import {
  Instruction,
  PhaseContainer,
  RankingBoard,
  StepSwitcher,
  Step,
  Title,
  PhaseAnnouncement,
  translate,
  Translate,
  RoundsLeftInstruction,
} from '../../components/shared';
import GalleryWindow from './GalleryWindow';

const GalleryRules = () => (
  <Instruction>
    <Translate
      pt={
        <>
          Agora, mostraremos cada arte, o que os jogadores votaram e a resposta final.
          <br />
          Se você votou na expressão correta, você ganha 2 pontos.
          <br />
          Quando for a sua arte, você ganha 1 ponto para cada pessoa que votou corretamente.
        </>
      }
      en={
        <>
          Now we show each art, what players voted, and the final answer.
          <br />
          You get 2 points if you selected the right card.
          <br />
          When players selected the correct card for your artwork, you get 1 point for each match!
        </>
      }
    />
  </Instruction>
);

function PhaseGallery({ players, state, info }) {
  const language = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);

  const isGameOver = Object.values(players).some((player) => player.score > 50);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ARTE_RUIM.GALLERY}
      className="a-gallery-phase"
    >
      <StepSwitcher step={step}>
        {/*Step 1 */}
        <PhaseAnnouncement
          type="picture"
          title={translate('Galeria de Arte', 'Art Gallery', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          unskippable
        >
          <GalleryRules />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <Step className="a-gallery-phase__windows">
          <Title>
            <Translate pt="Galeria de Arte" en="Art Gallery" />
          </Title>
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

        {/* Step 3 */}
        <Step>
          <Title>Ranking</Title>
          <RankingBoard players={players} ranking={state.ranking} />

          {!isGameOver && <RoundsLeftInstruction round={state?.round} />}

          <Button
            size="large"
            onClick={() => {
              setStep(1);
              setActiveIndex(0);
            }}
            icon={<PictureOutlined />}
          >
            <Translate pt="Ver Galeria De Novo" en="See Gallery Again" />
          </Button>

          <AdminForceNextPhase
            buttonText={translate(
              'Ir para próxima rodada ou game over',
              'Go to next round or Game Over',
              language
            )}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseGallery.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    cards: PropTypes.array,
    gallery: PropTypes.array,
    phase: PropTypes.string,
    ranking: PropTypes.array,
  }),
};

export default PhaseGallery;
