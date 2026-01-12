import { orderBy } from 'lodash';
import { motion } from 'motion/react';
// Ant Design Resources
import { Flex, Popover, Typography } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { PliersIcon } from 'icons/PliersIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { ImageCard } from 'components/image-cards/ImageCard';
import { Translate } from 'components/language';
// Internal
import type { DataCount, TimeBombCard } from '../utils/types';
import { CARD_IMAGE_NAMES } from '../utils/constants';
import { BlankHighlight, BombHighlight, RedWireHighlight } from './Highlights';

type HandTargetProps = {
  hand: TimeBombCard[];
  onSelectCard?: (card: TimeBombCard) => void;
};

export function HandTarget({ hand, onSelectCard }: HandTargetProps) {
  const cardWidth = useCardWidth(5, {
    minWidth: 100,
    maxWidth: 150,
    gap: 16,
  });

  const totalWidth = hand.length * (cardWidth + 16) - 16;

  return (
    <Flex
      className="my-4"
      vertical
    >
      <motion.div
        animate={{ x: [0, totalWidth - 64, 0] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      >
        <IconAvatar
          icon={<PliersIcon />}
          size={64}
          style={{ rotate: '-220deg', marginBottom: '16px' }}
        />
      </motion.div>
      <Flex wrap>
        {hand.map((card: TimeBombCard) => (
          <Flex
            key={card.id}
            vertical
          >
            <ImageCard
              cardWidth={cardWidth}
              cardId={CARD_IMAGE_NAMES.BACK ?? CARD_IMAGE_NAMES.BLANK}
              preview={false}
            />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
