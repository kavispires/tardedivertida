import { useEffect } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Utils
import { useCardWidth } from 'hooks/useCardWidth';
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { MonsterCard } from '../../components/cards/MonsterCard';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { CanvasResizer, CanvasSVG } from 'components/canvas';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { CheckSquareOutlined } from '@ant-design/icons';

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
        <ViewOr orCondition={isUserTheWitness}>
          <Translate
            pt={
              <>
                Você só ganha ponto se você escolher o desenho mais votado.
                <br />
                Caso você não escolha o mais votado, o jogador que você escolher ganha{' '}
                <PointsHighlight>1</PointsHighlight> ponto.
              </>
            }
            en={
              <>
                You only score if you choose the best sketch (the one with the most votes).
                <br />
                If you didn't pick the one, the player you chose gets <PointsHighlight>
                  1
                </PointsHighlight>{' '}
                point.
              </>
            }
          />

          <Translate
            pt={
              <>
                Vote no desenho que mais se aproxima do monstro.
                <br />
                Você não pode votar em si mesmo.
                <br />O desenho (ou desenhos) mais votado receberá <PointsHighlight>2</PointsHighlight> ponto!
              </>
            }
            en={
              <>
                Vote for the sketch that best represents the monster.
                <br />
                You cannot vote for yourself.
                <br />
                The sketch (or sketches) with the most votes gets <PointsHighlight>2</PointsHighlight> point.
              </>
            }
          />
        </ViewOr>
      </Instruction>

      <CanvasResizer />

      <Space className="space-container" align="center">
        {sketches.map((sketchObj) => {
          const player = players[sketchObj.playerId];
          const ownDrawing = sketchObj.playerId === user.id;
          return (
            <Space direction="vertical" align="center" key={`sketch-for-player-${sketchObj.playerId}`}>
              <CanvasSVG
                key={`sketch-${sketchObj.playerId}`}
                width={canvasSize || canvasWidth}
                drawing={sketchObj.sketch}
                className="r-sketch"
              />
              <Button
                type="primary"
                onClick={() => onSubmitVote({ vote: player.id })}
                disabled={ownDrawing}
                className="r-vote-button"
              >
                {ownDrawing ? (
                  <Translate pt="Seu" en="Yours" />
                ) : (
                  <>
                    <CheckSquareOutlined /> <Translate pt="Vote neste" en="Vote for this one" />
                  </>
                )}
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
