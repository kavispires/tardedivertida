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
import { ScoringRules } from './components/RulesBlobs';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';

export function PhaseResults({ players, state, info }: PhaseProps) {
  const { step, setStep, goToPreviousStep, goToNextStep } = useStep();
  const { activeIndex, setActiveIndex, isFirstGalleryRunThrough } = useSlideShow(state.gallery?.length ?? 1);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.QUEM_SOU_EU.RESULTS}>
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
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setStep={setStep}
          isFirstGalleryRunThrough={isFirstGalleryRunThrough}
          round={state.round}
          imageCardMode={state.mode === 'imageCards'}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          round={state.round}
          goToPreviousStep={goToPreviousStep}
          setActiveIndex={setActiveIndex}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
