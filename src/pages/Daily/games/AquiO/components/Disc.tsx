import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';
// Components
import { DivButton } from 'components/buttons/DivButton';
import { ItemCard } from 'components/cards/ItemCard';
// Internal
import type { AquiODisc } from '../utils/types';

const MotionDiv = motion('div');

type DiscProps = {
  disc: AquiODisc;
  onSelect: (itemId: string) => void;
  width: number;
  discProps: ComponentProps<typeof MotionDiv>;
};

/**
 * The disc component that displays items in a circular layout.
 */
export function Disc({ disc, onSelect, width, discProps }: DiscProps) {
  return (
    <MotionDiv
      {...discProps}
      className={clsx('aqui-o-disc', discProps.className)}
      style={{ width: width, height: width }}
    >
      {disc.items.map((item) => (
        <DivButton
          key={item.itemId}
          className={clsx('aqui-o-disc-item', `aqui-o-disc-item--pos-${item.position}`)}
          style={{
            transform: `rotate(${item.rotation}deg) scale(${item.size / 100})`,
            zIndex: item.zIndex,
          }}
          onClick={() => onSelect(item.itemId)}
        >
          <ItemCard itemId={item.itemId} className="aqui-o-disc-sprite" width={width / 4} padding={9} />
        </DivButton>
      ))}
    </MotionDiv>
  );
}
