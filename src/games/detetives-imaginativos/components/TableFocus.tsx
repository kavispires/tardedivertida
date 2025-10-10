import clsx from 'clsx';
import { motion } from 'motion/react';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimation } from 'utils/animations';
import { AVATARS } from 'utils/avatars';
// Icons
import { AnimatedLoaderIcon } from 'icons/AnimatedLoaderIcon';
// Components
import { PlayerAvatar, IconAvatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
// Internal
import type { CardEntry } from '../utils/types';

type TableFocusProps = {
  currentPlayer: GamePlayer;
  table: CardEntry[];
};

export function TableFocus({ table, currentPlayer }: TableFocusProps) {
  const cardWidth = useCardWidth(6, { minWidth: 250 });

  const tableEntry = table.find((entry) => entry.playerId === currentPlayer.id);
  const baseClass = 'd-table';

  if (!currentPlayer || !tableEntry?.cards) {
    return (
      <div className={clsx(baseClass, `${baseClass}--center`)}>
        <IconAvatar icon={<AnimatedLoaderIcon />} />
      </div>
    );
  }

  return (
    <motion.div className={clsx(baseClass, `${baseClass}--center`)} {...getAnimation('slideInRight')}>
      <div className="d-table__player-entry">
        <div className="d-table__cards">
          {tableEntry?.cards.map((cardId) => {
            return (
              <ImageBlurButtonContainer
                cardId={cardId}
                className="d-table__card"
                key={`table-focus-${cardId}`}
              >
                <ImageCard key={`table-focus-${cardId}`} cardId={cardId} cardWidth={cardWidth} />
              </ImageBlurButtonContainer>
            );
          })}
        </div>
        <div className="d-table__player-info">
          <PlayerAvatar avatarId={currentPlayer.avatarId} className="d-table__player-avatar" size="default" />
          <span
            className="d-table__player-bar"
            style={{ backgroundColor: AVATARS[currentPlayer.avatarId].color }}
          />
          <span className="d-table__player-name">{currentPlayer.name}</span>
        </div>
      </div>
    </motion.div>
  );
}
