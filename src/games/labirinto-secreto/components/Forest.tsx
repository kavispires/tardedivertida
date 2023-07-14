import clsx from 'clsx';
import { findLast } from 'lodash';
// Utils
import { getDirection } from '../utils/helpers';
// Icons
import { ArrowIcon } from 'icons/ArrowIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { ForestTree } from './ForestTree';
import { Space } from 'antd';
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
import { AvatarGroup } from 'components/avatars/AvatarGroup';
import { ViewIf } from 'components/views';

type ForestProps = {
  forest: Tree[];
  map?: MapSegment[];
  showPath?: boolean;
  actions?: {
    selection: TreeId[];
    clickableTrees: TreeId[];
    onSelectTree: (treeId: TreeId) => void;
    activeTree: TreeId | null;
    disabled: boolean;
  };
  showPlayerPositions?: boolean;
  players?: GamePlayers;
  size?: 'small' | 'large';
  hidePassedTreeNames?: boolean;
  user?: GamePlayer;
  activePlayerId?: PlayerId;
};

export function Forest({
  forest,
  map = [],
  showPath,
  actions,
  showPlayerPositions = false,
  players,
  size = 'large',
  hidePassedTreeNames = false,
  user = {},
  activePlayerId = '',
}: ForestProps) {
  if (!forest || !map || map.length === 0) {
    return (
      <Space direction="vertical" className="space-container">
        <IconAvatar icon={<AnimatedProcessingIcon />} size="large" />
      </Space>
    );
  }

  const startingTeeId = map?.[0]?.treeId;
  const treeMap = map.reduce((acc: Record<TreeId, MapSegment>, segment) => {
    acc[segment.treeId] = segment;
    return acc;
  }, {});
  const currentTreeId = findLast(map, (segment) => segment.passed)?.treeId ?? startingTeeId;
  const finalTreeId = map[map.length - 1]?.treeId;

  return (
    <div className={clsx('forest-container', size === 'small' && 'forest-container--small')}>
      <div className="forest">
        {forest.map((tree) => {
          const segment = treeMap?.[tree.id];

          if (actions) {
            const { selection = [], clickableTrees, onSelectTree, activeTree, disabled } = actions;
            const isPathForward = clickableTrees.includes(tree.id);
            const isClickable = isPathForward || selection.includes(tree.id);

            if (isClickable) {
              const isSelected = selection.includes(tree.id);
              const isActive = activeTree === tree.id;
              const selectionIndex = selection.indexOf(tree.id);

              return (
                <div
                  key={`tree-${tree.id}`}
                  className={clsx(
                    'forest__tree-container forest__tree-button',
                    isPathForward && disabled && 'forest__tree-button--disabled'
                  )}
                  onClick={() => {
                    if ((isClickable && !disabled) || (isClickable && disabled && !isPathForward)) {
                      onSelectTree(tree.id);
                    }
                  }}
                  role="button"
                >
                  <ForestTree
                    segment={segment}
                    tree={tree}
                    startingTeeId={startingTeeId}
                    finalTreeId={finalTreeId}
                    currentTreeId={currentTreeId}
                    showPath={showPath}
                    className={clsx(
                      isPathForward && !disabled && 'forest__tree--clickable',
                      isSelected && 'forest__tree--selected',
                      isActive && 'forest__tree--active'
                    )}
                  />
                  {isSelected && currentTreeId !== tree.id && (
                    <IconAvatar
                      icon={<ArrowIcon />}
                      size="large"
                      className={clsx(
                        `forest__arrow-to forest__arrow-to--${getDirection(
                          selection[selectionIndex - 1],
                          tree.id
                        )}`
                      )}
                    />
                  )}

                  {isPathForward && !disabled && (
                    <IconAvatar
                      icon={<ArrowIcon />}
                      size="large"
                      className={clsx(
                        `forest__arrow-to forest__arrow-to--${getDirection(
                          selection[selection.length - 1] ?? activeTree,
                          tree.id
                        )}`
                      )}
                    />
                  )}
                </div>
              );
            }
          }
          const startingSegment = map.findIndex((segment) => segment.playersIds.length > 0);
          const latestSegmentId = map.findIndex((segment) => !segment.passed) - 1;

          return (
            <div key={`tree-${tree.id}`} className="forest__tree-container">
              <ForestTree
                segment={segment}
                tree={tree}
                startingTeeId={startingTeeId}
                finalTreeId={finalTreeId}
                currentTreeId={currentTreeId}
                showPath={showPath}
                hidePassedTreeNames={hidePassedTreeNames}
              />
              {tree.id}
              <ViewIf condition={showPlayerPositions && !!players}>
                {segment?.playersIds?.length > 0 ? (
                  <div className="forest__players">
                    <PlayerPositions players={players!} playerIds={segment?.playersIds ?? []} user={user} />
                  </div>
                ) : (
                  <div className="forest__players">
                    <PlayerPositions
                      players={players!}
                      playerIds={getPlayersHere(
                        players ?? {},
                        activePlayerId,
                        tree.id,
                        startingSegment,
                        latestSegmentId
                      )}
                      user={user}
                    />
                  </div>
                )}
              </ViewIf>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type PlayerPositionsProps = {
  players: GamePlayers;
  playerIds: PlayerId[];
  user?: GamePlayer;
};

function PlayerPositions({ players, playerIds, user }: PlayerPositionsProps) {
  const list = playerIds.map((playerId) => players[playerId]);
  return <AvatarGroup list={list} user={user} />;
}

const getPlayersHere = (
  players: GamePlayers,
  activePlayerId: PlayerId,
  treeId: number,
  startingTreeId: number,
  latestSegmentId: number
) => {
  if (latestSegmentId < 1) return [];

  const playersHere: PlayerId[] = [];
  Object.values(players).forEach((player) => {
    const history: Record<string, TreeId[]> = player.history?.[activePlayerId] ?? {};

    // If its a segment before the latest one, display
    const segments = Object.keys(history).filter(
      (segmentId) => Number(segmentId) > startingTreeId && Number(segmentId) < latestSegmentId
    );

    segments.forEach((segmentId) => {
      if (history[segmentId].includes(treeId)) {
        playersHere.push(player.id);
      }
    });
  });

  return playersHere;
};
