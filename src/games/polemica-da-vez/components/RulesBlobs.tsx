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
    <>
      <Translate
        en="All players must like or dislike a tweet then must vote how trendy it is (how many players liked the
          tweet).
          <br/>
           If you guess correctly you get {correctGuess}.
          <br />
          If you got 1 number off (more or less), you get {closeGuess}."
        pt="Todos vão curtir ou des-curtir a polêmica da vez e então devem tentar adivinhar quantas curtidas o
          assunto vai ganhar.
          <br />
          Se você adivinhar corretamente, você ganha {correctGuess}.
          <br />
          Se você escolheu um número a menos ou a mais, você ganha {closeGuess}."
        values={{
          correctGuess: <PointsHighlight value={3} />,
          closeGuess: <PointsHighlight value={1} />,
        }}
      />

      {isFixedRounds ? (
        <Translate
          pt="<br/>O jogo tem {total} rodadas."
          en="<br/>The game will have {total} rounds."
          values={{ total: round.total }}
        />
      ) : (
        <Translate
          pt="<br/>O primeiro jogador a receber {target} pontos ganha o jogo (ou no
              máximo {total} rodadas)."
          en="<br/>The first player to get {target} points wins the game (or a maximum of {total} rounds)."
          values={{ target: <TargetHighlight>10</TargetHighlight>, total: round.total }}
        />
      )}

      {!!activePlayer && (
        <>
          <br />
          <Surface
            contained
            className="my-4"
          >
            <Translate
              pt="{player} escolherá o assunto para essa rodada."
              en="{player} will choose the topic for this round."
              values={{
                player: (
                  <PlayerAvatarName
                    player={activePlayer}
                    addressUser
                  />
                ),
              }}
            />
          </Surface>
        </>
      )}
    </>
  );
}
