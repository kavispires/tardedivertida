import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { sortPlayers } from 'utils/helpers';
// Icons
import { PathIcon } from 'icons/PathIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { MapSegment } from './utils/types';
import { LABIRINTO_SECRETO_PHASES, SLIDE_DURATION } from './utils/constants';
import { StepRanking } from './StepRanking';
import { StepGallery } from './StepGallery';

export function PhaseResults({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToPreviousStep, goToNextStep } = useStep();
  const gallery = useMemo(
    () => sortPlayers(players).filter((player) => player.map.some((segment: MapSegment) => segment.active)),
    [players],
  );

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
    <PhaseContainer phase={state?.phase} allowedPhase={LABIRINTO_SECRETO_PHASES.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<PathIcon />}
          title={<Translate pt="Resultado" en="Results" />}
          currentRound={state?.round?.current}
          type="block"
          onClose={goToNextStep}
          unskippable
        >
          <Instruction>
            <Translate
              pt="Quem é o melhor em seguir direções?"
              en="Who is the best at following directions?"
            />
          </Instruction>
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
        <StepRanking players={players} round={state.round} ranking={state.ranking} onGoBack={onGoBack} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
