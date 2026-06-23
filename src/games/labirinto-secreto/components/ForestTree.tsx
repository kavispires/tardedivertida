import clsx from 'clsx';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { ArrowIcon } from '@icons/ArrowIcon';
import { CompassIcon } from '@icons/CompassIcon';
import { FinishLineIcon } from '@icons/FinishLineIcon';
import { FlagIcon } from '@icons/FlagIcon';
// Components
import { Icon } from '@components/general/Icon';
// Internal
import type { Direction, MapSegment, Tree, TreeId } from '../utils/types';
import { getOriginDirection } from '../utils/helpers';
import { TreeImage } from './TreeImage';

/**
 * Determines the direction FROM which the segment is coming (where the previous tree is)
 */
const getIncomingDirection = (currentTreeId: TreeId, previousTreeId: TreeId | null): Direction | null => {
  if (previousTreeId === null || previousTreeId === undefined) return null;

  const difference = currentTreeId - previousTreeId;

  // The direction calculated is where the previous tree is positioned relative to current
  if (difference === 1) return 'LEFT'; // Previous tree is to the left
  if (difference === -1) return 'RIGHT'; // Previous tree is to the right
  if (difference === 7) return 'UP'; // Previous tree is above (7 = forest width)
  if (difference === -7) return 'DOWN'; // Previous tree is below
  if (difference === 6) return 'UP_RIGHT'; // Previous tree is up-left diagonal
  if (difference === 8) return 'UP_LEFT'; // Previous tree is up-right diagonal
  if (difference === -6) return 'DOWN_LEFT'; // Previous tree is down-right diagonal
  if (difference === -8) return 'DOWN_RIGHT'; // Previous tree is down-left diagonal

  return null;
};

type ForestTreeProps = {
  segment: MapSegment;
  tree: Tree;
  startingTeeId?: TreeId;
  finalTreeId?: TreeId;
  currentTreeId?: TreeId;
  showPath?: boolean;
  showArrow?: boolean;
  className?: string;
  hidePassedTreeNames?: boolean;
  width?: number;
};

export function ForestTree({
  segment,
  tree,
  startingTeeId,
  finalTreeId,
  currentTreeId,
  showPath = false,
  showArrow = false,
  className = '',
  hidePassedTreeNames = false,
  width = 72,
}: ForestTreeProps) {
  const isSegment = Boolean(segment);
  const isStartingPoint = startingTeeId === tree.id;
  const originDirection = getOriginDirection(tree.id);
  const isFinalPoint = finalTreeId === tree.id;
  const isCurrentTree = currentTreeId === tree.id;
  const isPassed = (segment?.passed && !isCurrentTree) ?? false;

  // For the final point, determine which direction the path is coming from
  const finishLineDirection = isFinalPoint
    ? getIncomingDirection(segment.treeId, segment.previousTree)
    : null;

  return (
    <div
      className={clsx(
        'forest__tree',
        isStartingPoint && `forest__tree--${originDirection}`,
        {
          'forest__tree--blocked': tree.blocked,
          'forest__tree--goal': isFinalPoint && showPath,
          'forest__tree--segment': isSegment && showPath,
          'forest__tree--passed': isPassed,
          'forest__tree--current': isCurrentTree,
        },
        className,
      )}
    >
      <TreeImage
        id={tree.treeType}
        text={segment?.passed && hidePassedTreeNames ? '' : tree.card.text}
        width={width * (tree.blocked ? 0.5 : 0.8)}
      />
      {showPath && isFinalPoint && (
        <Icon
          icon={<FinishLineIcon />}
          className={`forest__end forest__end--${finishLineDirection}`}
        />
      )}

      {isCurrentTree && (
        <div className="forest__compass">
          <Icon
            icon={<CompassIcon />}
            size="large"
            className={clsx('forest__compass-icon', getAnimationClass('pulse', { infinite: true }))}
          />
        </div>
      )}
      {isStartingPoint && (
        <Icon
          icon={<FlagIcon />}
          size="large"
          className={`forest__start forest__start--${originDirection}`}
        />
      )}
      {(showArrow || showPath || isPassed) && !isFinalPoint && isSegment && segment.direction && (
        <>
          <span
            className={clsx(
              `forest__arrow-line forest__arrow-line--${segment.direction}`,
              isSegment && showPath && 'forest__tree--segment',
              isPassed && 'forest__tree--passed',
              isCurrentTree && 'forest__tree--current',
            )}
          />
          <Icon
            icon={<ArrowIcon />}
            size="large"
            className={`forest__arrow forest__arrow--${segment.direction}`}
          />
        </>
      )}
    </div>
  );
}
