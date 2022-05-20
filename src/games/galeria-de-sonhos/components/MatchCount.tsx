// Utils
import { pluralize } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { StarPoints } from 'components/points';

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
    <div>
      {isSpark ? (
        <Translate
          pt={
            <p>
              E encontrou {matchCount} {pluralize(matchCount, 'jogador', 'jogadores')} lá!
              <br />
              {isSuperSpark && 'Brilho total!'}
              <StarPoints keyPrefix="dream-result" quantity={isSuperSpark ? 3 : 2} />
            </p>
          }
          en={
            <p>
              And met {matchCount} {pluralize(matchCount, 'player', 'players')} there!
              <br />
              {isSuperSpark && 'Super Spark!'}
              <StarPoints keyPrefix="dream-result" quantity={isSuperSpark ? 3 : 2} />
            </p>
          }
        />
      ) : (
        <Translate
          pt={
            <>
              <h2 className="g-announce-title">Vixi...</h2>
              Não sei o que dizer... Ninguém visitou esse sonho e{' '}
              <AvatarName player={lastActivePlayer} size="small" addressUser /> está fora da rodada{' '}
              <small>(as cartas restantes ainda contarão pontos para outros jogadores)</small>.
              {isPlayerInNightmare && (
                <>
                  Para piorar, <AvatarName player={lastActivePlayer} size="small" addressUser /> vai perder 1
                  ponto por sonho usado até então.
                </>
              )}
            </>
          }
          en={
            <>
              <h2 className="g-announce-title">Oops...</h2>I don't know what to say... no one has visited this
              dream and <AvatarName player={lastActivePlayer} size="small" addressUser /> is/are out of the
              round <small>(the remaining cards will still count towards scoring for other players)</small>.
              {isPlayerInNightmare && (
                <>
                  To make this worse, <AvatarName player={lastActivePlayer} size="small" addressUser /> will
                  lose a point for each scored dream.
                </>
              )}
            </>
          }
        />
      )}
    </div>
  );
}
