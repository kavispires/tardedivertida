import clsx from 'clsx';
import { findLast } from 'lodash';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Fragment } from 'react/jsx-runtime';
// Ant Design Resources
import { FullscreenExitOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Flex, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useScreenSize } from 'hooks/useScreenSize';
// Utils
import { PLACEHOLDER_PLAYER } from 'utils/constants';
// Icons
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
import { ArrowIcon } from 'icons/ArrowIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { AvatarGroup } from 'components/avatars/AvatarGroup';
import { ViewIf } from 'components/views';
// Internal
import type { MapSegment, PlayerMapping, Tree, TreeId } from '../utils/types';
import { getDirection } from '../utils/helpers';
import { ForestTree } from './ForestTree';

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
  players?: GamePlayers;
  size?: 'small' | 'large';
  hidePassedTreeNames?: boolean;
  user?: GamePlayer;
  forestBorderColor?: string;
  playerMapping?: PlayerMapping;
};

export function Forest({
  forest,
  map = [],
  showPath,
  actions,
  players,
  size = 'large',
  hidePassedTreeNames = false,
  user = PLACEHOLDER_PLAYER,
  forestBorderColor = 'transparent',
  playerMapping,
}: ForestProps) {
  const [screenWidth] = useScreenSize();
  const treeWidth = useCardWidth(7, { gap: 16, minWidth: 60, maxWidth: 100 });

  if (!forest || !map || map.length === 0 || !screenWidth) {
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

  const forestFullWidth = 150 * 7 + 72;
  const isSmall = size === 'small';
  const proportion = isSmall ? 0.5 : 0.9;
  const initialScale = Math.min(forestFullWidth, screenWidth * proportion) / forestFullWidth;

  return (
    <div className="forest-container-area">
      <TransformWrapper
        initialScale={initialScale}
        minScale={0.5}
        maxScale={4}
        wheel={{ step: 0.05, disabled: true }}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <Fragment>
            <ForestControls
              position="top"
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetTransform={resetTransform}
            />
            <ForestControls
              position="bottom"
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetTransform={resetTransform}
            />

            <TransformComponent
              wrapperClass={clsx('forest-container', size === 'small' && 'forest-container--small')}
            >
              <div className="forest" style={{ borderColor: forestBorderColor }}>
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
                            width={treeWidth}
                          />
                          {isSelected && currentTreeId !== tree.id && (
                            <>
                              <span
                                className={clsx(
                                  `forest__arrow-from-line forest__arrow-from-line--${getDirection(
                                    selection[selectionIndex - 1],
                                    tree.id
                                  )}`,
                                  isSelected && 'forest__tree--selected',
                                  isActive && 'forest__tree--active'
                                )}
                              />
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
                            </>
                          )}

                          {isPathForward && !disabled && (
                            <>
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
                            </>
                          )}

                          <ViewIf condition={!!players && !!playerMapping?.[tree.id]}>
                            <div className="forest__players">
                              <PlayerPositions
                                players={players!}
                                playerIds={playerMapping?.[tree.id] ?? []}
                                user={user}
                              />
                            </div>
                          </ViewIf>
                        </div>
                      );
                    }
                  }

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
                        width={treeWidth}
                      />

                      <ViewIf condition={!!players && !!playerMapping?.[tree.id]}>
                        <div className="forest__players">
                          <PlayerPositions
                            players={players!}
                            playerIds={playerMapping?.[tree.id] ?? []}
                            user={user}
                          />
                        </div>
                      </ViewIf>
                    </div>
                  );
                })}
              </div>
            </TransformComponent>
          </Fragment>
        )}
      </TransformWrapper>
    </div>
  );
}

type PlayerPositionsProps = {
  players: GamePlayers;
  playerIds: PlayerId[];
  user?: GamePlayer;
};

function PlayerPositions({ players, playerIds, user }: PlayerPositionsProps) {
  const { translate } = useLanguage();
  const list = playerIds.map((playerId) => players[playerId]);
  return (
    <AvatarGroup
      list={list}
      user={user}
      tooltipPrefix={translate('Último lugar visitado por: ', 'Last visited place by: ')}
    />
  );
}

type ForestControlsProps = {
  position: 'top' | 'bottom';
  zoomIn: (step: number) => void;
  zoomOut: (step: number) => void;
  resetTransform: () => void;
};

function ForestControls({ zoomIn, zoomOut, resetTransform, position }: ForestControlsProps) {
  return (
    <Flex
      className={clsx('forest-container-controls', `forest-container-controls--${position}`)}
      justify="center"
    >
      <Flex>
        <Button onClick={() => zoomIn(0.1)} size="small">
          <ZoomInOutlined />
        </Button>
        <Button onClick={() => zoomOut(0.1)} size="small">
          <ZoomOutOutlined />
        </Button>
        <Button onClick={() => resetTransform()} size="small">
          <FullscreenExitOutlined />
        </Button>
      </Flex>
    </Flex>
  );
}
