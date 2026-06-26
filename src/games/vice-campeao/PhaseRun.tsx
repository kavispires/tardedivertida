import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { WalkIcon } from '@icons/WalkIcon';
// Components
import { ImageCardPreloadHand } from '@components/image-cards/ImageCardPreloadHand';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { PhaseRunState } from './utils/types';
import { VICE_CAMPEAO_PHASES } from './utils/constants';
import { StepRace } from './StepRace';
import { StepRanking } from './StepRanking';

export function PhaseRun({ state, players }: PhaseProps<PhaseRunState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep();

  const imagesIds = useMemo(() => {
    return Object.keys(
      state.race.reduce(
        (acc, activity) => {
          const card = state.cardsDict?.[activity.cardId];
          if (card?.imageId) {
            acc[card.imageId] = true;
          }
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    );
  }, [state.cardsDict, state.race]);

  const announcement = (
    <PhaseAnnouncement
      icon={<WalkIcon />}
      title={
        <Translate
          pt="A corrida"
          en="The race"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
      unskippable
    >
      <Surface>
        <Translate
          pt={
            <>
              Vamos avaliar cada carta que os jogadores escolheram.
              <br />
              Especiais acontecem primeiro e então movimentos.
            </>
          }
          en={
            <>
              Let's evaluate each card that the players chose.
              <br />
              Effect cards happen first and then Movements.
            </>
          }
        />
      </Surface>
      <ImageCardPreloadHand hand={imagesIds} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={VICE_CAMPEAO_PHASES.RUN}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}

        <StepRace
          players={players}
          cardsDict={state.cardsDict}
          race={state.race}
          goToNextStep={goToNextStep}
          lockedPlayersIds={state.lockedPlayersIds}
          ongoingPlusOnePlayersIds={state.ongoingPlusOnePlayersIds}
          ongoingMinusOnePlayersIds={state.ongoingMinusOnePlayersIds}
          announcement={announcement}
        />

        {/* Step 2 */}
        <StepRanking
          ranking={state.ranking}
          players={players}
          goToPreviousStep={goToPreviousStep}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
