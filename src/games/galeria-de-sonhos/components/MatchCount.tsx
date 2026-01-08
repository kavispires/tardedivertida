// Types
import type { GamePlayer } from 'types/player';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PlayerHighlight } from 'components/metrics/PlayerHighlight';
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { StarPoints } from 'components/points';
import { FireworksEffect } from 'components/visual-effects/FireworksEffect';

type MatchCountProps = {
  matchCount: number;
  lastActivePlayer: GamePlayer;
  playerInNightmare?: GamePlayer;
};

export function MatchCount({ matchCount, lastActivePlayer, playerInNightmare }: MatchCountProps) {
  const isSpark = matchCount > 0;
  const isSuperSpark = matchCount === 1;

  const isPlayerInNightmare = playerInNightmare?.id === lastActivePlayer.id;

  return (
    <div className="match-count-container">
      {isSpark ? (
        <Translate
          pt={
            <p>
              E encontrou{' '}
              {matchCount > 1 ? (
                <PlayersHighlight>{matchCount}</PlayersHighlight>
              ) : (
                <PlayerHighlight>{matchCount}</PlayerHighlight>
              )}{' '}
              {pluralize(matchCount, 'jogador')} lá!
              <br />
              {isSuperSpark && 'Brilho total!'}
              <StarPoints keyPrefix="dream-result" quantity={isSuperSpark ? 3 : 2} />
            </p>
          }
          en={
            <p>
              And met{' '}
              {matchCount > 1 ? (
                <PlayersHighlight>{matchCount}</PlayersHighlight>
              ) : (
                <PlayerHighlight>{matchCount}</PlayerHighlight>
              )}{' '}
              {pluralize(matchCount, 'player')} there!
              <br />
              {isSuperSpark && 'Super Spark!'}
              {isSuperSpark && <FireworksEffect />}
              <StarPoints keyPrefix="dream-result" quantity={isSuperSpark ? 3 : 2} />
            </p>
          }
        />
      ) : (
        <Translate
          pt={
            <>
              <h2 className="g-announce-title">Vixi...</h2>
              <p>
                Não sei o que dizer... Ninguém visitou esse sonho e{' '}
                <PlayerAvatarName player={lastActivePlayer} size="small" addressUser /> está fora da rodada.
                <br />
                <small>(as cartas restantes ainda contarão pontos para outros jogadores)</small>{' '}
                {isPlayerInNightmare && (
                  <>
                    <br />
                    Para piorar, <PlayerAvatarName player={lastActivePlayer} size="small" addressUser /> vai
                    perder <PointsHighlight type="negative">1</PointsHighlight>
                    ponto por sonho usado até então.
                  </>
                )}
              </p>
            </>
          }
          en={
            <>
              <h2 className="g-announce-title">Oops...</h2>
              <p>
                I don't know what to say... no one has visited this dream and{' '}
                <PlayerAvatarName player={lastActivePlayer} size="small" addressUser /> is/are out of the
                round.
                <br />
                <small>(the remaining cards will still count towards scoring for other players)</small>
                {isPlayerInNightmare && (
                  <>
                    <br />
                    To make this worse,{' '}
                    <PlayerAvatarName player={lastActivePlayer} size="small" addressUser /> will lose{' '}
                    <PointsHighlight type="negative">1</PointsHighlight> point for each scored dream.
                  </>
                )}
              </p>
            </>
          }
        />
      )}
    </div>
  );
}
