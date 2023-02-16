import { orderBy } from 'lodash';
// Constants
import { PHASES } from 'utils/phases';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { PhaseContainer } from 'components/phases';
import { AvatarEntry } from 'components/avatars';
import { Join } from './lobby/Join';
import { Waiting } from './lobby/Waiting';
import { CloudBackground } from './lobby/CloudBackground';
import { AdminMenuDrawer } from 'components/admin';

type PhaseLobbyProps = {
  players: GamePlayers;
  info: GameInfo;
  meta: GameMeta;
};

type SplitPlayers = {
  left: GamePlayer[];
  right: GamePlayer[];
};

export function PhaseLobby({ players, info, meta }: PhaseLobbyProps) {
  const [userId] = useGlobalState('userId');
  const [username] = useGlobalState('username');
  const [userAvatarId] = useGlobalState('userAvatarId');

  const { left, right } = orderBy(Object.values(players), 'updatedAt').reduce(
    (acc: SplitPlayers, player, index) => {
      if (index % 2 === 0) {
        acc.left.push(player);
      } else {
        acc.right.push(player);
      }

      return acc;
    },
    {
      left: [],
      right: [],
    }
  );

  return (
    <PhaseContainer phase="LOBBY" allowedPhase={PHASES.DEFAULT.LOBBY} info={info}>
      <div className="lobby">
        <div className="lobby__seating-area-left">
          {left.map((player, index) => (
            <div
              className="lobby__seat"
              key={player.name}
              style={{
                transform: `translate(${100 - 10 * index}%`,
                top: `${100 - 10 * index}%`,
                left: `${60 - 30 * (index % 3)}%`,
              }}
            >
              <AvatarEntry player={player} animate />
            </div>
          ))}
        </div>

        <div className="lobby__seating-area-right">
          {right.map((player, index) => (
            <div
              className="lobby__seat"
              key={player.name}
              style={{
                transform: `translate(${100 - 10 * index}%`,
                top: `${100 - 10 * index}%`,
                right: `${80 - 30 * (index % 3)}%`,
              }}
            >
              <AvatarEntry player={player} animate />
            </div>
          ))}
        </div>

        {userId && username && userAvatarId !== undefined ? (
          <Waiting players={players} info={info} meta={meta} />
        ) : (
          <Join players={players} info={info} meta={meta} />
        )}
      </div>

      <AdminMenuDrawer
        state={{ phase: 'LOBBY', round: { current: 0, total: 0, forceLastRound: false } }}
        players={players}
      />
      <CloudBackground
        cloudType={info?.appearance?.clouds}
        backgroundColor={info?.appearance?.backgroundColor}
      />
    </PhaseContainer>
  );
}
