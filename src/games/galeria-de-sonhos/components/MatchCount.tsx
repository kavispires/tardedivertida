// Types
import type { GamePlayer } from 'types/game';
// Utils
import { pluralize } from '@utils/helpers';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerHighlight } from '@components/metrics/PlayerHighlight';
import { PlayersHighlight } from '@components/metrics/PlayersHighlight';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { StarPoints } from '@components/points/StarPoints';
import { FireworksEffect } from '@components/visual-effects/FireworksEffect';

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
        <p>
          <Translate
            pt={`E encontrou {count} ${pluralize(matchCount, 'jogador')} lá!${
              isSuperSpark
                ? `
              <br/>
              Brilho total!`
                : ''
            }{fireworks}{points}`}
            en={`And met {count} ${pluralize(matchCount, 'player')} there!${
              isSuperSpark
                ? `
              <br/>
              Super Spark!`
                : ''
            }{fireworks}{points}`}
            values={{
              count:
                matchCount > 1 ? (
                  <PlayersHighlight>{matchCount}</PlayersHighlight>
                ) : (
                  <PlayerHighlight>{matchCount}</PlayerHighlight>
                ),
              fireworks: isSuperSpark ? <FireworksEffect /> : null,
              points: (
                <StarPoints
                  keyPrefix="dream-result"
                  quantity={isSuperSpark ? 3 : 2}
                />
              ),
            }}
          />
        </p>
      ) : (
        <>
          <h2 className="g-announce-title">
            <Translate
              pt="Vixi..."
              en="Oops..."
            />
          </h2>
          <p>
            <Translate
              pt={`Não sei o que dizer... Ninguém visitou esse sonho e {player} está fora da rodada.
              <br/>
              <small>(as cartas restantes ainda contarão pontos para outros jogadores)</small>${
                isPlayerInNightmare
                  ? `
                <br/>
                Para piorar, {player} vai perder {penalty} por sonho usado até então.`
                  : ''
              }`}
              en={`I don't know what to say... no one has visited this dream and {player} is/are out of the round.
              <br/>
              <small>(the remaining cards will still count towards scoring for other players)</small>${
                isPlayerInNightmare
                  ? `
                <br/>
                To make this worse, {player} will lose {penalty} for each scored dream.`
                  : ''
              }`}
              values={{
                player: (
                  <PlayerAvatarName
                    player={lastActivePlayer}
                    size="small"
                    addressUser
                  />
                ),
                penalty: (
                  <PointsHighlight
                    type="negative"
                    value={1}
                  />
                ),
                small: (text: string) => <small>{text}</small>,
              }}
            />
          </p>
        </>
      )}
    </div>
  );
}
