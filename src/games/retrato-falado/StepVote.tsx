import { useEffect } from 'react';
// Ant Design Resources
import { CheckSquareOutlined } from '@ant-design/icons';
import { Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { MonsterImageData } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useGlobalLocalStorage } from '@hooks/useGlobalLocalStorage';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { CanvasResizer } from '@components/canvas/CanvasResizer';
import { CanvasSVG } from '@components/canvas/CanvasSVG';
import { MonsterCard } from '@components/cards/MonsterCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import type { Sketch, SubmitVotePayload } from './utils/types';

type StepVoteProps = {
  isUserTheWitness: boolean;
  currentMonster: MonsterImageData;
  onSubmitVote: (payload: SubmitVotePayload) => void;
  sketches: Sketch[];
  user: GamePlayer;
  players: GamePlayers;
} & Pick<StepProps, 'announcement'>;

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
  const [canvasSize, setCanvasSize] = useGlobalLocalStorage('canvasSize');

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need to depend of functions
  useEffect(() => {
    if (!canvasSize) {
      // Round to increments of 50
      setCanvasSize(Math.floor(canvasWidth / 50) * 50);
    }
  }, [canvasSize, canvasWidth]);

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <Translate
          pt="Vote!"
          en="Vote!"
        />
      </StepTitle>
      <RuleInstruction type="action">
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
        <ViewIf condition={isUserTheWitness}>
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
        </ViewIf>
        <ViewIf condition={!isUserTheWitness}>
          <Translate
            pt={<strong>Você não pode votar em si mesmo.</strong>}
            en={<strong>You cannot vote for yourself.</strong>}
          />
        </ViewIf>
      </RuleInstruction>

      <CanvasResizer />

      <SpaceContainer wrap>
        {sketches.map((sketchObj) => {
          const player = players[sketchObj.playerId];
          const ownDrawing = sketchObj.playerId === user.id;
          return (
            <Space
              orientation="vertical"
              align="center"
              key={`sketch-for-player-${sketchObj.playerId}`}
            >
              <CanvasSVG
                key={`sketch-${sketchObj.playerId}`}
                width={canvasSize || canvasWidth}
                drawing={sketchObj.sketch}
                className="r-sketch"
              />
              <SendButton
                onClick={() => onSubmitVote({ vote: player.id })}
                disabled={ownDrawing}
                className="r-vote-button"
                icon={!ownDrawing && <CheckSquareOutlined />}
                type="primary"
              >
                {ownDrawing ? (
                  <Translate
                    pt="Seu"
                    en="Yours"
                  />
                ) : (
                  <Translate
                    pt="Vote neste"
                    en="Vote for this one"
                  />
                )}
              </SendButton>
            </Space>
          );
        })}
      </SpaceContainer>

      <SpaceContainer>
        <MonsterCard currentMonster={currentMonster} />
      </SpaceContainer>
    </Step>
  );
}
