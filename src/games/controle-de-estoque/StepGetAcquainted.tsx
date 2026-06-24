// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { AutoNextPhase } from '@components/general/AutoNextPhase';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { Surface } from '@components/layout/Surface';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { Good, WarehouseSlot } from './utils/types';
import { Warehouse } from './components/Warehouse';

type StepGetAcquaintedProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  goodsDict: Dictionary<Good>;
  warehouseGrid: WarehouseSlot[];
  onReady: () => void;
} & Pick<StepProps, 'announcement'>;

export function StepGetAcquainted({
  announcement,
  goodsDict,
  warehouseGrid,
  players,
  turnOrder,
  user,
  onReady,
}: StepGetAcquaintedProps) {
  // Dev Mock
  useMock(() => {
    onReady();
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          en="This is the warehouse!"
          pt="Este é o galpão logístico!"
        />
      </StepTitle>

      <RuleInstruction type="lore">
        <Translate
          en="You were just hired as floor supervisors for a big logistics company! Your first task is to get acquainted with the warehouse and the goods that are already stocked there. Press Ready to Work when you're ready"
          pt="Vocês acabaram de ser contratados como estoquistas de fábrica para uma grande empresa de logística! A primeira tarefa de vocês é se familiarizar com o galpão e os produtos que já estão estocados lá. Aperte Pronto para Trabalhar quando estiver pronto"
        />
      </RuleInstruction>

      <Warehouse
        warehouse={warehouseGrid}
        goodsDict={goodsDict}
        goodClassName=""
        goodComponent={null}
      />

      <SpaceFloat className="mt-4">
        {user.ready ? (
          <Surface contained>
            <Translate
              en="Ready to Work!"
              pt="Pronto pra trabalhar!"
            />
          </Surface>
        ) : (
          <SendButton
            onClick={onReady}
            size="large"
          >
            <Translate
              en="Ready to Work"
              pt="Pronto para Trabalhar"
            />
          </SendButton>
        )}
      </SpaceFloat>

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
      />

      <AutoNextPhase players={players} />
    </Step>
  );
}
