import { useEffect } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Utils
import { useCardWidth, useGlobalState } from 'hooks';
// Components
import { Avatar, CanvasResizer, CanvasSVG, Instruction, Title, Translate } from 'components';
import { MonsterCard } from './MonsterCard';

type StepVoteProps = {
  isUserTheWitness: boolean;
  currentMonster: Monster;
  onSubmitVote: GenericFunction;
  sketches: Sketch[];
  user: Player | PlainObject;
  players: Players;
};

export function StepVote({
  isUserTheWitness,
  currentMonster,
  sketches,
  onSubmitVote,
  user,
  players,
}: StepVoteProps) {
  const canvasWidth = useCardWidth(Math.min(Object.keys(players).length, 6), 16, 150, 500);
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');

  useEffect(() => {
    if (!canvasSize) {
      // Round to increments of 50
      setCanvasSize(Math.floor(canvasWidth / 50) * 50);
    }
  }, [canvasSize, canvasWidth]); // eslint-disable-line

  return (
    <div>
      <Title>
        <Translate pt="Vote!" en="Vote!" />
      </Title>
      <Instruction contained>
        {isUserTheWitness ? (
          <Translate
            pt={
              <>
                Você só ganha ponto se você escolher o desenho mais votado.
                <br />
                Caso você não escolha o mais votado, o jogador que você escolher ganha 1 ponto.
              </>
            }
            en={
              <>
                You only score if you choose the best sketch (the one with the most votes).
                <br />
                If you didn't pick the one, the player you chose gets 1 point.
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                Vote no desenho que mais se aproxima do monstro.
                <br />
                Você não pode votar em si mesmo.
                <br />O desenho (ou desenhos) mais votado receberá 1 ponto!
              </>
            }
            en={
              <>
                Vote for the sketch that best represents the monster.
                <br />
                You cannot vote for yourself.
                <br />
                The sketch (or sketches) with the most votes gets 1 point.
              </>
            }
          />
        )}
      </Instruction>

      <CanvasResizer />

      <Space className="space-container" align="center">
        {sketches.map((sketchObj) => {
          const player = players[sketchObj.playerId];
          return (
            <Space direction="vertical" align="center" key={`sketch-for-player-${sketchObj.playerId}`}>
              <CanvasSVG
                key={`sketch-${sketchObj.playerId}`}
                size={canvasSize || canvasWidth}
                drawing={sketchObj.sketch}
                className="r-sketch"
              />
              <Button
                type="primary"
                onClick={() => onSubmitVote({ vote: player.id })}
                disabled={sketchObj.playerId === user.id}
              >
                <Avatar id={player.avatarId} size="small" /> {player.name}
              </Button>
            </Space>
          );
        })}
      </Space>

      <Space className="space-container" align="center">
        <MonsterCard currentMonster={currentMonster} />
      </Space>
    </div>
  );
}
