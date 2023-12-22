import { useMemo } from 'react';
// AntDesign Resources
import { Tooltip } from 'antd';
// Hooks
// Utils
import { sortPlayers } from 'utils/helpers';
// Components
import { VIPLineIcon } from 'icons/VIPLineIcon';
import { ClubberAvatar } from '../../../components/avatars/ClubberAvatar';

type MinigameTitleProps = {
  players: GamePlayers;
  currentRound: number;
};

export function ClubLine({ players, currentRound }: MinigameTitleProps) {
  const { winners, losers } = useMemo(() => {
    const playersList = sortPlayers(players);

    return {
      winners: playersList.filter((player) => player.team[currentRound - 1] === 'W'),
      losers: playersList.filter((player) => player.team[currentRound - 1] === 'L'),
    };
  }, [players, currentRound]);

  return (
    <div className="club-line">
      <div className="club-line__background"></div>
      <div className="club-line__clubbers">
        <div className="club-line__area">
          {winners.map((player) => (
            <div className="club-line__player" key={`${player.id}-${player.clubberId}`}>
              <Tooltip title={player.name}>
                <ClubberAvatar
                  avatarId={player.avatarId}
                  id={player.clubberId}
                  className="club-line__clubber"
                  animate
                />
              </Tooltip>
            </div>
          ))}
        </div>
        <VIPLineIcon className="club-line__vip-icon" />
        <div className="club-line__area">
          {losers.map((player) => (
            <div
              className="club-line__player club-line__player--trash"
              key={`${player.id}-${player.clubberId}`}
            >
              <Tooltip title={player.name}>
                <ClubberAvatar
                  key={`${player.id}-${player.clubberId}`}
                  avatarId={player.avatarId}
                  id={player.clubberId}
                  className="club-line__clubber"
                />
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
