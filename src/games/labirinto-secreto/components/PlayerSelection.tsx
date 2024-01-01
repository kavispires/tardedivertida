// Ant Design Resources
import { Space } from 'antd';
import { IconAvatar } from 'components/avatars';
// Types
import type { ExtendedTextCard, MapSegment, Tree } from '../utils/types';
// Icons
import { NoIcon } from 'icons/NoIcon';
// Components
import { TreeCard } from 'components/cards/TreeCard';

type PlayerSelectionMapProps = {
  forest: Tree[];
  map?: MapSegment[];
  newMap?: (ExtendedTextCard | null)[];
};

export function PlayerSelectionMap({ forest, map, newMap }: PlayerSelectionMapProps) {
  if (!newMap || !map) {
    return <></>;
  }

  const userMap: MapSegment[] = (map ?? []).filter((segment: MapSegment) => !segment.passed);

  return (
    <Space wrap className="space-container">
      {userMap.map((segment, index) => {
        const { treeId, passed } = segment;
        const tree = forest[treeId];
        return (
          <div className="map-builder__segment">
            {Boolean(newMap?.[index]) && (
              <div className="map-builder__card map-builder__card--new">
                {newMap?.[index]!.text}
                {newMap?.[index]?.negate && (
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

            <TreeCard id={String(tree.treeType)} text={passed ? '' : tree.card.text} />
          </div>
        );
      })}
    </Space>
  );
}
