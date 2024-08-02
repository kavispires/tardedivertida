import { SpeechBubble } from 'components/text/SpeechBubble';
import { OnlineOrderIcon } from 'icons/OnlineOrderIcon';
import { Region } from 'pages/Daily/components/Region';
import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
import { getAnimationClass } from 'utils/helpers';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
import clsx from 'clsx';

type CurrentOrderProps = {
  currentOrder: ReturnType<typeof useControleDeEstoqueEngine>['currentOrder'];
  shelfWidth: number;
};
export function CurrentOrder({ currentOrder, shelfWidth }: CurrentOrderProps) {
  return (
    <>
      <OnlineOrderIcon
        width={shelfWidth / 1.5}
        className={getAnimationClass('headShake', { infinite: true })}
      />
      <SpeechBubble size="small">
        <Region>
          {currentOrder && (
            <WarehouseGoodCard
              id={currentOrder}
              width={shelfWidth}
              key={currentOrder}
              className={clsx('current-order', getAnimationClass('lightSpeedInLeft'))}
            />
          )}
        </Region>
      </SpeechBubble>
    </>
  );
}
