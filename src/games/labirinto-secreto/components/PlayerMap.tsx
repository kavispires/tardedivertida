// Ant Design Resources
import { Space } from 'antd';
import { IconAvatar } from 'components/avatars';
import { TreeCard } from 'components/cards/TreeCard';
// Components
import { ArrowIcon } from 'icons/ArrowIcon';
import { MapIcon } from 'icons/MapIcon';
import { NoIcon } from 'icons/NoIcon';

type PlayerMapProps = {
  map: MapSegment[];
  selectedTrees?: Tree[];
};

export function PlayerMap({ map = [], selectedTrees = [] }: PlayerMapProps) {
  const currentMap = map.filter((segment) => segment.active);

  return (
    <Space
      wrap
      className="space-container player-map"
      style={{ gridTemplateColumns: `repeat(${currentMap.length}, 100px)` }}
    >
      {currentMap.map((segment, index, arr) => {
        const selectedTree = selectedTrees[index + 1];
        return (
          <div className="player-map__segment" key={`map-${segment.index}`}>
            {selectedTree && (
              <TreeCard
                id={String(selectedTree.treeType)}
                className="player-map__tree"
                text={selectedTree.card.text}
              />
            )}

            <IconAvatar icon={<MapIcon />} size="large" className="player-map__icon" />
            {segment.clues.map((clue) => {
              return (
                <div className="player-map__clue" key={`clue-${segment.index}-${clue.id}`}>
                  {clue.text}
                  {clue?.negate && (
                    <IconAvatar icon={<NoIcon />} size="small" className="player-map__clue-no" />
                  )}
                </div>
              );
            })}

            {arr.length - 1 !== index && (
              <IconAvatar icon={<ArrowIcon />} size="small" className="player-map__arrow" />
            )}
          </div>
        );
      })}
    </Space>
  );
}
