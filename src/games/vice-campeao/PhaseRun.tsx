import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { WalkIcon } from 'icons/WalkIcon';
// Components
import { ImageCardPreloadHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseRunState } from './utils/types';
import { VICE_CAMPEAO_PHASES } from './utils/constants';
import { StepRace } from './StepRace';
import { StepRanking } from './StepRanking';
// Icons

export function PhaseRun({ state, players }: PhaseProps<PhaseRunState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep();

  const imagesIds = useMemo(() => {
    return state.race
      .map((activity) => {
        const card = state.cardsDict?.[activity.cardId];
        return card?.imageId ?? '';
      })
      .filter(Boolean);
  }, [state.cardsDict, state.race]);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={VICE_CAMPEAO_PHASES.RUN}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<WalkIcon />}
          title={<Translate pt="A corrida" en="The race" />}
          currentRound={state?.round?.current}
          type="block"
          onClose={goToNextStep}
          duration={4}
          unskippable
        >
          <Instruction>
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
          </Instruction>
          <ImageCardPreloadHand hand={imagesIds} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepRace
          players={players}
          cardsDict={state.cardsDict}
          race={state.race}
          goToNextStep={goToNextStep}
          lockedPlayersIds={state.lockedPlayersIds}
          ongoingPlusOnePlayersIds={state.ongoingPlusOnePlayersIds}
          ongoingMinusOnePlayersIds={state.ongoingMinusOnePlayersIds}
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
