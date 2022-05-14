import clsx from 'clsx';
// Hooks
import { useCardWidth } from 'hooks';
// Utils
import { AVATARS } from 'utils/constants';
// Components
import { Avatar, AvatarIcon } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { getAnimationClass } from 'utils/helpers';

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
        <AvatarIcon type="animated-loader" />
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
                    cardId={cardId}
                    className={clsx('d-table__card', getAnimationClass('flipInY'))}
                  >
                    <ImageCard key={`${playerEntryKey}${cardId}`} imageId={cardId} cardWidth={cardWidth} />
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
