import { useState } from 'react';
import { findLast } from 'lodash';
// Ant Design Resources
import { Button, Space } from 'antd';
// Utils
import { getAvailableSegments } from '../utils/helpers';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Forest } from './Forest';
import { Translate } from 'components/language';
import { PlayerMap } from './PlayerMap';
import { MouseFollowingContent } from 'components/mouse/MouseFollowingContent';
import { MapEntry } from './MapEntry';

type ClickableForestProps = {
  forest: Tree[];
  map?: MapSegment[];
  onSubmitPath: GenericFunction;
  pathId: PlayerId;
};

export function ClickableForest({ forest, map = [], onSubmitPath, pathId }: ClickableForestProps) {
  const { isLoading } = useLoading();

  const currentMap = map.filter((segment) => !segment.passed && segment.clues.length > 0);
  const currentTreeId = findLast(map, (segment) => segment.passed)?.treeId ?? map?.[0]?.treeId ?? 0;
  const passedTrees = map.filter((segment) => segment.passed).map((segment) => segment.treeId);

  const [selection, setSelection] = useState<TreeId[]>([currentTreeId]);
  const [activeTree, setActiveTree] = useState<TreeId>(currentTreeId);

  const clickableTrees: TreeId[] = getAvailableSegments(activeTree, [...selection, ...passedTrees]);

  const isDisabled = selection.length > currentMap.length;

  const onSelectTree = (treeId: TreeId) => {
    setActiveTree(treeId);
    const index = selection.indexOf(treeId);
    if (index > -1) {
      setSelection((prev) => prev.slice(0, index + 1));
    } else {
      setSelection((prev) => [...prev, treeId]);
    }
  };

  const selectedTrees = selection.map((treeId) => forest[treeId]);
  const currentSegment = currentMap?.[selection.length - 1];

  return (
    <Space direction="vertical" className="space-container">
      <PlayerMap map={map} selectedTrees={selectedTrees} />

      <MouseFollowingContent active={Boolean(currentSegment)}>
        <MapEntry segment={currentSegment} />
      </MouseFollowingContent>

      <Button
        type="primary"
        size="large"
        onClick={() => onSubmitPath({ guess: selection.slice(1), pathId, choseRandomly: false })}
        disabled={isLoading || selection.length - 1 < currentMap.length}
      >
        <Translate pt="Enviar" en="Submit" />
      </Button>
      <Forest
        forest={forest}
        map={map}
        actions={{
          selection,
          clickableTrees,
          onSelectTree,
          activeTree,
          disabled: isDisabled,
        }}
      />
    </Space>
  );
}
