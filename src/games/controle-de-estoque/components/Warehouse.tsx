import clsx from 'clsx';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
// Utils
import { getAnimation } from '@utils/animations';
import { getAnimationClass } from '@utils/helpers';
// Icons
import { ShippingBoxIcon } from '@icons/ShippingBoxIcon';
// Components
import { WarehouseGoodCard } from '@components/cards/WarehouseGoodCard';
import { ZoomPanPinchContainer } from '@components/layout/ZoomPanPinchContainer';
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
  goodClassName?: string;
  goodComponent?: React.ReactNode;
};

export function Warehouse({
  goodsDict,
  warehouse,
  onPlaceGood,
  bossIdeaId,
  event,
  currentGoodId,
  selectedWarehouseSlot,
  goodClassName,
  goodComponent,
}: WarehouseProps) {
  const { goodSize, goodWidth, warehouseWidth } = useGoodSize();
  const baseDuration = bossIdeaId === BOSS_IDEAS_IDS.BLIND_BOX ? 10 : 4;

  // Track goods that are currently being animated by events
  const [concealingGoods, setConcealingGoods] = useState<Set<string>>(new Set());
  const [revealingGoods, setRevealingGoods] = useState<Set<string>>(new Set());

  // Update concealing goods when event changes
  useEffect(() => {
    if (event?.type === EVENT_TYPE.CONCEAL && event.goodsIds.length > 0) {
      setConcealingGoods(new Set(event.goodsIds));
    } else if (event?.type === EVENT_TYPE.REVEAL && event.goodsIds.length > 0) {
      setRevealingGoods(new Set(event.goodsIds));
    }
  }, [event]);

  /**
   * Check if a good should be animated based on the current event
   */
  const shouldConcealGood = (goodId: string): boolean => {
    return concealingGoods.has(goodId);
  };

  const shouldRevealGood = (goodId: string): boolean => {
    return revealingGoods.has(goodId);
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

  /**
   * Handle animation completion for a revealed good
   */
  const handleRevealComplete = (goodId: string) => {
    setRevealingGoods((prev) => {
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
                      {goodComponent ?? (
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
            const isConcealing = shouldConcealGood(good.id);
            const isRevealing = shouldRevealGood(good.id);

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
                    {goodComponent ?? (
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

            // Animate reveal: shipping box → good
            if (isRevealing) {
              const delayIndex = event?.goodsIds.indexOf(good.id) ?? 0;
              const baseDelay = 1 + delayIndex * 0.15;

              return (
                <div
                  key={index}
                  className={clsx('warehouse__shelf', 'warehouse__shelf-active')}
                  style={{ ...goodSize, position: 'relative' }}
                >
                  {/* Shipping box flipping out */}
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
                    <ShippingBoxIcon width={goodWidth} />
                  </motion.div>

                  {/* Good flipping in */}
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
                    onAnimationComplete={() => handleRevealComplete(good.id)}
                    style={{
                      transformStyle: 'preserve-3d',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  >
                    {goodComponent ?? (
                      <WarehouseGoodCard
                        goodId={good.id}
                        width={goodWidth}
                        className={clsx(`warehouse__good--${good.orientation ?? 0}`, goodClassName)}
                      />
                    )}
                  </motion.div>
                </div>
              );
            }

            if (good.exposed || (!revealingGoods.has(good.id) && slot.orderId)) {
              return (
                <div
                  key={index}
                  className={clsx('warehouse__shelf', 'warehouse__shelf-active', {
                    'warehouse__shelf-fulfilled': good.fulfilledId,
                  })}
                  style={goodSize}
                >
                  {goodComponent ? (
                    <div
                      key={index}
                      className={clsx(getAnimationClass('bounce'))}
                    >
                      {goodComponent}
                    </div>
                  ) : (
                    <WarehouseGoodCard
                      goodId={good.id}
                      width={goodWidth}
                      className={clsx(
                        { [getAnimationClass('bounce')]: !good.fulfilledId },
                        { 'warehouse__good--fulfilled': good.fulfilledId },
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
