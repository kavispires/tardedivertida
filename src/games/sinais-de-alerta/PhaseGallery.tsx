// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Icons
import { WarningSignIcon } from 'icons/WarningSignIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { SINAIS_DE_ALERTA_PHASES, SLIDE_DURATION } from './utils/constants';
import { GalleryRules } from './components/RulesBlobs';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';

export function PhaseGallery({ state, players, meta }: PhaseProps) {
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

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={SINAIS_DE_ALERTA_PHASES.GALLERY}>
      <StepSwitcher step={step} players={players}>
        {/*Step 0 */}
        <PhaseAnnouncement
          icon={<WarningSignIcon />}
          title={<Translate pt="Galeria de Placas" en="Signs Gallery" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          unskippable
          type="block"
          duration={state.round.current < 3 ? 12 : undefined}
        >
          <GalleryRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          gallery={state.gallery}
          players={players}
          cards={state.cards}
          gameLanguage={meta.language}
          slideShowConfig={slideShowConfig}
        />

        {/* Step 2 */}
        <StepRanking players={players} ranking={state.ranking} round={state.round} onGoBack={onGoBack} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
