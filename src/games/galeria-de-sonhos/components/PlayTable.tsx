import clsx from 'clsx';
import { motion } from 'motion/react';
// Ant Design Resources
import { Image } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
// Utils
import { getAnimation } from 'utils/animations';
import { getAnimationClass } from 'utils/helpers';
// Icons
import { StarIcon } from 'icons/StarIcon';
// Components
import { ImageCard, ImageCardBack, ImageCardButton } from 'components/image-cards';
import { Translate } from 'components/language';
// Internal
import type { ImageCardObj } from '../utils/types';
import { BORDER_TOTAL_SIZE } from '../utils/constants';

type PlayTableProps = {
  table: ImageCardObj[];
  onPlayCard: (cardId: string) => void;
  userCards: PlainObject;
  isPlayAvailable: boolean;
};

export function PlayTable({ table, onPlayCard, userCards, isPlayAvailable }: PlayTableProps) {
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(5, { gap: 8, minWidth: 140, maxWidth: 150 });

  return (
    <Image.PreviewGroup>
      <div className="g-table-container">
        <ul className="g-table">
          {table.map((card, index) => {
            const isSelected = Boolean(userCards?.[card.id]);
            const userCardEntry = userCards[card.id] ?? {};
            if (card.used) {
              return (
                <motion.li
                  key={`g-table-${card.id}`}
                  className="g-table-item"
                  style={{ width: `${cardWidth + 8}px` }}
                  {...getAnimation('fadeIn', { delay: index * 0.1 })}
                >
                  <ImageCardButton
                    cardId={card.id}
                    onClick={() => onPlayCard(card.id)}
                    over
                    buttonPosition="bottom"
                    hideButton
                  >
                    <ImageCardBack
                      cardWidth={cardWidth - BORDER_TOTAL_SIZE}
                      className={clsx(
                        'g-table-image',
                        isSelected && 'g-table-image--selected',
                        getAnimationClass('zoomIn'),
                      )}
                      previewImageId={card.id}
                    />
                    {userCardEntry.used && (
                      <div className="g-star-points">
                        <motion.div {...getAnimation('zoomIn', { delay: table.length * 0.1, duration: 0.4 })}>
                          {userCardEntry.score === 3 && <StarIcon className="g-star g-star--super-spark" />}
                        </motion.div>
                        <motion.div {...getAnimation('zoomIn', { delay: table.length * 0.1, duration: 0.3 })}>
                          {userCardEntry.score > 1 && <StarIcon className="g-star g-star--spark" />}
                        </motion.div>
                        <motion.div {...getAnimation('zoomIn', { delay: table.length * 0.1, duration: 0.2 })}>
                          {userCardEntry.score > 0 && <StarIcon className="g-star g-star--spark" />}
                        </motion.div>
                      </div>
                    )}
                  </ImageCardButton>
                </motion.li>
              );
            }

            return (
              <motion.li
                key={`g-table-${card.id}`}
                className="g-table-item"
                style={{ width: `${cardWidth + 8}px` }}
                {...getAnimation('fadeIn', { delay: index * 0.1 })}
              >
                <ImageCardButton
                  cardId={card.id}
                  onClick={() => onPlayCard(card.id)}
                  over
                  buttonPosition="bottom"
                  hideButton={!isPlayAvailable || !userCards[card.id]}
                  buttonText={<Translate pt="Selecionar" en="Select" />}
                  disabled={isLoading}
                  throttle
                >
                  <ImageCard
                    cardId={card.id}
                    cardWidth={cardWidth - BORDER_TOTAL_SIZE} // 6 is the border total size
                    className={clsx('g-table-image', isSelected && 'g-table-image--selected')}
                  />
                </ImageCardButton>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </Image.PreviewGroup>
  );
}
