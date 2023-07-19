// Ant Design Resources
import { Space } from 'antd';
// Components
import { MapEntry } from './MapEntry';

type PlayerMapProps = {
  map: MapSegment[];
  selectedTrees?: Tree[];
  fullMap?: boolean;
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
        return (
          <MapEntry
            className="player-map__segment"
            key={`map-${segment.index}`}
            tree={selectedTree}
            segment={segment}
            showArrow={arr.length - 1 !== index}
          />
        );
      })}
    </Space>
  );
}
