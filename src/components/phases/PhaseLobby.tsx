// Constants
import { PHASES } from 'utils/phases';
// Hooks
import useGlobalState from 'hooks/useGlobalState';
// Components
import { PhaseContainer } from 'components/phases';
import { AvatarEntry } from 'components/avatars';
import { Join } from './lobby/Join';
import { Waiting } from './lobby/Waiting';
import { CloudBackground } from './lobby/CloudBackground';
import { orderBy } from 'lodash';

type PhaseLobbyProps = {
  players: GamePlayers;
  info: GameInfo;
  meta: GameMeta;
};

export function PhaseLobby({ players, info, meta }: PhaseLobbyProps) {
  const [userId] = useGlobalState('userId');
  const [username] = useGlobalState('username');
  const [userAvatarId] = useGlobalState('userAvatarId');

  return (
    <PhaseContainer phase="LOBBY" allowedPhase={PHASES.DEFAULT.LOBBY} info={info}>
      <div className="lobby__room">
        {orderBy(Object.values(players), 'updatedAt').map((player, index) => (
          <AvatarEntry
            key={player.name}
            id={player.avatarId}
            name={player.name}
            className={`lobby__seat lobby__seat--${index}`}
            animate
          />
        ))}

        {userId && username && userAvatarId !== undefined ? (
          <Waiting players={players} info={info} meta={meta} />
        ) : (
          <Join players={players} info={info} meta={meta} />
        )}
      </div>

      <CloudBackground gameCode={info.gameCode} />
    </PhaseContainer>
  );
}
