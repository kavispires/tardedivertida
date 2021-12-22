import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { CheckCircleFilled, PlusCircleFilled } from '@ant-design/icons';
// Utils
import { getColorFromIndex } from '../../utils/helpers';
import { Avatar } from '../../components/avatars';

function ClueCard({ isMatched, isSelected, clue, indexColor, color, player, strikeMatches = false }) {
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
            <Avatar id={player.avatarId} />
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

ClueCard.propTypes = {
  clue: PropTypes.string,
  color: PropTypes.string,
  indexColor: PropTypes.number,
  isMatched: PropTypes.bool,
  isSelected: PropTypes.string,
  player: PropTypes.shape({
    avatarId: PropTypes.string,
  }),
  strikeMatches: PropTypes.bool,
};

export default ClueCard;
