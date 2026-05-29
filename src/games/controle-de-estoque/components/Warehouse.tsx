import clsx from 'clsx';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
// Utils
import { getAnimation } from 'utils/animations';
import { getAnimationClass } from 'utils/helpers';
// Icons
import { MysteryBoxIcon } from 'icons/MysteryBoxIcon';
import { ShippingBoxIcon } from 'icons/ShippingBoxIcon';
// Components
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
import { ZoomPanPinchContainer } from 'components/layout/ZoomPanPinchContainer';
// Internal
import type { Event, Good, WarehouseSlot } from '../utils/types';
import { useGoodSize } from '../utils/hooks';
import { BOSS_IDEAS_IDS, EVENT_TYPE } from '../utils/constants';

type WarehouseProps = {
  goodsDict: Dictionary<Good>;
  warehouse: WarehouseSlot[];
  onPlaceGood?: (index: number) => void;
  bossIdeaId?: UID;
  event?: Event;
  currentGoodId?: UID;
  selectedWarehouseSlot?: number | null;
};

export function Warehouse({
  goodsDict,
  warehouse,
  onPlaceGood,
  bossIdeaId,
  event,
  currentGoodId,
  selectedWarehouseSlot,
}: WarehouseProps) {
  const { goodSize, goodWidth, warehouseWidth } = useGoodSize();
  const baseDuration = bossIdeaId === BOSS_IDEAS_IDS.BLIND_BOX ? 10 : 4;

  // Track goods that are currently being animated by events
  const [concealingGoods, setConcealingGoods] = useState<Set<string>>(new Set());

  const goodClassName = `warehouse-good--${bossIdeaId}`;
  const isConfidential = bossIdeaId === BOSS_IDEAS_IDS.CONFIDENTIAL;
  const isBlindBox = bossIdeaId === BOSS_IDEAS_IDS.BLIND_BOX;

  // Update concealing goods when event changes
  useEffect(() => {
    if (event?.type === EVENT_TYPE.CONCEAL && event.goodsIds.length > 0) {
      setConcealingGoods(new Set(event.goodsIds));
    }
  }, [event]);

  /**
   * Check if a good should be animated based on the current event
   */
  const shouldAnimateGood = (goodId: string): boolean => {
    return concealingGoods.has(goodId);
  };

  /**
   * Handle animation completion for a concealed good
   */
  const handleConcealComplete = (goodId: string) => {
    setConcealingGoods((prev) => {
      const next = new Set(prev);
      next.delete(goodId);
      return next;
    });
  };

  return (
    <ZoomPanPinchContainer
      maxWidth={warehouseWidth}
      transformWrapperProps={{
        minScale: 0.5,
        maxScale: 2,
        wheel: {
          disabled: true,
        },
      }}
      persistentZoomKey="controle-de-estoque"
    >
      <div className="warehouse">
        {warehouse.map((slot, index) => {
          if (slot.available && !event) {
            return (
              <div
                key={index}
                className={clsx('warehouse__empty-shelf warehouse__empty-available-shelf')}
                style={goodSize}
              >
                {onPlaceGood ? (
                  <button
                    type="button"
                    className="warehouse__empty-shelf-button"
                    onClick={() => onPlaceGood?.(index)}
                  >
                    {slot.temporaryName ?? '?'}
                  </button>
                ) : (
                  (slot.temporaryName ?? '?')
                )}

                {selectedWarehouseSlot === index && currentGoodId && (
                  <div className="warehouse__selected-good">
                    <motion.div {...getAnimation('pulse', { infinite: true })}>
                      {isConfidential || isBlindBox ? (
                        <MysteryBoxIcon width={goodWidth} />
                      ) : (
                        <WarehouseGoodCard
                          goodId={currentGoodId}
                          width={goodWidth}
                          className={clsx(
                            `warehouse__good--${goodsDict[currentGoodId]?.orientation ?? 0}`,
                            goodClassName,
                          )}
                        />
                      )}
                    </motion.div>
                  </div>
                )}
              </div>
            );
          }

          if (slot.amenityId) {
            return null;
          }

          if (slot.goodId) {
            const good = goodsDict[slot.goodId];
            const isConcealing = shouldAnimateGood(good.id);

            // Animate concealment if event is active for this good (regardless of exposed state)
            if (isConcealing) {
              const delayIndex = event?.goodsIds.indexOf(good.id) ?? 0;
              const baseDelay = baseDuration + delayIndex * 0.15;

              return (
                <div
                  key={index}
                  className={clsx('warehouse__shelf', 'warehouse__shelf-active')}
                  style={{ ...goodSize, position: 'relative' }}
                >
                  {/* Good flipping out */}
                  <motion.div
                    initial={{ opacity: 1, rotateY: 0 }}
                    animate={{
                      opacity: 0,
                      rotateY: 90,
                      transition: {
                        duration: 0.4,
                        delay: baseDelay,
                      },
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  >
                    {isConfidential ? (
                      <MysteryBoxIcon width={goodWidth} />
                    ) : (
                      <WarehouseGoodCard
                        goodId={good.id}
                        width={goodWidth}
                        className={clsx(`warehouse__good--${good.orientation ?? 0}`, goodClassName)}
                      />
                    )}
                  </motion.div>

                  {/* Shipping box flipping in */}
                  <motion.div
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{
                      opacity: 1,
                      rotateY: 0,
                      transition: {
                        duration: 0.4,
                        delay: baseDelay + 0.4,
                      },
                    }}
                    onAnimationComplete={() => handleConcealComplete(good.id)}
                    style={{
                      transformStyle: 'preserve-3d',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  >
                    <ShippingBoxIcon width={goodWidth} />
                  </motion.div>
                </div>
              );
            }

            if (good.exposed) {
              return (
                <div
                  key={index}
                  className={clsx('warehouse__shelf', 'warehouse__shelf-active')}
                  style={goodSize}
                >
                  {isConfidential ? (
                    <MysteryBoxIcon
                      width={goodWidth}
                      key={index}
                      className={clsx(getAnimationClass('bounce'))}
                    />
                  ) : (
                    <WarehouseGoodCard
                      goodId={good.id}
                      width={goodWidth}
                      className={clsx(
                        getAnimationClass('bounce'),
                        `warehouse__good--${good.orientation ?? 0}`,
                        goodClassName,
                      )}
                    />
                  )}
                </div>
              );
            }

            // Show shipping box (concealed state)
            return (
              <div
                key={index}
                className={clsx('warehouse__shelf', getAnimationClass('flipInY'))}
                style={goodSize}
              >
                <ShippingBoxIcon width={goodWidth} />
              </div>
            );
          }

          return (
            <div
              key={index}
              className={clsx('warehouse__empty-shelf')}
              style={goodSize}
            >
              .
            </div>
          );
        })}
      </div>
    </ZoomPanPinchContainer>
  );
}
