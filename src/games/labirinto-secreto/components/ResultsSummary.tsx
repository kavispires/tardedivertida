// Ant Design Resources
import { Space, Tooltip } from 'antd';
import { Avatar, IconAvatar } from 'components/avatars';
import { TreeCard } from 'components/cards/TreeCard';
// Components
import { ArrowIcon } from 'icons/ArrowIcon';
import { MapIcon } from 'icons/MapIcon';
import { NoIcon } from 'icons/NoIcon';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type PlayerMapResultsSummaryProps = {
  players: GamePlayers;
  forest: Tree[];
  currentPlayer: GamePlayer;
  user: GamePlayer;
};

export function PlayerMapResultsSummary({
  players,
  forest,
  currentPlayer,
  user,
}: PlayerMapResultsSummaryProps) {
  const currentMap: MapSegment[] = currentPlayer.map.filter((segment: MapSegment) => segment.active);

  return (
    <Space
      wrap
      className="space-container player-map"
      style={{ gridTemplateColumns: `repeat(${currentMap.length}, 100px)` }}
    >
      {currentMap.map((segment, index, arr) => {
        const tree = segment.passed ? forest[segment.treeId] : null;

        return (
          <div className="player-map__segment" key={`map-${segment.index}`}>
            {tree && (
              <TreeCard
                id={String(tree.treeType)}
                className="player-map__tree"
                text={tree.card.text}
                width={75}
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

            {segment.playersIds.length > 0 ? (
              <div className="player-map__players">
                {segment.playersIds.map((playerId) => {
                  const player = players[playerId];
                  return (
                    <Tooltip title={player.name} key={`player-${playerId}`}>
                      <Avatar size="small" id={player.avatarId} />
                    </Tooltip>
                  );
                })}
              </div>
            ) : (
              <div className="player-map__no-players">
                <Translate pt="Nenhum jogador" en="No players" />
              </div>
            )}

            {segment.score > 0 && <PointsHighlight>{segment.score}</PointsHighlight>}
          </div>
        );
      })}
    </Space>
  );
}
