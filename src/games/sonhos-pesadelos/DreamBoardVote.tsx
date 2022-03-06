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
import { Translate, Ribbon } from 'components';
import { DreamButton } from './DreamButton';
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
  table: STable;
  user: GamePlayer;
  activeItem: string;
  onActivateItem: GenericFunction;
  votes: PlainObject;
};

export function DreamBoardVote({ table, user, activeItem, onActivateItem, votes }: DreamBoardVoteProps) {
  const cardWidth = useCardWidth(table.length / 2, 40);
  const liButtonBaseClass = 'a-evaluation-all-drawings__li-drawing-button';

  return (
    <ul className="s-dream-board">
      {table.map((entry) => {
        const isDream = Boolean(user.dreams[entry.cardId]);
        const isNightmare = user.nightmares.includes(entry.cardId);
        const cardEntryId = getEntryId(['card', entry.cardId]);
        const isActive = activeItem === cardEntryId;
        const ribbonId = getClueId(votes, cardEntryId);

        return (
          <li
            className={clsx(
              's-dream-board-entry',
              liButtonBaseClass,
              isActive && `${liButtonBaseClass}--active`
            )}
            key={`board-${entry.cardId}`}
            style={{ maxWidth: `${cardWidth + 20}px` }}
          >
            {ribbonId && <Ribbon label={ribbonId.charAt(ribbonId.length - 1)} />}
            <DreamCard
              cardId={entry.cardId}
              cardWidth={cardWidth}
              isDream={isDream}
              isNightmare={isNightmare}
            />

            {isDream ? (
              <DreamButton />
            ) : (
              <SelectButton cardEntryId={cardEntryId} onActivateItem={onActivateItem} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
