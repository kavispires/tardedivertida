// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { MonsterImage } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import type { UseStep } from 'hooks/useStep';
// Components
import { TimedButton } from 'components/buttons/TimedButton';
import { MonsterCard } from 'components/cards/MonsterCard';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { Step, type StepProps } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Sketch } from './utils/types';
import { MonsterSketches } from './components/MonsterSketches';

type StepResultsProps = {
  currentMonster: MonsterImage;
  goToNextStep: UseStep['goToNextStep'];
  sketches: Sketch[];
  user: GamePlayer;
  players: GamePlayers;
  witnessVote: UID;
  witness: GamePlayer;
  mostVotes: UID[];
  mostVoted: UID | null;
  votes: Record<UID, UID[]>;
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
    },
  );

  return (
    <Step
      fullWidth
      announcement={announcement}
      hidePlayersBar
    >
      <StepTitle>
        {mostVoted ? (
          <Translate
            pt="O retrato mais votado foi..."
            en="The sketch who got the most votes was..."
          />
        ) : (
          <Translate
            en="The sketches who got the most votes were..."
            pt="Os retratos que mais receberam votos foram..."
          />
        )}
      </StepTitle>

      <RuleInstruction type="event">
        {Boolean(mostVoted) && mostVotes.length > 1 && (
          <>
            <Translate
              pt="Dois ou mais retratos empataram com a mesma quantidade de votos, mas o voto da testemunha determinou o vencedor."
              en="Two or more sketches tied with the same amount of votes, but the witness' vote determined the winner."
            />
            <br />
          </>
        )}
        {mostVoted ? (
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
      </RuleInstruction>

      <div className="r-monster-list">
        <MonsterCard
          currentMonster={currentMonster}
          style={{ width: `${canvasWidth * 2}px` }}
        />
        <MonsterSketches
          sketches={mostVotedSketches}
          players={players}
          canvasSize={canvasSize}
          canvasWidth={canvasWidth}
        />
      </div>

      <RuleInstruction type="scoring">
        {mostVotes.includes(witnessVote) ? (
          <Translate
            pt={
              <>
                A testemunha <PlayerAvatarName player={witness} /> votou no mais votado, logo, é uma
                testemunha confiável e ganha <PointsHighlight type="positive">2</PointsHighlight> pontos
                também.
              </>
            }
            en={
              <>
                The witness <PlayerAvatarName player={witness} /> voted with the group which means they are a
                credible witness and get <PointsHighlight type="positive">2</PointsHighlight> points as well.
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                A testemunha achou que o desenho de <PlayerAvatarName player={players[witnessVote]} /> foi o
                melhor, não votou com a maioria, portanto, não ganha pontos.
              </>
            }
            en={
              <>
                The witness thought that <PlayerAvatarName player={players[witnessVote]} />
                's sketch was the best. They didn't vote with the majority, so they don't get any points.
              </>
            }
          />
        )}
      </RuleInstruction>

      <TimedButton
        duration={30}
        onExpire={goToNextStep}
        onClick={goToNextStep}
        icon={<TrophyOutlined />}
      >
        <Translate
          pt="Ver Ranking"
          en="See Ranking"
        />
      </TimedButton>

      <StepTitle
        level={3}
        className="r-other-sketches-title"
      >
        <Translate
          pt="Outros desenhos"
          en="Other sketches"
        />
      </StepTitle>

      <SpaceContainer>
        <MonsterSketches
          sketches={otherSketches}
          players={players}
          canvasSize={canvasSize / 1.5}
          canvasWidth={canvasWidth / 1.5}
          votes={votes}
        />
      </SpaceContainer>
    </Step>
  );
}
