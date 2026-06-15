import { useMemo } from 'react';
// Icons
import { BossIdeaIcon } from 'icons/BossIdeaIcon';
// Components
import { TimedButton } from 'components/buttons/TimedButton';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Event, Gallery, Good, WarehouseSlot } from './utils/types';
import { Warehouse } from './components/Warehouse';

type StepAnimateFulfillmentProps = {
  goodsDict: Dictionary<Good>;
  warehouse: WarehouseSlot[];
  goToNextStep: () => void;
  gallery: Gallery;
} & Pick<StepProps, 'announcement'>;

export function StepAnimateFulfillment({
  announcement,
  goodsDict,
  warehouse,
  goToNextStep,
  gallery,
}: StepAnimateFulfillmentProps) {
  const event = useMemo(() => {
    const event: Event = {
      type: 'REVEAL',
      actorId: '',
      goodsIds: Object.values(gallery.fulfilledOrders).reduce((acc: string[], orders) => {
        orders.forEach((order) => {
          const goodId = order.orderId;
          if (!acc.includes(goodId)) {
            acc.push(goodId);
          }
        });
        return acc;
      }, []),
    };
    return event;
  }, [gallery]);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle icon={<BossIdeaIcon />}>
        <Translate
          pt="Pedidos atendidos!"
          en="Orders fulfilled!"
        />
      </StepTitle>

      <Warehouse
        goodsDict={goodsDict}
        warehouse={warehouse}
        event={event}
      />

      <SpaceContainer>
        <TimedButton
          onClick={goToNextStep}
          onExpire={goToNextStep}
          duration={8}
        >
          <Translate
            en="Continuar"
            pt="Continuar"
          />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
