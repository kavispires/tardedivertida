import clsx from 'clsx';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { AVATARS } from 'utils/avatars';
import { getAnimationClass } from 'utils/helpers';
// Icons
import { AnimatedLoaderIcon } from 'icons/AnimatedLoaderIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';

type TableProps = {
  table: DetetivesImaginativosCardEntry[];
  players: GamePlayers;
};

export function Table({ table, players }: TableProps) {
  const cardWidth = useCardWidth(12, 16);
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
          <div key={playerEntryKey} className="d-table__player-entry">
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
                  <ImageBlurButtonContainer
                    key={`${playerEntryKey}${cardId}`}
                    cardId={cardId}
                    className={clsx('d-table__card', getAnimationClass('flipInY'))}
                  >
                    <ImageCard imageId={cardId} cardWidth={cardWidth} />
                  </ImageBlurButtonContainer>
                );
              })}
            </div>
            <div className="d-table__player-info">
              <Avatar id={players[playerId].avatarId} className="d-table__player-avatar" size="default" />
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
