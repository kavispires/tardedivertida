import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getEntryId } from 'utils/helpers';
// Components
import { ImageBlurButton, ImageCardSelectButton } from 'components/image-cards';
import { RibbonGroup } from 'components/ribbons';
// Internal
import { getClueId } from '../utils/helpers';
import { DreamCard } from './DreamCard';
// Components

type DreamBoardVoteProps = {
  table: ImageCardId[];
  user: GamePlayer;
  activeItem: string;
  onActivateItem: GenericFunction;
  votes: PlainObject;
};

export function DreamBoardVote({ table, activeItem, onActivateItem, votes }: DreamBoardVoteProps) {
  const cardWidth = useCardWidth(table.length + 1, { gap: 20, margin: 50 });
  const liButtonBaseClass = 'a-evaluation-all-drawings__li-drawing-button';

  return (
    <ul className="s-dream-board">
      {table.map((cardId) => {
        const cardEntryId = getEntryId(['card', cardId]);
        const isActive = activeItem === cardEntryId;
        const ribbonIds = getClueId(votes, cardEntryId);

        return (
          <li
            className={clsx(
              's-dream-board__entry',
              liButtonBaseClass,
              isActive && `${liButtonBaseClass}--active`,
            )}
            key={`board-${cardId}`}
            style={{ maxWidth: `${cardWidth + 20}px` }}
          >
            <div className="s-dream-board__card-container">
              <RibbonGroup labels={ribbonIds} />
              <DreamCard
                cardId={cardId}
                cardWidth={cardWidth}
                hideBlurButton
              />
              <ImageCardSelectButton
                cardId={cardEntryId}
                onClick={onActivateItem}
              />
            </div>
            <ImageBlurButton cardId={cardId} />
          </li>
        );
      })}
    </ul>
  );
}
