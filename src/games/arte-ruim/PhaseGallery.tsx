// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Icons
import { PictureIcon } from 'icons/PictureIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { ARTE_RUIM_PHASES, SLIDE_DURATION } from './utils/constants';
import { GalleryRules } from './components/TextBlobs';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';

function PhaseGallery({ players, state, meta }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const slideShowConfig = useSlideShow({
    length: state.gallery.length,
    slideDuration: SLIDE_DURATION,
    onExpire: goToNextStep,
  });

  const onGoBack = () => {
    slideShowConfig.reset();
    goToPreviousStep();
  };

  const isGameOver = meta.options?.shortGame
    ? state.round.current === 5
    : Object.values(players).some((player) => player.score > 50);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={ARTE_RUIM_PHASES.GALLERY} className="a-gallery-phase">
      <StepSwitcher step={step} players={players}>
        {/*Step 0 */}
        <PhaseAnnouncement
          icon={<PictureIcon />}
          title={<Translate pt="Galeria de Arte" en="Art Gallery" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          unskippable
          type="block"
        >
          <GalleryRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          gallery={state.gallery}
          players={players}
          cards={state.cards}
          slideShowConfig={slideShowConfig}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          isGameOver={isGameOver}
          round={state.round}
          onGoBack={onGoBack}
          threshold={state.threshold}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGallery;
