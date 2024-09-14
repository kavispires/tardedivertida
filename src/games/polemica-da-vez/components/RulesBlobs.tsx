// Types
import type { GameRound } from 'types/game';
import type { GamePlayer } from 'types/player';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TargetHighlight } from 'components/metrics/TargetHighlight';
import { Instruction } from 'components/text';

type ScoringRulesProps = {
  round: GameRound;
  isFixedRounds: boolean;
  activePlayer?: GamePlayer;
};

export function ScoringRules({ round, activePlayer, isFixedRounds }: ScoringRulesProps) {
  return (
    <Translate
      pt={
        <>
          Todos vão curtir ou des-curtir a polêmica da vez e então devem tentar adivinhar quantas curtidas o
          assunto vai ganhar.
          <br />
          Se você adivinhar corretamente, você ganha <PointsHighlight>3</PointsHighlight> pontos.
          <br />
          Se você escolheu um número a menos ou a mais, você ganha <PointsHighlight>1</PointsHighlight> ponto.
          <br />
          {isFixedRounds ? (
            <>O jogo tem {round.total} rodadas.</>
          ) : (
            <>
              O primeiro jogador a receber <TargetHighlight>10</TargetHighlight> pontos ganha o jogo (ou no
              máximo {round.total} rodadas)
            </>
          )}
          <br />
          {Boolean(activePlayer) && (
            <Instruction contained>
              <AvatarName player={activePlayer!} addressUser /> escolherá o assunto para essa rodada.
            </Instruction>
          )}
        </>
      }
      en={
        <>
          All players must like or dislike a tweet then must vote how trendy it is (how many players liked the
          tweet). If you guess correctly you get <PointsHighlight>3</PointsHighlight> points.
          <br />
          If you got 1 number off (more or less), you get <PointsHighlight>1</PointsHighlight> point.
          <br />
          {isFixedRounds ? (
            <>
              The game will have
              {round.total} rounds.
            </>
          ) : (
            <>
              The first players to get <TargetHighlight>10</TargetHighlight> points wins the game (or a
              maximum of {round.total} rounds)
            </>
          )}
          <br />
          {Boolean(activePlayer) && (
            <Instruction contained>
              <AvatarName player={activePlayer!} addressUser /> will choose the tweet for this round.
            </Instruction>
          )}
        </>
      }
    />
  );
}
