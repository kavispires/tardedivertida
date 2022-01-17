import { useEffect, useState } from 'react';
// Design Resources
import { Button } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
// State & Hooks
import { useLanguage } from '../../hooks';
// Resources and Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  AdminNextRoundButton,
  PhaseContainer,
  RankingBoard,
  StepSwitcher,
  Step,
  Title,
  PhaseAnnouncement,
  translate,
  Translate,
  RoundsLeftInstruction,
  PopoverRule,
} from '../../components';
import GalleryWindow from './GalleryWindow';
import { GalleryRules, ScoringRules } from './TextBlobs';

function PhaseGallery({ players, state, info }: PhaseProps) {
  const language = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isFirstGalleryRunThrough, setIsFirstGalleryRunThrough] = useState(true);

  // Changes isFirstGalleryRunThrough property which disables controls, after the first gallery run through
  useEffect(() => {
    if (isFirstGalleryRunThrough && step > 1) {
      setIsFirstGalleryRunThrough(false);
    }
  }, [step, isFirstGalleryRunThrough]);

  const isGameOver = Object.values(players).some((player) => player.score > 50);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ARTE_RUIM.GALLERY}
      className="a-gallery-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/*Step 0 */}
        <PhaseAnnouncement
          type="picture"
          title={translate('Galeria de Arte', 'Art Gallery', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          unskippable
        >
          <GalleryRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step className="a-gallery-phase__windows">
          <Title>
            <Translate pt="Galeria de Arte" en="Art Gallery" />
          </Title>

          <PopoverRule content={<ScoringRules />} />

          {state?.gallery && (
            <GalleryWindow
              window={state.gallery[activeIndex]}
              galleryLength={state.gallery.length}
              cards={state.cards}
              players={players}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              setStep={setStep}
              disableControls={isFirstGalleryRunThrough}
            />
          )}
        </Step>

        {/* Step 2 */}
        <Step>
          <Title>Ranking</Title>
          <RankingBoard players={players} ranking={state.ranking} />

          <PopoverRule content={<ScoringRules />} />

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

          <AdminNextRoundButton round={state.round} lastRound={state?.lastRound} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGallery;
