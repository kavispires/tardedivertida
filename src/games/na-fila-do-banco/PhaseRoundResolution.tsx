// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { DeskIcon } from 'icons/DeskIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
// Internal
import type { PhaseRoundResolutionState } from './utils/types';
import { NA_FILA_DO_BANCO_PHASES } from './utils/constants';
import { useBankClientCardWidth } from './utils/hooks';
import { StepRanking } from './StepRanking';
import { StepResolution } from './StepResolution';

export function PhaseRoundResolution({ players, state }: PhaseProps<PhaseRoundResolutionState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const cardWidth = useBankClientCardWidth(state.tellers);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={NA_FILA_DO_BANCO_PHASES.ROUND_RESOLUTION}
    >
      <StepSwitcher
        step={step}
        players={players}
        key={String(step)} // Force remount when step changes to reset internal states
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<DeskIcon />}
          title={
            <Translate
              pt="Quem vai ser atendido?"
              en="Who will be served?"
            />
          }
          currentRound={state?.round?.current}
          type="block"
          duration={5}
          onClose={goToNextStep}
        />

        <StepResolution
          deckDict={state.deckDict}
          tellers={state.tellers}
          goToNextStep={goToNextStep}
          cardWidth={cardWidth}
          round={state.round}
        />

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
