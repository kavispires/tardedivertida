// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Icons
import { ArrowIcon } from '@icons/ArrowIcon';
import { FlagIcon } from '@icons/FlagIcon';
import { MapIcon } from '@icons/MapIcon';
import { NoIcon } from '@icons/NoIcon';
// Components
import { TreeCard } from '@components/cards/TreeCard';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
// Internal
import type { MapSegment, Tree } from '../utils/types';
import { TreeImage } from './TreeImage';

type PlayerMapResultsSummaryProps = {
  players: GamePlayers;
  forest: Tree[];
  currentPlayer: GamePlayer;
};

export function PlayerMapResultsSummary({ players, forest, currentPlayer }: PlayerMapResultsSummaryProps) {
  const currentMap: MapSegment[] = currentPlayer.map.filter((segment: MapSegment) => segment.active);

  return (
    <div
      className="div-container player-map"
      style={{ gridTemplateColumns: `repeat(${currentMap.length}, 120px)` }}
    >
      {currentMap.map((segment, index, arr) => {
        const tree = segment.passed ? forest[segment.treeId] : null;

        return (
          <div
            className="player-map__segment"
            key={`map-${segment.index}`}
          >
            <div className="player-map__top">
              {tree ? (
                <TreeImage
                  id={tree.treeType}
                  text={tree.card.text}
                  className="player-map__tree"
                  width={75}
                />
              ) : (
                <TreeCard
                  treeId="1"
                  className="player-map__tree-invisible"
                  text=""
                  width={75}
                />
              )}

              <Icon
                icon={<MapIcon />}
                size="large"
                className="player-map__icon"
              />

              <div>
                {segment.clues.map((clue) => {
                  return (
                    <div
                      className="player-map__clue"
                      key={`clue-${segment.index}-${clue.id}`}
                    >
                      {clue.text}
                      {clue?.negate && (
                        <Icon
                          icon={<NoIcon />}
                          size="small"
                          className="player-map__clue-no"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {segment.index === 0 && (
                <Icon
                  icon={<FlagIcon />}
                  size="small"
                  className="player-map__starting-flag"
                />
              )}

              {arr.length - 1 !== index && (
                <Icon
                  icon={<ArrowIcon />}
                  size="small"
                  className="player-map__arrow"
                />
              )}
            </div>

            <div className="player-map__scoring">
              {segment.playersIds.length > 0 ? (
                <div className="player-map__players">
                  {segment.playersIds.map((playerId) => {
                    const player = players[playerId];
                    return (
                      <Tooltip
                        title={player.name}
                        key={`player-${playerId}`}
                      >
                        <PlayerAvatar
                          size="small"
                          avatarId={player.avatarId}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              ) : (
                <div className="player-map__no-players">
                  <Translate
                    pt="Nenhum jogador"
                    en="No players"
                  />
                </div>
              )}

              <div>
                {segment.score > 0 && (
                  <PointsHighlight
                    value={segment.score}
                    omitText
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
