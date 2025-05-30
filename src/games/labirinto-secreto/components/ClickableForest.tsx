import { findLast } from 'lodash';
import { useState } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { SendButton } from 'components/buttons';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { MouseFollowingContent } from 'components/mouse/MouseFollowingContent';
// Internal
import type { MapSegment, OnSubmitPathGuessFunction, Tree, TreeId } from '../utils/types';
import { buildUserMappingForLatestTree, getAvailableSegments } from '../utils/helpers';
import { mockFollowedPath } from '../utils/mocks';
import { Forest } from './Forest';
import { PlayerMap } from './PlayerMap';
import { MapEntry } from './MapEntry';
// Ant Design Resources

type ClickableForestProps = {
  forest: Tree[];
  map?: MapSegment[];
  onSubmitPath: OnSubmitPathGuessFunction;
  pathId: PlayerId;
  user: GamePlayer;
  players: GamePlayers;
};

export function ClickableForest({
  forest,
  map = [],
  onSubmitPath,
  pathId,
  user,
  players,
}: ClickableForestProps) {
  const currentMap = map.filter((segment) => !segment.passed && segment.clues.length > 0);
  const currentTreeId = findLast(map, (segment) => segment.passed)?.treeId ?? map?.[0]?.treeId ?? 0;
  const passedTrees = map.filter((segment) => segment.passed).map((segment) => segment.treeId);

  const userMapping = buildUserMappingForLatestTree(user, currentMap, pathId);

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

  // DEV Only
  useMock(() => {
    onSubmitPath({
      guess: mockFollowedPath(map, currentMap, true, Object.values(userMapping).flat().map(Number)),
      pathId,
      choseRandomly: true,
    });
  });

  return (
    <SpaceContainer vertical>
      <PlayerMap map={map} selectedTrees={selectedTrees} />

      <MouseFollowingContent active={Boolean(currentSegment)}>
        <MapEntry
          segment={currentSegment}
          key={currentSegment?.treeId}
          className={getAnimationClass('rubberBand')}
        />
      </MouseFollowingContent>

      <SendButton
        size="large"
        onClick={() => onSubmitPath({ guess: selection.slice(1), pathId, choseRandomly: false })}
        disabled={selection.length - 1 < currentMap.length}
      >
        <Translate pt="Concluir" en="Submit" />
      </SendButton>
      <DevButton
        onClick={() =>
          onSubmitPath({
            guess: mockFollowedPath(map, currentMap, true, Object.values(userMapping).flat().map(Number)),
            pathId,
            choseRandomly: true,
          })
        }
        ghost
      >
        Random Dev
      </DevButton>
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
        playerMapping={userMapping}
        players={players}
      />
    </SpaceContainer>
  );
}
