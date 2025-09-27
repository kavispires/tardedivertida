import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard as Suspect } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Icons
import { XIcon } from 'icons/XIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { SuspectCard } from 'components/cards/SuspectCard';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';

type CharactersBoardProps = {
  grid: string[];
  identitiesDict: Dictionary<Suspect>;
  onSelectSuspect?: (suspect: CardId) => void;
  playerSuspectId: string;
  selectedSuspectId?: string | null;
  interactive?: boolean;
  disabledList?: CardId[];
  tags?: CardId[];
  selectedPlayer?: GamePlayer;
};

export function CharactersBoard({
  grid,
  identitiesDict,
  onSelectSuspect,
  selectedSuspectId,
  playerSuspectId,
  interactive,
  disabledList,
  selectedPlayer,
  tags,
}: CharactersBoardProps) {
  const columns = getBoardSplit(grid);
  const cardWidth = useCardWidth(columns, { minWidth: 75, maxWidth: 125, gap: 16 });

  return (
    <TitledContainer title={<Translate pt="Personagens" en="Characters" />}>
      <div
        className={clsx('ta-na-cara-characters-board', `ta-na-cara-characters-board--${columns}`)}
        style={{ backgroundColor: selectedPlayer ? getAvatarColorById(selectedPlayer?.avatarId) : undefined }}
      >
        {selectedPlayer && (
          <div
            className="ta-na-cara-characters-board-avatar"
            style={{
              backgroundColor: selectedPlayer ? getAvatarColorById(selectedPlayer?.avatarId) : undefined,
            }}
          >
            <Avatar id={selectedPlayer?.avatarId} />
          </div>
        )}
        {grid.map((cellId) => {
          const suspect = identitiesDict[cellId];
          const isPlayerCharacter = playerSuspectId === cellId;
          const isDisabled = disabledList?.includes(cellId);
          const isTagged = tags?.includes(cellId);

          if (onSelectSuspect && interactive && !isPlayerCharacter && !isDisabled) {
            return (
              <TransparentButton
                key={cellId}
                className="ta-na-cara-suspect"
                onClick={() => onSelectSuspect?.(suspect.id)}
                activeClass="ta-na-cara-suspect--is-active"
                active={selectedSuspectId === cellId}
                hoverType="tint"
              >
                {isTagged && (
                  <span className="ta-na-cara-suspect--tagged">
                    <IconAvatar icon={<XIcon />} size="large" />
                  </span>
                )}
                <SuspectCard
                  width={cardWidth}
                  suspect={suspect}
                  preview={false}
                  className={clsx({ 'ta-na-cara-suspect--is-tagged': isTagged })}
                />
              </TransparentButton>
            );
          }

          return (
            <div key={cellId} className="ta-na-cara-suspect ta-na-cara-suspect--non-button">
              {isPlayerCharacter && (
                <span className="ta-na-cara-suspect--is-player">
                  <Translate pt="Você" en="You" />
                </span>
              )}
              {isTagged && (
                <span className="ta-na-cara-suspect--tagged">
                  <IconAvatar icon={<XIcon />} size="large" />
                </span>
              )}
              <SuspectCard
                width={cardWidth}
                suspect={suspect}
                className={clsx({ 'ta-na-cara-suspect--is-tagged': isTagged })}
              />
            </div>
          );
        })}
      </div>
    </TitledContainer>
  );
}

const getBoardSplit = (grid: string[]) => {
  const { length } = grid;
  if (length === 25) return 5;
  return 6;
};
