// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from '@hooks/useSlideShow';
import { useSortedPlayers } from '@hooks/useSortedPlayers';
import { useStep } from '@hooks/useStep';
// Icons
import { PathIcon } from '@icons/PathIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { MapSegment, PhaseResultsState } from './utils/types';
import { LABIRINTO_SECRETO_PHASES, SLIDE_DURATION } from './utils/constants';
import { StepRanking } from './StepRanking';
import { StepGallery } from './StepGallery';

export function PhaseResults({ state, players, user }: PhaseProps<PhaseResultsState>) {
  const { step, goToPreviousStep, goToNextStep } = useStep();
  const gallery = useSortedPlayers(players, {
    filter: (player) => player.map.some((segment: MapSegment) => segment.active),
  });

  const slideShowConfig = useSlideShow({
    length: gallery.length,
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
      allowedPhase={LABIRINTO_SECRETO_PHASES.RESULTS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<PathIcon />}
          title={
            <Translate
              pt="Resultado"
              en="Results"
            />
          }
          currentRound={state?.round?.current}
          type="block"
          onClose={goToNextStep}
          unskippable
          duration={4}
        >
          <Surface>
            <Translate
              pt="Quem é o melhor em seguir direções?"
              en="Who is the best at following directions?"
            />
          </Surface>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          gallery={gallery}
          players={players}
          slideShowConfig={slideShowConfig}
          forest={state.forest}
          user={user}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          onGoBack={onGoBack}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
