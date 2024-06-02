// Ant Design Resources
import { Space } from 'antd';
// Types
import type { MapSegment, Tree } from '../utils/types';
// Components
import { MapEntry } from './MapEntry';

type PlayerMapProps = {
  map: MapSegment[];
  selectedTrees?: Tree[];
  fullMap?: boolean;
};

const GOAL_TREE: Tree = {
  id: 0,
  treeType: 0,
  card: { id: '', text: '' },
};

export function PlayerMap({ map = [], selectedTrees = [], fullMap = false }: PlayerMapProps) {
  const currentMap = fullMap ? map : map.filter((segment) => segment.active);

  return (
    <Space
      wrap
      className="space-container player-map"
      style={{ gridTemplateColumns: `repeat(${currentMap.length}, 100px)` }}
    >
      {currentMap.map((segment, index, arr) => {
        const selectedTree = selectedTrees[index + 1];
        console.log({ selectedTree });
        return (
          <MapEntry
            className="player-map__segment"
            key={`map-${segment.index}`}
            tree={arr.length - 1 !== index ? selectedTree : GOAL_TREE}
            segment={segment}
            showArrow={arr.length - 1 !== index}
          />
        );
      })}
    </Space>
  );
}
