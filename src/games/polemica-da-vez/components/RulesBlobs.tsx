// Types
import type { GameRound, GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { TargetHighlight } from '@components/metrics/TargetHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';

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
          Se você adivinhar corretamente, você ganha <PointsHighlight value={3} />.
          <br />
          Se você escolheu um número a menos ou a mais, você ganha <PointsHighlight value={1} />.
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
          {!!activePlayer && (
            <Surface contained>
              <PlayerAvatarName
                player={activePlayer}
                addressUser
              />{' '}
              escolherá o assunto para essa rodada.
            </Surface>
          )}
        </>
      }
      en={
        <>
          All players must like or dislike a tweet then must vote how trendy it is (how many players liked the
          tweet). If you guess correctly you get <PointsHighlight value={3} />.
          <br />
          If you got 1 number off (more or less), you get <PointsHighlight value={1} />.
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
          {!!activePlayer && (
            <Surface contained>
              <PlayerAvatarName
                player={activePlayer}
                addressUser
              />{' '}
              will choose the tweet for this round.
            </Surface>
          )}
        </>
      }
    />
  );
}
