import { Tooltip } from 'antd';
import { VIPLineIcon } from 'components/icons/VIPLineIcon';
import { useMemo } from 'react';
import { sortPlayers } from 'utils/helpers';
import { ClubberAvatar } from './ClubberAvatar';

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
            <Tooltip title={player.name} key={`${player.id}-${player.clubberId}`}>
              <ClubberAvatar
                id={player.avatarId}
                clubberId={player.clubberId}
                className="club-line__player"
                animate
              />
            </Tooltip>
          ))}
        </div>
        <VIPLineIcon className="club-line__vip-icon" />
        <div className="club-line__area">
          {losers.map((player) => (
            <Tooltip title={player.name} key={`${player.id}-${player.clubberId}`}>
              <ClubberAvatar
                key={`${player.id}-${player.clubberId}`}
                id={player.avatarId}
                clubberId={player.clubberId}
                className="club-line__player club-line__player--trash"
              />
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
