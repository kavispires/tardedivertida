import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
import type { BossIdeaCard } from 'types/tdr';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { DualTranslate } from 'components/language';
import { PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { DAYS_OF_THE_WEEK } from './utils/constants';
import { useOnConfirmGoodPlacementAPIRequest, useOnPlaceGoodAPIRequest } from './utils/api-requests';
import { StepPlaceGood } from './StepPlaceGood';
import { StepConfirmGood } from './StepConfirmGood';
// Icons

export function PhasePlacementConfirmation({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const [supervisor, isUserTheSupervisor] = useWhichPlayerIsThe('supervisorId', state, players);

  const onPlaceGood = useOnPlaceGoodAPIRequest();
  const onConfirmPlacement = useOnConfirmGoodPlacementAPIRequest();

  // If roundGoodsIndex is 0, show round announcement and boss idea
  const { step, goToNextStep } = useStep();
  const bossIdea: BossIdeaCard = state?.bossIdea;

  const warehouse = useMemo(() => orderBy(state.warehouseGrid, ['id']), [state.warehouseGrid]);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.CONTROLE_DE_ESTOQUE.PLACEMENT_CONFIRMATION}>
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
