// Design Resources
import { Space } from 'antd';
// Components
import { Avatar, CanvasSVG } from 'components';

type MonsterSketchesProps = {
  sketches: Sketch[];
  players: Players;
  canvasSize: number;
  canvasWidth: number;
};

export function MonsterSketches({ sketches, players, canvasSize, canvasWidth }: MonsterSketchesProps) {
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
              size={canvasSize || canvasWidth}
              drawing={sketchObj.sketch}
              className="r-sketch"
            />
            <div>
              <Avatar id={player.avatarId} size="small" /> {player.name}
            </div>
          </Space>
        );
      })}
    </>
  );
}
