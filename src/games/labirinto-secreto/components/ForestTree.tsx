import clsx from 'clsx';
// Types
import type { MapSegment, Tree, TreeId } from '../utils/types';
// Utils
import { getOriginDirection } from '../utils/helpers';
import { getAnimationClass } from 'utils/helpers';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
import { ArrowIcon } from 'icons/ArrowIcon';
import { CompassIcon } from 'icons/CompassIcon';
import { FinishLineIcon } from 'icons/FinishLineIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TreeCard } from 'components/cards/TreeCard';

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
  width = 75,
}: ForestTreeProps) {
  const isSegment = Boolean(segment);
  const isStartingPoint = startingTeeId === tree.id;
  const originDirection = getOriginDirection(tree.id);
  const isFinalPoint = finalTreeId === tree.id;
  const isCurrentTree = currentTreeId === tree.id;
  const isPassed = (segment?.passed && !isCurrentTree) ?? false;

  return (
    <div
      className={clsx(
        'forest__tree',
        isStartingPoint && `forest__tree--${originDirection}`,
        isFinalPoint && showPath && 'forest__tree--goal',
        isSegment && showPath && 'forest__tree--segment',
        isPassed && 'forest__tree--passed',
        isCurrentTree && 'forest__tree--current',
        className
      )}
    >
      <TreeCard
        id={String(tree.treeType)}
        text={segment?.passed && hidePassedTreeNames ? '' : tree.card.text}
        width={width}
      />
      {showPath && isFinalPoint && (
        <IconAvatar
          icon={<FinishLineIcon />}
          size="large"
          className={`forest__end forest__end--${segment.direction}`}
        />
      )}

      {isCurrentTree && (
        <div className="forest__compass">
          <IconAvatar
            icon={<CompassIcon />}
            size="large"
            className={clsx('forest__compass-icon', getAnimationClass('pulse', { infinite: true }))}
          />
        </div>
      )}
      {isStartingPoint && (
        <IconAvatar
          icon={<FlagIcon />}
          size="large"
          className={`forest__start forest__start--${originDirection}`}
        />
      )}
      {(showArrow || showPath || isPassed) && !isFinalPoint && isSegment && segment.direction && (
        <IconAvatar
          icon={<ArrowIcon />}
          size="large"
          className={`forest__arrow forest__arrow--${segment.direction}`}
        />
      )}
    </div>
  );
}
