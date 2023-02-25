import clsx from 'clsx';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { AVATARS } from 'utils/avatars';
// Icons
import { AnimatedLoaderIcon } from 'icons/AnimatedLoaderIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';

type TableFocusProps = {
  currentPlayer: GamePlayer;
  table: DetetivesImaginativosCardEntry[];
};

export function TableFocus({ table, currentPlayer }: TableFocusProps) {
  const cardWidth = useCardWidth(6, 32, 250);

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
    <div className={clsx(baseClass, `${baseClass}--center`)}>
      <div className="d-table__player-entry">
        <div className="d-table__cards">
          {tableEntry?.cards.map((cardId) => {
            return (
              <ImageBlurButtonContainer
                cardId={cardId}
                className="d-table__card"
                key={`table-focus-${cardId}`}
              >
                <ImageCard key={`table-focus-${cardId}`} imageId={cardId} cardWidth={cardWidth} />
              </ImageBlurButtonContainer>
            );
          })}
        </div>
        <div className="d-table__player-info">
          <Avatar id={currentPlayer.avatarId} className="d-table__player-avatar" size="default" />
          <span
            className="d-table__player-bar"
            style={{ backgroundColor: AVATARS[currentPlayer.avatarId].color }}
          />
          <span className="d-table__player-name">{currentPlayer.name}</span>
        </div>
      </div>
    </div>
  );
}
