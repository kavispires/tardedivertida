import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
// Ant Design Resources
import { Flex, Tag } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { LETTERS } from 'utils/constants';
// Icons
import { PliersIcon } from 'icons/PliersIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { ImageCard } from 'components/image-cards/ImageCard';
import { MouseFollowingContent } from 'components/mouse/MouseFollowingContent';
import { ViewOr } from 'components/views';
// Internal
import type { TimeBombCard } from '../utils/types';
import { CARD_IMAGE_NAMES } from '../utils/constants';

type HandTargetProps = {
  hand: TimeBombCard[];
  onSelectCard?: (card: TimeBombCard) => void;
  activeColor?: string;
};

export function HandTarget({ hand, activeColor, onSelectCard }: HandTargetProps) {
  const [isPressed, setIsPressed] = useState(false);

  const cardWidth = useCardWidth(5, {
    minWidth: 84,
    maxWidth: 150,
    gap: 16,
  });

  const totalWidth = hand.length * (cardWidth + 16) - 16;

  useEffect(() => {
    if (!onSelectCard) return;

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onSelectCard]);

  return (
    <Flex
      className="my-4 b-target-hand"
      vertical
      style={{ backgroundColor: activeColor }}
    >
      <ViewOr condition={!!onSelectCard}>
        <div>
          <MouseFollowingContent active>
            <motion.div
              style={{ pointerEvents: 'none' }}
              animate={{
                rotate: isPressed ? -10 : 0,
                scale: isPressed ? 0.9 : 1,
              }}
              transition={{
                duration: 0.1,
                ease: 'easeOut',
              }}
            >
              <IconAvatar
                icon={<PliersIcon />}
                size={64}
                style={{
                  rotate: '-180deg',
                  transform: 'translate(-50%, 250%)',
                  transformOrigin: 'bottom left',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          </MouseFollowingContent>
          <Flex wrap>
            {hand.map((card: TimeBombCard, index: number) => {
              return (
                <TransparentButton
                  onClick={() => onSelectCard?.(card)}
                  key={card.id}
                  className="b-card-target-glow"
                >
                  <ImageCard
                    cardWidth={cardWidth}
                    cardId={CARD_IMAGE_NAMES.BACK ?? CARD_IMAGE_NAMES.BLANK}
                    preview={false}
                  />
                  <Tag>{LETTERS[index]}</Tag>
                </TransparentButton>
              );
            })}
          </Flex>
        </div>

        <div>
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
            {hand.map((card: TimeBombCard, index: number) => {
              return (
                <Flex
                  key={card.id}
                  vertical
                  className="b-card-target-glow"
                  align="center"
                >
                  <ImageCard
                    cardWidth={cardWidth}
                    cardId={CARD_IMAGE_NAMES.BACK ?? CARD_IMAGE_NAMES.BLANK}
                    preview={false}
                  />

                  <Tag>{LETTERS[index]}</Tag>
                </Flex>
              );
            })}
          </Flex>
        </div>
      </ViewOr>
    </Flex>
  );
}
