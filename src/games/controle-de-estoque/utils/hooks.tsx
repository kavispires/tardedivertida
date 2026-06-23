import clsx from 'clsx';
import { orderBy } from 'lodash';
import { motion } from 'motion/react';
import { useMemo } from 'react';
// Types
import type { BossIdeaCard } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Icons
import { CraneHookedGoodIcon } from '@icons/CraneHookedGoodIcon';
import { LockedBoxIcon } from '@icons/LockedBoxIcon';
import { MysteryBoxIcon } from '@icons/MysteryBoxIcon';
// Components
import { WarehouseGoodCard } from '@components/cards/WarehouseGoodCard';
// Internal
import type { Good, WarehouseSlot } from './types';
import { BOSS_IDEAS_IDS } from './constants';

export const useGoodSize = () => {
  const cardWidth = useCardWidth(9, {
    minWidth: 48,
    maxWidth: 96,
    margin: 16,
  });

  return {
    goodSize: { width: cardWidth, height: cardWidth },
    goodWidth: cardWidth - 12,
    warehouseWidth: cardWidth * 7 + 16 * 6,
  };
};

/**
 * Hook to transform the warehouse grid object into an ordered array based on the slot id
 * This is necessary because the warehouse grid is stored as a dictionary for easier access, but we need it as an array to render it in the correct order
 */
export const useWarehouse = (warehouseGrid: Dictionary<WarehouseSlot>) => {
  return useMemo(() => orderBy(warehouseGrid, ['id']), [warehouseGrid]);
};

export const useGoodComponentAndClass = ({
  bossIdea,
  currentGood,
  isUserTheSupervisor,
  goodWidth,
  step,
}: {
  bossIdea: BossIdeaCard;
  currentGood: Good;
  isUserTheSupervisor: boolean;
  goodWidth: number;
  step: 'placing' | 'packing';
}) => {
  const isPackingStep = step === 'packing';

  // Determine the special class name that should be applied to a good icon
  const goodClassName = useMemo(() => {
    // Supervisor ideas limitations both steps
    if (BOSS_IDEAS_IDS.EYE_EXAM === bossIdea.id) {
      return isUserTheSupervisor ? `warehouse-good--${bossIdea.id}` : '';
    }

    // All players limitations during both steps
    if (BOSS_IDEAS_IDS.TINTED_GLASS === bossIdea.id) {
      return `warehouse-good--${bossIdea.id}`;
    }

    return '';
  }, [isUserTheSupervisor, bossIdea.id]);

  // Determine the special boss ideas that change the good icon to be rendered
  const goodComponent = useMemo(() => {
    // Supervisor can't see during placement
    if (bossIdea.id === BOSS_IDEAS_IDS.CRANE && isUserTheSupervisor && !isPackingStep) {
      return (
        <motion.div
          animate={{
            rotate: [-10, 5, -10],
          }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            repeatType: 'loop',
          }}
          style={{
            transformOrigin: 'top center',
          }}
        >
          <CraneHookedGoodIcon width={goodWidth} />
        </motion.div>
      );
    }

    // Only supervisor can see during both steps
    if (bossIdea.id === BOSS_IDEAS_IDS.CONFIDENTIAL && !isUserTheSupervisor) {
      return <LockedBoxIcon width={goodWidth} />;
    }

    // Workers can't see during placement
    if (bossIdea.id === BOSS_IDEAS_IDS.BLIND_BOX && !isUserTheSupervisor) {
      return <MysteryBoxIcon width={goodWidth} />;
    }

    if (bossIdea.id === BOSS_IDEAS_IDS.DAMAGED_GOOD) {
      return (
        <div className="warehouse-good__damaged-container">
          <WarehouseGoodCard
            goodId={currentGood.id}
            width={goodWidth}
            className={clsx(`warehouse__good--${currentGood.orientation ?? 0}`, goodClassName)}
          />
          <div className="warehouse-good__damaged-overlay" />
        </div>
      );
    }

    return null;
  }, [bossIdea.id, goodWidth, isUserTheSupervisor, isPackingStep, currentGood, goodClassName]);

  return { goodClassName, goodComponent };
};
