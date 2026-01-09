// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Icons
import { BooksIcon } from 'icons/BooksIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import type { PhaseResultsState } from './utils/types';
import { IDADE_DA_PREDA_PHASES, SLIDE_DURATION } from './utils/constants';
import { ScoringRules } from './components/RulesBlobs';
import { StepGallery } from './StepGallery';
import { StepRanking } from './StepRanking';

export function PhaseResults({ state, players }: PhaseProps<PhaseResultsState>) {
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
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={IDADE_DA_PREDA_PHASES.RESULTS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/*Step 0 */}
        <PhaseAnnouncement
          icon={<BooksIcon />}
          title={
            <Translate
              pt="Resultados"
              en="Results"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          unskippable
          type="block"
          duration={state.round.current < 3 ? 12 : undefined}
        >
          <ScoringRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          players={players}
          basicConcepts={state.basicConcepts}
          concepts={state.concepts}
          gallery={state.gallery}
          slideShowConfig={slideShowConfig}
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
