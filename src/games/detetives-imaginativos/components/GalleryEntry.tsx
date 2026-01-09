import clsx from 'clsx';
import { motion } from 'motion/react';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimation } from 'utils/animations';
import { getAvatarColorById } from 'utils/helpers';
// Icons
import { AnimatedLoaderIcon } from 'icons/AnimatedLoaderIcon';
// Components
import { PlayerAvatar, IconAvatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
// Internal
import type { FinalGalleryEntry } from '../utils/types';

type GalleryEntryProps = {
  players: GamePlayers;
  entry: FinalGalleryEntry;
};

export function GalleryEntry({ entry, players }: GalleryEntryProps) {
  const cardWidth = useCardWidth(8, { minWidth: 96, maxWidth: 128, gap: 16 });

  const baseClass = 'd-table';

  if (!entry || !entry.cards) {
    return (
      <div className={clsx(baseClass, `${baseClass}--center`)}>
        <IconAvatar icon={<AnimatedLoaderIcon />} />
      </div>
    );
  }

  const player = players[entry.playerId];

  return (
    <motion.div
      className={clsx(baseClass, `${baseClass}--center`)}
      {...getAnimation('zoomIn')}
    >
      <div className="d-table__player-entry">
        <div className="d-table__cards">
          {entry.cards.map((cardId) => {
            return (
              <ImageBlurButtonContainer
                cardId={cardId}
                className="d-table__card"
                key={`table-focus-${cardId}`}
              >
                <ImageCard
                  key={`table-focus-${cardId}`}
                  cardId={cardId}
                  cardWidth={cardWidth}
                />
              </ImageBlurButtonContainer>
            );
          })}
        </div>
        <div className="d-table__player-info">
          <PlayerAvatar
            avatarId={player.avatarId}
            className="d-table__player-avatar"
            size="default"
          />
          <span
            className="d-table__player-bar"
            style={{ backgroundColor: getAvatarColorById(player.avatarId) }}
          />
          <span className="d-table__player-name">
            "{entry.clue}" by {player.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
