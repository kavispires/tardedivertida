// Constants
import { PHASES } from '../../utils/phases';
// Hooks
import useGlobalState from '../../hooks/useGlobalState';
// Components
import { AvatarEntry, PhaseContainer } from '..';
import Join from './_internal/Join';
import Waiting from './_internal/Waiting';
import { CloudBackground } from './_internal/CloudBackground';

type PhaseLobbyProps = {
  players: GamePlayers;
  info: GameInfo;
};

export function PhaseLobby({ players, info }: PhaseLobbyProps) {
  const [userId] = useGlobalState('userId');
  const [username] = useGlobalState('username');
  const [userAvatarId] = useGlobalState('userAvatarId');

  return (
    <PhaseContainer phase="LOBBY" allowedPhase={PHASES.DEFAULT.LOBBY} info={info}>
      <div className="lobby__room">
        {Object.values(players).map((player, index) => (
          <AvatarEntry
            key={player.name}
            id={player.avatarId}
            name={player.name}
            className={`lobby__seat lobby__seat--${index}`}
            animate
          />
        ))}

        {userId && username && userAvatarId !== undefined ? (
          <Waiting players={players} info={info} />
        ) : (
          <Join players={players} info={info} />
        )}
      </div>

      <CloudBackground gameCode={info.gameCode} />
    </PhaseContainer>
  );
}