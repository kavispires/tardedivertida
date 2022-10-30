// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Resources and Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { GalleryRules } from './components/TextBlobs';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';
import { PictureIcon } from 'components/icons/PictureIcon';
import { Translate } from 'components/language';

function PhaseGallery({ players, state, info, meta }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep, setStep } = useStep(0);
  const { activeIndex, setActiveIndex, isFirstGalleryRunThrough } = useSlideShow(state.gallery.length);

  const isGameOver = meta.options?.shortGame
    ? state.round.current === 5
    : Object.values(players).some((player) => player.score > 50);

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
          icon={<PictureIcon />}
          title={<Translate pt="Galeria de Arte" en="Art Gallery" />}
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
