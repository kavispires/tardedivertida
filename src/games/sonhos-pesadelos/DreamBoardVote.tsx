import clsx from 'clsx';
// Ant Design Resources
import { Button } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks';
// Utils
import { getEntryId } from 'utils/helpers';
import { getClueId } from './helpers';
// Components
import { Translate, Ribbon, RibbonGroup } from 'components';
import { DreamCard } from './DreamCard';

type SelectButtonProps = {
  onActivateItem: GenericFunction;
  cardEntryId: string;
};

function SelectButton({ onActivateItem, cardEntryId }: SelectButtonProps) {
  return (
    <Button ghost block size="small" onClick={() => onActivateItem(cardEntryId)}>
      <CaretUpOutlined />
      <Translate pt="Selecionar" en="Select" />
      <CaretUpOutlined />
    </Button>
  );
}

type DreamBoardVoteProps = {
  table: ImageCard[];
  user: GamePlayer;
  activeItem: string;
  onActivateItem: GenericFunction;
  votes: PlainObject;
};

export function DreamBoardVote({ table, activeItem, onActivateItem, votes }: DreamBoardVoteProps) {
  const cardWidth = useCardWidth(table.length + 1, 20);
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
              isActive && `${liButtonBaseClass}--active`
            )}
            key={`board-${cardId}`}
            style={{ maxWidth: `${cardWidth + 20}px` }}
          >
            <RibbonGroup labels={ribbonIds} />
            <DreamCard cardId={cardId} cardWidth={cardWidth} />
            <SelectButton cardEntryId={cardEntryId} onActivateItem={onActivateItem} />
          </li>
        );
      })}
    </ul>
  );
}
