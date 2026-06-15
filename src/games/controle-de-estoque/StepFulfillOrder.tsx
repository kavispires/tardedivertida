import { useState } from 'react';
// Types
import type { GamePlayer, GameRound } from 'types/game';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useLoading } from 'hooks/useLoading';
// Icons
import { BossIdeaIcon } from 'icons/BossIdeaIcon';
// Components
import { SendButton } from 'components/buttons/SendButton';
import { DevButton } from 'components/debug/DevButton';
import { Translate } from 'components/language/Translate';
import { SpaceFloat } from 'components/layout/SpaceFloat';
import { Step } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
import { TimerBar } from 'components/timers/TimerBar';
// Internal
import type { Good, SubmitFulfillmentPayload, WarehouseSlot } from './utils/types';
import { FULFILLMENT_TIMER } from './utils/constants';
import { mockFulfillment } from './utils/mock';
import { FulfillmentWarehouse } from './components/FulfillmentWarehouse';

type StepFulfillOrderProps = {
  user: GamePlayer;
  warehouse: WarehouseSlot[];
  goodsDict: Dictionary<Good>;
  onSubmitFulfillment: (payload: SubmitFulfillmentPayload) => void;
  round: GameRound;
};

export function StepFulfillOrder({
  user,
  goodsDict,
  warehouse,
  onSubmitFulfillment,
  round,
}: StepFulfillOrderProps) {
  const { isLoading } = useLoading();
  const [fulfillmentDict, setFulfillmentDict] = useState<Dictionary<number>>({});

  const { timeLeft } = useCountdown({
    duration: FULFILLMENT_TIMER,
    // If no guesses, make a random guess
    onExpire: () => {
      if (user.ready) return;

      onSubmitFulfillment({ fulfillments: fulfillmentDict });
      return;
    },
  });

  return (
    <Step fullWidth>
      <StepTitle icon={<BossIdeaIcon />}>
        <Translate
          en="Fulfill the orders!"
          pt="Atenda os pedidos!"
        />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          en="Drag the good to the correct slot in the warehouse, or mark it as out-of-stock if it's not in the warehouse."
          pt="Arraste o produto para a posição correta no depósito, ou marque como esgotado se ele não estiver no depósito."
        />
      </RuleInstruction>

      <TimerBar
        value={timeLeft}
        total={FULFILLMENT_TIMER}
        status="normal"
      />

      <FulfillmentWarehouse
        goodsDict={goodsDict}
        warehouse={warehouse}
        orders={user.orders ?? []}
        fulfillmentsDict={fulfillmentDict}
        setFulfillmentsDict={setFulfillmentDict}
      />

      <SpaceFloat
        className="mt-4"
        enabled={!user.ready}
      >
        <SendButton
          onClick={() => onSubmitFulfillment({ fulfillments: fulfillmentDict })}
          disabled={isLoading || Object.keys(fulfillmentDict).length === 0 || user.ready}
          size="large"
        >
          <Translate
            pt="Confirmar atendimento"
            en="Confirm Fulfillment"
          />
        </SendButton>

        <DevButton
          onClick={() => setFulfillmentDict(mockFulfillment(user.orders ?? [], warehouse, round.current))}
          size="large"
        >
          Mock Fulfillment
        </DevButton>
      </SpaceFloat>
    </Step>
  );
}
