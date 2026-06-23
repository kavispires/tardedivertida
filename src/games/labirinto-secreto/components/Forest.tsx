import clsx from 'clsx';
import { findLast } from 'lodash';
import { useMeasure } from 'react-use';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useLanguage } from '@hooks/useLanguage';
import { useScreenSize } from '@hooks/useScreenSize';
// Utils
import { PLACEHOLDER_PLAYER } from '@utils/constants';
// Icons
import { AnimatedProcessingIcon } from '@icons/AnimatedProcessingIcon';
import { ArrowIcon } from '@icons/ArrowIcon';
// Components
import { DivButton } from '@components/buttons/DivButton';
import { Icon } from '@components/general/Icon';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { ZoomPanPinchContainer } from '@components/layout/ZoomPanPinchContainer';
import { AvatarGroup } from '@components/players/PlayerAvatarGroup';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import type { MapSegment, PlayerMapping, Tree, TreeId } from '../utils/types';
import { getDirection } from '../utils/helpers';
import { ForestTree } from './ForestTree';
import { PlayerPathLines } from './PlayerPathLines';

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
  hidePathLines?: boolean;
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
  hidePathLines,
}: ForestProps) {
  const [screenWidth] = useScreenSize();
  const treeWidth = useCardWidth(7, { gap: 16, minWidth: 60, maxWidth: 100 });

  const [ref, { width }] = useMeasure<HTMLDivElement>();

  if (!forest || !map || map.length === 0 || !screenWidth) {
    return (
      <SpaceContainer vertical>
        <Icon
          icon={<AnimatedProcessingIcon />}
          size="large"
        />
      </SpaceContainer>
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

  const showPreviousGuesses = !!players && (!actions?.selection || actions.selection.length <= 1);

  // Calculate active segment index for path visualization
  const activeSegmentIndex = map.filter((segment) => segment.passed).length;
  const shouldShowPaths =
    !hidePathLines &&
    showPreviousGuesses &&
    !!playerMapping &&
    !!players &&
    activeSegmentIndex > 0 &&
    map[0]?.playerId;

  return (
    <div
      className="forest-container-area"
      style={{
        backgroundColor: forestBorderColor,
      }}
    >
      <ZoomPanPinchContainer
        maxWidth={forestFullWidth}
        wrapperClassName={clsx('forest-container', size === 'small' && 'forest-container--small')}
        persistentZoomKey="labirinto-secreto"
        transformWrapperProps={{
          initialScale,
          minScale: 0.5,
          maxScale: 4,
          wheel: { step: 0.05, disabled: true },
          centerOnInit: true,
        }}
      >
        <div
          className="forest"
          style={{ borderColor: forestBorderColor }}
          ref={ref}
        >
          {shouldShowPaths && players && (
            <PlayerPathLines
              players={players}
              activePlayerId={map[0].playerId}
              activeSegmentIndex={activeSegmentIndex}
              forestSize={width}
            />
          )}
          {forest.map((tree) => {
            const segment = treeMap?.[tree.id];

            if (actions && !tree.blocked) {
              const { selection = [], clickableTrees, onSelectTree, activeTree, disabled } = actions;
              const isPathForward = clickableTrees.includes(tree.id);
              const isClickable = isPathForward || selection.includes(tree.id);

              if (isClickable) {
                const isSelected = selection.includes(tree.id);
                const isActive = activeTree === tree.id;
                const selectionIndex = selection.indexOf(tree.id);

                return (
                  <DivButton
                    key={`tree-${tree.id}`}
                    className={clsx(
                      'forest__tree-container forest__tree-button',
                      isPathForward && disabled && 'forest__tree-button--disabled',
                    )}
                    onClick={() => {
                      if ((isClickable && !disabled) || (isClickable && disabled && !isPathForward)) {
                        onSelectTree(tree.id);
                      }
                    }}
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
                        isActive && 'forest__tree--active',
                      )}
                      width={treeWidth}
                    />
                    {isSelected && currentTreeId !== tree.id && (
                      <>
                        <span
                          className={clsx(
                            `forest__arrow-from-line forest__arrow-from-line--${getDirection(
                              selection[selectionIndex - 1],
                              tree.id,
                            )}`,
                            isSelected && 'forest__tree--selected',
                            isActive && 'forest__tree--active',
                          )}
                        />
                        <Icon
                          icon={<ArrowIcon />}
                          size="large"
                          className={clsx(
                            `forest__arrow-to forest__arrow-to--${getDirection(
                              selection[selectionIndex - 1],
                              tree.id,
                            )}`,
                          )}
                        />
                      </>
                    )}

                    {isPathForward && !disabled && (
                      <Icon
                        icon={<ArrowIcon />}
                        size="large"
                        className={clsx(
                          `forest__arrow-to forest__arrow-to--${getDirection(
                            selection[selection.length - 1] ?? activeTree,
                            tree.id,
                          )}`,
                        )}
                      />
                    )}

                    <ViewIf condition={!!players && showPreviousGuesses}>
                      <div className="forest__players">
                        {!!players && (
                          <PlayerPositions
                            players={players}
                            playerIds={playerMapping?.[tree.id] ?? []}
                            user={user}
                          />
                        )}
                      </div>
                    </ViewIf>
                  </DivButton>
                );
              }
            }

            return (
              <div
                key={`tree-${tree.id}`}
                className="forest__tree-container"
              >
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

                <ViewIf condition={!!players && showPreviousGuesses}>
                  <div className="forest__players">
                    {!!players && (
                      <PlayerPositions
                        players={players}
                        playerIds={playerMapping?.[tree.id] ?? []}
                        user={user}
                      />
                    )}
                  </div>
                </ViewIf>
              </div>
            );
          })}
        </div>
      </ZoomPanPinchContainer>
    </div>
  );
}

type PlayerPositionsProps = {
  players: GamePlayers;
  playerIds: UID[];
  user?: GamePlayer;
};

function PlayerPositions({ players, playerIds, user }: PlayerPositionsProps) {
  const { translate } = useLanguage();
  const list = playerIds.map((playerId) => players[playerId]);
  return (
    <AvatarGroup
      list={list}
      user={user}
      tooltipPrefix={translate({ pt: 'Último lugar visitado por: ', en: 'Last visited place by: ' })}
    />
  );
}
