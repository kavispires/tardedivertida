// Components
import { AvatarIcon, AvatarName, Translate } from '../../components';

type PlayersDecisionResultProps = {
  players: GamePlayers;
  goingHomePlayerIds: PlayerId[];
  continuingPlayerIds: PlayerId[];
  cashedInCandy: number;
  candyInHand: number;
};

export function PlayersDecisionResult({
  players,
  goingHomePlayerIds,
  continuingPlayerIds,
  cashedInCandy,
  candyInHand,
}: PlayersDecisionResultProps) {
  return (
    <div className="n-players-decision-result">
      <div className="n-players-decision-result__section">
        <h3 className="n-players-decision-result__title">
          <AvatarIcon type="house" />
          <Translate pt="Decidiram voltar pra casa" en="Decided to go back home" />
        </h3>

        <ul className="n-players-decision-result__players">
          {goingHomePlayerIds.length > 0 ? (
            goingHomePlayerIds.map((playerId) => {
              const player = players[playerId];
              return (
                <span key={`going-home-player-${player.id}`} className="n-players-decision-result__player">
                  <AvatarName player={player} />
                </span>
              );
            })
          ) : (
            <p className="n-players-decision-result__players--nobody">
              <Translate pt="Ninguém" en="Nobody" />
            </p>
          )}
        </ul>
        <p className="n-players-decision-result__info">
          {goingHomePlayerIds.length > 0 && (
            <Translate
              pt={
                <>
                  Cada um levou {candyInHand + cashedInCandy} <AvatarIcon type="candy" size="small" /> pra
                  casa.
                </>
              }
              en={
                <>
                  Each one took {candyInHand + cashedInCandy} <AvatarIcon type="candy" size="small" /> home.
                </>
              }
            />
          )}
        </p>
      </div>
      <div className="n-players-decision-result__divider"></div>
      <div className="n-players-decision-result__section">
        <h3 className="n-players-decision-result__title">
          <AvatarIcon type="walk" />
          <Translate pt="Decidiram continuar" en="Decided to continue" />
        </h3>

        <ul className="n-players-decision-result__players">
          {continuingPlayerIds.length > 0 ? (
            continuingPlayerIds.map((playerId) => {
              const player = players[playerId];
              return (
                <span key={`continuing-player-${player.id}`} className="n-players-decision-result__player">
                  <AvatarName player={player} />
                </span>
              );
            })
          ) : (
            <p className="n-players-decision-result__players--nobody">
              <Translate pt="Ninguém" en="Nobody" />
            </p>
          )}
        </ul>
        <p className="n-players-decision-result__info">
          {continuingPlayerIds.length > 0 && (
            <Translate
              pt={
                <>
                  Cada um tem {candyInHand} <AvatarIcon type="candy" size="small" /> na sacolinha.
                </>
              }
              en={
                <>
                  Each one has {candyInHand} <AvatarIcon type="candy" size="small" /> in their bag.
                </>
              }
            />
          )}
        </p>
      </div>
    </div>
  );
}
