import { useEffect, useState } from 'react';
// State & Hooks
import { useLanguage, useStep } from 'hooks';
// Resources and Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { GalleryRules } from './components/TextBlobs';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';

function PhaseGallery({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, goToPreviousStep, setStep } = useStep(0);
  const [activeIndex, setActiveIndex] = useState(0);
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
          title={translate('Galeria de Arte', 'Art Gallery')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          unskippable
        >
          <GalleryRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          gallery={state.gallery}
          players={players}
          cards={state.cards}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setStep={setStep}
          isFirstGalleryRunThrough={isFirstGalleryRunThrough}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          isGameOver={isGameOver}
          round={state.round}
          goToPreviousStep={goToPreviousStep}
          setActiveIndex={setActiveIndex}
          isLastRound={state?.lastRound}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGallery;
