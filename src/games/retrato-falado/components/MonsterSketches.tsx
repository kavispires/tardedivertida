// Ant Design Resources
import { Space, Avatar } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { PlayerAvatar } from 'components/avatars';
import { CanvasSVG } from 'components/canvas';
import { Translate } from 'components/language';
// Internal
import type { Sketch } from '../utils/types';

type MonsterSketchesProps = {
  sketches: Sketch[];
  players: GamePlayers;
  canvasSize: number;
  canvasWidth: number;
  votes?: Record<PlayerId, PlayerId[]>;
};

export function MonsterSketches({
  sketches,
  players,
  canvasSize,
  canvasWidth,
  votes = {},
}: MonsterSketchesProps) {
  return (
    <>
      {sketches.map((sketchObj) => {
        const player = players[sketchObj.playerId];
        return (
          <Space
            key={`monster-sketch-item-${sketchObj.playerId}`}
            direction="vertical"
            align="center"
            className="r-monster-sketch"
          >
            <CanvasSVG
              key={`sketch-${sketchObj.playerId}`}
              width={canvasSize || canvasWidth}
              drawing={sketchObj.sketch}
              className="r-sketch"
            />
            <div>
              <PlayerAvatar avatarId={player.avatarId} size="small" /> {player.name}
            </div>
            {(votes?.[player.id] ?? []).length > 0 && (
              <Space align="center">
                <Translate pt="Votos:" en="Votes:" />
                <Avatar.Group max={{ count: 5 }}>
                  {(votes?.[player.id] ?? []).map((vote) => (
                    <PlayerAvatar key={`vote-${vote}`} avatarId={players[vote].avatarId} size="small" />
                  ))}
                </Avatar.Group>
              </Space>
            )}
          </Space>
        );
      })}
    </>
  );
}
