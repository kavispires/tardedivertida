import { orderBy } from 'lodash';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
// Types
import type { GameMeta } from 'types/game';
import type { GameInfo } from 'types/game-info';
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { resetGlobalState, useGlobalState } from 'hooks/useGlobalState';
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { AdminMenuDrawer } from 'components/admin';
import { AvatarEntry } from 'components/avatars';
import { PhaseContainer } from 'components/phases';
// Internal
import { CloudBackground } from './lobby/CloudBackground';
import { StepJoin } from './lobby/StepJoin';
import { LobbyStep } from './lobby/LobbyStep';
import { StepInfo } from './lobby/StepInfo';
import { StepWaiting } from './lobby/StepWaiting';
// Sass
import './PhaseLobby.scss';

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
  const { step, setStep } = useStep();
  const { currentUser, isAuthenticated } = useCurrentUserContext();
  const [, setUserId] = useGlobalState('userId');
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [localUsername] = useLocalStorage('username', '');
  const [localAvatarId] = useLocalStorage('avatarId', '');

  const player = players?.[currentUser.id];

  useEffect(() => {
    if (player) {
      setStep(2);
      setUserId(player.id);
      setUsername(player.name);
      setUserAvatarId(player.avatarId);
    } else if (isAuthenticated) {
      setStep(1);
      resetGlobalState();
    } else {
      setStep(0);
      setUsername(localUsername ?? '');
      setUserAvatarId(localAvatarId ?? '');
    }
  }, [
    player,
    currentUser.id,
    setStep,
    setUserId,
    setUsername,
    setUserAvatarId,
    isAuthenticated,
    localUsername,
    localAvatarId,
  ]);

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

        <LobbyStep info={info} isLocked={meta.isLocked}>
          {step === 0 && <StepJoin info={info} setStep={setStep} />}
          {step === 1 && <StepInfo info={info} players={players} setStep={setStep} />}
          {step === 2 && <StepWaiting players={players} />}
        </LobbyStep>
      </div>

      <AdminMenuDrawer
        state={{ phase: 'LOBBY', round: { current: 0, total: 0, forceLastRound: false }, players: {} }}
        players={players}
      />
      <CloudBackground
        cloudType={info?.appearance?.clouds}
        backgroundColor={info?.appearance?.backgroundColor}
      />
    </PhaseContainer>
  );
}
