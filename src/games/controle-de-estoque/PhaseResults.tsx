// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { CashRegisterIcon } from 'icons/CashRegisterIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
// Internal
import type { PhaseResultsState } from './utils/types';
import { CONTROLE_DE_ESTOQUE_PHASES } from './utils/constants';
import { useWarehouse } from './utils/hooks';
import { StepRanking } from './StepRanking';
import { StepAnimateFulfillment } from './StepAnimateFulfillment';
import { StepFulfillmentSummary } from './StepFulfillmentSummary';
import { StepOutOfStockSummary } from './StepOutOfStockSummary';

export function PhaseResults({ players, state }: PhaseProps<PhaseResultsState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);

  const warehouse = useWarehouse(state.warehouseGrid);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CONTROLE_DE_ESTOQUE_PHASES.RESULTS}
    >
      <StepSwitcher
        step={step}
        players={players}
        key={String(step)} // Force remount when step changes to reset internal states
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<CashRegisterIcon />}
          title={
            <Translate
              pt="Resultado"
              en="Results"
            />
          }
          currentRound={state?.round?.current}
          type="block"
          duration={5}
          onClose={goToNextStep}
        />

        <StepFulfillmentSummary
          players={players}
          goodsDict={state.goodsDict}
          goToNextStep={goToNextStep}
          gallery={state.gallery}
        />

        <StepOutOfStockSummary
          players={players}
          goodsDict={state.goodsDict}
          goToNextStep={goToNextStep}
          gallery={state.gallery}
        />

        <StepAnimateFulfillment
          goodsDict={state.goodsDict}
          warehouse={warehouse}
          goToNextStep={goToNextStep}
          gallery={state.gallery}
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
