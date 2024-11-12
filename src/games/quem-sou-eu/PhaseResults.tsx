// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { MirrorIcon } from 'icons/MirrorIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { SLIDE_DURATION } from './utils/constants';
import { ScoringRules } from './components/RulesBlobs';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';

export function PhaseResults({ players, state }: PhaseProps) {
  const { step, goToPreviousStep, goToNextStep } = useStep();

  const slideShowConfig = useSlideShow({
    length: state.gallery.length,
    slideDuration: SLIDE_DURATION,
    onExpire: goToNextStep,
  });

  const onGoBack = () => {
    slideShowConfig.setSlideIndex(0);
    goToPreviousStep();
  };

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.QUEM_SOU_EU.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<MirrorIcon />}
          title={<Translate pt="Resultado" en="Results" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          unskippable
          type="block"
        >
          <Instruction>
            <ScoringRules currentRound={state.round.current} />
          </Instruction>
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
        <StepRanking players={players} ranking={state.ranking} round={state.round} onGoBack={onGoBack} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
