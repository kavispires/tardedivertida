// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Resources and Utils
import { PHASES } from 'utils/phases';
// Icons
import { WarningSignIcon } from 'icons/WarningSignIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { GalleryRules } from './components/RulesBlobs';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';
import { Translate } from 'components/language';

export function PhaseGallery({ players, state, info, meta }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep, setStep } = useStep(0);
  const { activeIndex, setActiveIndex, isFirstGalleryRunThrough } = useSlideShow(state.gallery.length);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SINAIS_DE_ALERTA.GALLERY}>
      <StepSwitcher step={step} players={players}>
        {/*Step 0 */}
        <PhaseAnnouncement
          icon={<WarningSignIcon />}
          title={<Translate pt="Galeria de Placas" en="Signs Gallery" />}
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
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setStep={setStep}
          isFirstGalleryRunThrough={isFirstGalleryRunThrough}
          gameLanguage={meta.language}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          round={state.round}
          goToPreviousStep={goToPreviousStep}
          // setActiveIndex={setActiveIndex}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
