// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Icons
import { ArrowIcon } from 'icons/ArrowIcon';
import { FlagIcon } from 'icons/FlagIcon';
import { MapIcon } from 'icons/MapIcon';
import { NoIcon } from 'icons/NoIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { TreeCard } from 'components/cards/TreeCard';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
// Internal
import type { MapSegment, Tree } from '../utils/types';
import { TreeImage } from './TreeImage';

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
    <div
      className="space-container player-map"
      style={{ gridTemplateColumns: `repeat(${currentMap.length}, 120px)` }}
    >
      {currentMap.map((segment, index, arr) => {
        const tree = segment.passed ? forest[segment.treeId] : null;

        return (
          <div className="player-map__segment" key={`map-${segment.index}`}>
            <div className="player-map__top">
              {tree ? (
                <TreeImage id={tree.treeType} text={tree.card.text} className="player-map__tree" width={75} />
              ) : (
                <TreeCard id="1" className="player-map__tree-invisible" text="" width={75} />
              )}

              <IconAvatar icon={<MapIcon />} size="large" className="player-map__icon" />

              <div>
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
              </div>

              {segment.index === 0 && (
                <IconAvatar icon={<FlagIcon />} size="small" className="player-map__starting-flag" />
              )}

              {arr.length - 1 !== index && (
                <IconAvatar icon={<ArrowIcon />} size="small" className="player-map__arrow" />
              )}
            </div>

            <div className="player-map__scoring">
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

              <div>{segment.score > 0 && <PointsHighlight>{segment.score}</PointsHighlight>}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
