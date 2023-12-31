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
import { Step } from 'components/steps';

type StepVoteProps = {
  isUserTheWitness: boolean;
  currentMonster: Monster;
  onSubmitVote: GenericFunction;
  sketches: Sketch[];
  user: GamePlayer;
  players: GamePlayers;
} & AnnouncementProps;

export function StepVote({
  isUserTheWitness,
  currentMonster,
  sketches,
  onSubmitVote,
  user,
  players,
  announcement,
}: StepVoteProps) {
  const canvasWidth = useCardWidth(Math.min(Object.keys(players).length, 6), {
    gap: 16,
    minWidth: 150,
    maxWidth: 500,
  });
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');

  useEffect(() => {
    if (!canvasSize) {
      // Round to increments of 50
      setCanvasSize(Math.floor(canvasWidth / 50) * 50);
    }
  }, [canvasSize, canvasWidth]); // eslint-disable-line

  return (
    <Step announcement={announcement}>
      <Title>
        <Translate pt="Vote!" en="Vote!" />
      </Title>
      <Instruction contained>
        <Translate
          pt="Vote no desenho que mais se aproxima do monstro."
          en="Vote for the sketch that best represents the monster."
        />
        <br />
        <Translate
          pt={
            <>
              Cada desenho que receber pelo menos um voto, ganha <PointsHighlight>1 ponto</PointsHighlight> e
              o desenho mais votado ganha <PointsHighlight>3 pontos</PointsHighlight>.
            </>
          }
          en={
            <>
              Each sketch that receives at least one vote gets <PointsHighlight>1 point</PointsHighlight> and
              the sketch with the most votes gets <PointsHighlight>3 points</PointsHighlight>.
            </>
          }
        />
        <br />
        <ViewOr condition={isUserTheWitness}>
          <Translate
            pt={
              <>
                Como testemunha, você ganha <PointsHighlight>2 pontos</PointsHighlight> se você escolher o
                desenho mais votado pelos outros jogadores. (E você é o desempate em caso de empate!)
              </>
            }
            en={
              <>
                As the witness, you get <PointsHighlight>2 points</PointsHighlight> if you choose the sketch
                with the most votes from the other players. (And you are the tiebreaker in case of a tie!)
              </>
            }
          />

          <Translate
            pt={<strong>Você não pode votar em si mesmo.</strong>}
            en={<strong>You cannot vote for yourself.</strong>}
          />
        </ViewOr>
      </Instruction>

      <CanvasResizer />

      <Space className="space-container" align="center" wrap>
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
    </Step>
  );
}
