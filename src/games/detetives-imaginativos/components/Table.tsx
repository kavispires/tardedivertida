import clsx from 'clsx';
import { motion } from 'motion/react';
// Types
import type { GamePlayers } from 'types/player';
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

type TableProps = {
  table: CardEntry[];
  players: GamePlayers;
};

export function Table({ table, players }: TableProps) {
  const cardWidth = useCardWidth(12, { gap: 16 });
  const baseClass = 'd-table';

  if (!table || !table?.length) {
    return (
      <div className={clsx(baseClass, `${baseClass}--center`)}>
        <IconAvatar icon={<AnimatedLoaderIcon />} />
      </div>
    );
  }

  return (
    <div className={baseClass}>
      {table.map((entry) => {
        const { playerId, cards } = entry;
        const playerEntryKey = `table-${playerId}`;
        return (
          <div
            key={playerEntryKey}
            className="d-table__player-entry"
          >
            <div className="d-table__cards">
              {cards.map((cardId) => {
                if (!cardId) {
                  return (
                    <div
                      key={`${playerEntryKey}-placeholder`}
                      className="d-table__card d-table__card-placeholder"
                      style={{ width: '1px' }}
                    />
                  );
                }

                return (
                  <motion.div
                    key={`${playerEntryKey}${cardId}`}
                    {...getAnimation('flipInY', { delay: 0.5 })}
                  >
                    <ImageBlurButtonContainer
                      cardId={cardId}
                      className="d-table__card"
                    >
                      <ImageCard
                        cardId={cardId}
                        cardWidth={cardWidth}
                      />
                    </ImageBlurButtonContainer>
                  </motion.div>
                );
              })}
            </div>
            <div className="d-table__player-info">
              <PlayerAvatar
                avatarId={players[playerId].avatarId}
                className="d-table__player-avatar"
                size="default"
              />
              <span
                className="d-table__player-bar"
                style={{ backgroundColor: AVATARS[players[playerId].avatarId].color }}
              />
              <span className="d-table__player-name">{players[playerId].name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
