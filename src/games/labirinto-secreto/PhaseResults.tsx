import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { sortPlayers } from 'utils/helpers';
import { PHASES } from 'utils/phases';
// Icons
import { PathIcon } from 'icons/PathIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { MapSegment } from './utils/types';
import { StepRanking } from './StepRanking';
import { StepGallery } from './StepGallery';

export function PhaseResults({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep, goToPreviousStep, goToNextStep } = useStep();
  const gallery = useMemo(
    () => sortPlayers(players).filter((player) => player.map.some((segment: MapSegment) => segment.active)),
    [players]
  );

  const { activeIndex, setActiveIndex, isFirstGalleryRunThrough } = useSlideShow(gallery.length);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LABIRINTO_SECRETO.RESULTS}>
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
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          isFirstGalleryRunThrough={isFirstGalleryRunThrough}
          forest={state.forest}
          setStep={setStep}
          user={user}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
