// Types
import type { PhaseProps } from 'types/game';
// Icons
import { WarehouseIcon } from '@icons/WarehouseIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
// Internal
import { CONTROLE_DE_ESTOQUE_PHASES } from './utils/constants';
import { useOnMakeReady } from './utils/api-requests';
import { useWarehouse } from './utils/hooks';
import type { PhaseTheWarehouseState } from './utils/types';
import { StepGetAcquainted } from './StepGetAcquainted';

export function PhaseTheWarehouse({ players, state, user }: PhaseProps<PhaseTheWarehouseState>) {
  const warehouse = useWarehouse(state.warehouseGrid);

  const onReady = useOnMakeReady();

  const announcement = (
    <PhaseAnnouncement
      icon={<WarehouseIcon />}
      title={
        <Translate
          pt="O galpão"
          en="The Warehouse"
        />
      }
      currentRound={state?.round?.current}
      duration={7}
      type="overlay"
      unskippable
    >
      <Surface>
        <Translate
          pt="Esses itens já estão no galpão. Memorize suas posições antes de começarmos!"
          en="These items are already in the warehouse. Memorize their positions before we start!"
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CONTROLE_DE_ESTOQUE_PHASES.THE_WAREHOUSE}
    >
      <StepGetAcquainted
        announcement={announcement}
        goodsDict={state.goodsDict}
        warehouseGrid={warehouse}
        players={players}
        turnOrder={state.turnOrder}
        onReady={onReady}
        user={user}
      />
    </PhaseContainer>
  );
}
