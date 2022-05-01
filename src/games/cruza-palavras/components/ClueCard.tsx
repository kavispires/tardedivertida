import clsx from 'clsx';
// Ant Design Resources
import { CheckCircleFilled, PlusCircleFilled } from '@ant-design/icons';
// Utils
import { getColorFromIndex } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';

type ClueCardProps = {
  isMatched?: boolean;
  isSelected?: boolean;
  clue?: string;
  indexColor?: number;
  color?: string;
  player?: GamePlayer;
  strikeMatches?: boolean;
};

export function ClueCard({
  isMatched,
  isSelected,
  clue,
  indexColor = 0,
  color,
  player,
  strikeMatches = false,
}: ClueCardProps) {
  const colorClass = getColorFromIndex(indexColor);
  return (
    <div
      className={clsx(
        'x-clue-card',
        isSelected && 'x-clue-card--selected',
        !Boolean(color) && `color-border--${colorClass}`
      )}
      style={{ borderColor: color }}
    >
      <span
        className={clsx('x-clue-card__icon', !Boolean(color) && `color-background--${colorClass}`)}
        style={{ backgroundColor: color }}
      >
        {isMatched ? (
          Boolean(player) ? (
            <Avatar id={player?.avatarId} />
          ) : (
            <CheckCircleFilled />
          )
        ) : (
          <PlusCircleFilled style={isSelected ? { color: 'gold' } : { color: 'white' }} />
        )}
      </span>
      <span className={clsx('x-clue-card__clue', isMatched && strikeMatches && 'x-clue-card__clue--matched')}>
        {clue}
      </span>
    </div>
  );
}
