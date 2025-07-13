// Icons
import { NoIcon } from 'icons/NoIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { ExtendedTextCard, MapSegment, Tree } from '../utils/types';
import { TreeImage } from './TreeImage';

type PlayerSelectionMapProps = {
  forest: Tree[];
  map?: MapSegment[];
  newMap?: (ExtendedTextCard | null)[];
};

export function PlayerSelectionMap({ forest, map, newMap }: PlayerSelectionMapProps) {
  if (!newMap || !map) {
    return null;
  }

  const userMap: MapSegment[] = (map ?? []).filter((segment: MapSegment) => !segment.passed);

  return (
    <SpaceContainer wrap>
      {userMap.map((segment, index) => {
        const { treeId, passed } = segment;
        const tree = forest[treeId];
        const mapLocation = newMap?.[index];
        return (
          <div key={treeId} className="map-builder__segment">
            {!!mapLocation && (
              <div className="map-builder__card map-builder__card--new">
                {mapLocation.text}
                {mapLocation?.negate && (
                  <IconAvatar icon={<NoIcon />} size="small" className="map-builder__card-no" />
                )}
              </div>
            )}
            {segment.clues.map((clue) => {
              return (
                <div className="map-builder__card" key={`card-${segment.index}-${clue.id}`}>
                  {clue.text}
                  {clue?.negate && (
                    <IconAvatar icon={<NoIcon />} size="small" className="map-builder__card-no" />
                  )}
                </div>
              );
            })}

            <TreeImage id={tree.treeType} text={passed ? '' : tree.card.text} />
          </div>
        );
      })}
    </SpaceContainer>
  );
}
