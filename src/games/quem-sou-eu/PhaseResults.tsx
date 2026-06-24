// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from '@hooks/useSlideShow';
import { useStep } from '@hooks/useStep';
// Icons
import { MirrorIcon } from '@icons/MirrorIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { QUEM_SOU_EU_PHASES, SLIDE_DURATION } from './utils/constants';
import type { PhaseResultsState } from './utils/types';
import { ScoringRules } from './components/RulesBlobs';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';

export function PhaseResults({ state, players }: PhaseProps<PhaseResultsState>) {
  const { step, goToPreviousStep, goToNextStep } = useStep();

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
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={QUEM_SOU_EU_PHASES.RESULTS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<MirrorIcon />}
          title={
            <Translate
              pt="Resultado"
              en="Results"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          unskippable
          type="block"
        >
          <Surface>
            <ScoringRules currentRound={state.round.current} />
          </Surface>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          players={players}
          gallery={state.gallery}
          characters={state.characters}
          slideShowConfig={slideShowConfig}
          round={state.round}
          imageCardMode={state.mode === 'imageCards'}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          round={state.round}
          onGoBack={onGoBack}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
