import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
import type { BossIdeaCard } from 'types/tdr';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Components
import { PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnConfirmGoodPlacementAPIRequest, useOnPlaceGoodAPIRequest } from './utils/api-requests';
import { CONTROLE_DE_ESTOQUE_PHASES } from './utils/constants';
import { StepConfirmGood } from './StepConfirmGood';

export function PhasePlacementConfirmation({ players, state, user }: PhaseProps) {
  const [supervisor, isUserTheSupervisor] = useWhichPlayerIsThe('supervisorId', state, players);

  const onPlaceGood = useOnPlaceGoodAPIRequest();
  const onConfirmPlacement = useOnConfirmGoodPlacementAPIRequest();

  // If roundGoodsIndex is 0, show round announcement and boss idea
  const { step } = useStep();
  const bossIdea: BossIdeaCard = state?.bossIdea;

  const warehouse = useMemo(() => orderBy(state.warehouseGrid, ['id']), [state.warehouseGrid]);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={CONTROLE_DE_ESTOQUE_PHASES.PLACEMENT_CONFIRMATION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepConfirmGood
          user={user}
          players={players}
          bossIdea={bossIdea}
          roundGoods={state.roundGoods ?? []}
          roundsGoodIndex={state.roundsGoodIndex}
          goodsDict={state.goodsDict}
          warehouse={warehouse}
          supervisor={supervisor}
          isUserTheSupervisor={isUserTheSupervisor}
          onPlaceGood={onPlaceGood}
          onConfirmPlacement={onConfirmPlacement}
          stocked={state.stocked}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
