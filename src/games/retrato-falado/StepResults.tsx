// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useGlobalState } from 'hooks/useGlobalState';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { MonsterCard } from '../../components/cards/MonsterCard';
import { MonsterSketches } from './components/MonsterSketches';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepResultsProps = {
  currentMonster: Monster;
  goToNextStep: GenericFunction;
  sketches: Sketch[];
  user: Player | PlainObject;
  players: GamePlayers;
  mostVotes: PlayerId[];
  witnessVote: any;
  witness: Player | PlainObject;
};

type Sketches = {
  mostVotedSketches: Sketch[];
  otherSketches: Sketch[];
};

export function StepResults({
  sketches,
  players,
  currentMonster,
  goToNextStep,
  mostVotes,
  witnessVote,
  witness,
}: StepResultsProps) {
  useTemporarilyHidePlayersBar();

  const canvasWidth = useCardWidth(Math.min(Object.keys(players).length, 6), 16, 150, 300);
  const [canvasSize] = useGlobalState('canvasSize');

  const { mostVotedSketches, otherSketches } = sketches.reduce(
    (acc: Sketches, sketch) => {
      if (mostVotes.includes(sketch.playerId)) {
        acc.mostVotedSketches.push(sketch);
      } else {
        acc.otherSketches.push(sketch);
      }
      return acc;
    },
    {
      mostVotedSketches: [],
      otherSketches: [],
    }
  );

  return (
    <Step fullWidth>
      <Title>
        {mostVotes.length > 1 ? (
          <Translate
            pt="Os monstros mais votados foram..."
            en="The monsters who got the most votes were..."
          />
        ) : (
          <Translate pt="O monstro mais votado foi..." en="The monster who got the most votes was..." />
        )}
      </Title>

      <Instruction contained>
        {mostVotes.length > 1 ? (
          <Translate
            pt={
              <>
                Esses jogadores ganharam <PointsHighlight type="positive">2</PointsHighlight> pontos cada.
              </>
            }
            en={
              <>
                These players get <PointsHighlight type="positive">2</PointsHighlight> points each.
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                Esse jogador ganha <PointsHighlight type="positive">2</PointsHighlight> pontos.
              </>
            }
            en={
              <>
                This player gets <PointsHighlight type="positive">2</PointsHighlight> points.
              </>
            }
          />
        )}
      </Instruction>

      <div className="r-monster-list">
        <MonsterCard currentMonster={currentMonster} style={{ width: `${canvasWidth * 2}px` }} />
        <MonsterSketches
          sketches={mostVotedSketches}
          players={players}
          canvasSize={canvasSize}
          canvasWidth={canvasWidth}
        />
      </div>

      <Instruction contained>
        {mostVotes.includes(witnessVote) ? (
          <Translate
            pt={
              <>
                A testemunha <AvatarName player={witness} /> votou no mais votado, logo, é uma testemunha
                confiável e ganha <PointsHighlight type="positive">2</PointsHighlight> pontos também.
              </>
            }
            en={
              <>
                The witness <AvatarName player={witness} /> voted with the group which means they are a
                credible witness and get <PointsHighlight type="positive">2</PointsHighlight> points as well.
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                A testemunha achou que o desenho de <AvatarName player={players[witnessVote]} /> foi o melhor,
                esse jogador ganha <PointsHighlight type="positive">1</PointsHighlight> ponto.
              </>
            }
            en={
              <>
                The witness thought that <AvatarName player={players[witnessVote]} />
                's sketch was the best, so they get <PointsHighlight type="positive">1</PointsHighlight>{' '}
                point.
              </>
            }
          />
        )}
      </Instruction>

      <TimedButton duration={30} onExpire={goToNextStep} onClick={goToNextStep}>
        <Translate pt="Ver Ranking" en="See Ranking" />
      </TimedButton>

      <Title level={3} className="r-other-sketches-title">
        <Translate pt="Outros desenhos" en="Other sketches" />
      </Title>

      <Space className="space-container" align="center">
        <MonsterSketches
          sketches={otherSketches}
          players={players}
          canvasSize={canvasSize / 1.5}
          canvasWidth={canvasWidth / 1.5}
        />
      </Space>
    </Step>
  );
}
