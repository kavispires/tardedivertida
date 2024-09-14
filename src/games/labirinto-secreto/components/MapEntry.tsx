import clsx from 'clsx';
// Icons
import { ArrowIcon } from 'icons/ArrowIcon';
import { MapIcon } from 'icons/MapIcon';
import { NoIcon } from 'icons/NoIcon';
// Components
import { IconAvatar } from 'components/avatars';
// Internal
import type { MapSegment, Tree } from '../utils/types';
import { TreeImage } from './TreeImage';

type MapEntryProps = {
  segment: MapSegment;
  tree?: Tree;
  showArrow?: boolean;
  className?: string;
};

export function MapEntry({ segment, tree, showArrow, className }: MapEntryProps) {
  return (
    <div className={clsx('map-entry', className)} key={`map-${segment.index}`}>
      {tree && <TreeImage id={tree.treeType} text={tree.card.text} className="map-entry__tree" />}

      <IconAvatar icon={<MapIcon />} size="large" className="map-entry__icon" />
      {segment.clues.map((clue) => {
        return (
          <div className="map-entry__clue" key={`clue-${segment.index}-${clue.id}`}>
            {clue.text}
            {clue?.negate && <IconAvatar icon={<NoIcon />} size="small" className="map-entry__clue-no" />}
          </div>
        );
      })}

      {showArrow && <IconAvatar icon={<ArrowIcon />} size="small" className="map-entry__arrow" />}
    </div>
  );
}
