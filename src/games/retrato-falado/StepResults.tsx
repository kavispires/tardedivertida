// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import { type MonsterImage } from 'types/tdr';
import type { UseStep } from 'hooks/useStep';
import type { Sketch } from './utils/types';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { MonsterCard } from '../../components/cards/MonsterCard';
import { MonsterSketches } from './components/MonsterSketches';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepResultsProps = {
  currentMonster: MonsterImage;
  goToNextStep: UseStep['goToNextStep'];
  sketches: Sketch[];
  user: GamePlayer;
  players: GamePlayers;
  witnessVote: PlayerId;
  witness: GamePlayer;
  mostVotes: PlayerId[];
  mostVoted: PlayerId;
  votes: Record<PlayerId, PlayerId[]>;
} & Pick<StepProps, 'announcement'>;

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
  mostVoted,
  witnessVote,
  witness,
  announcement,
  votes,
}: StepResultsProps) {
  useTemporarilyHidePlayersBar();

  const canvasWidth = useCardWidth(Math.min(Object.keys(players).length, 6), {
    gap: 16,
    minWidth: 150,
    maxWidth: 300,
  });
  const [canvasSize] = useGlobalLocalStorage('canvasSize');

  const { mostVotedSketches, otherSketches } = sketches.reduce(
    (acc: Sketches, sketch) => {
      if (mostVoted) {
        if (mostVoted === sketch.playerId) {
          acc.mostVotedSketches.push(sketch);
        } else {
          acc.otherSketches.push(sketch);
        }
        return acc;
      }

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
    <Step fullWidth announcement={announcement}>
      <Title>
        {Boolean(mostVoted) ? (
          <Translate pt="O retrato mais votado foi..." en="The sketch who got the most votes was..." />
        ) : (
          <Translate
            en="The sketches who got the most votes were..."
            pt="Os retratos que mais receberam votos foram..."
          />
        )}
      </Title>

      <Instruction contained>
        {Boolean(mostVoted) && mostVotes.length > 1 && (
          <>
            <Translate
              pt="Dois ou mais retratos empataram com a mesma quantidade de votos, mas o voto da testemunha determinou o vencedor."
              en="Two or more sketches tied with the same amount of votes, but the witness' vote determined the winner."
            />
            <br />
          </>
        )}
        {Boolean(mostVoted) ? (
          <Translate
            pt={
              <>
                Esse jogador ganha <PointsHighlight type="positive">3</PointsHighlight> pontos.
              </>
            }
            en={
              <>
                This player gets <PointsHighlight type="positive">3</PointsHighlight> points.
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                Esses jogadores ganharam <PointsHighlight type="positive">3</PointsHighlight> pontos cada.
              </>
            }
            en={
              <>
                These players get <PointsHighlight type="positive">3</PointsHighlight> points each.
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
                não votou com a maioria, portanto, não ganha pontos.
              </>
            }
            en={
              <>
                The witness thought that <AvatarName player={players[witnessVote]} />
                's sketch was the best. They didn't vote with the majority, so they don't get any points.
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
          votes={votes}
        />
      </Space>
    </Step>
  );
}
