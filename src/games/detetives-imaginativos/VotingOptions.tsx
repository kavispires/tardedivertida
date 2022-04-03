import { useMemo } from 'react';
import { orderBy } from 'lodash';
// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { Avatar, AvatarName, Translate } from 'components';

type VotingOptionsProps = {
  isAllDisabled: boolean;
  leaderId: PlayerId;
  players: GamePlayers;
  user?: GamePlayer;
  onVote: GenericFunction;
  isLoading?: boolean;
};

export function VotingOptions({
  players,
  leaderId,
  user,
  onVote,
  isLoading = false,
  isAllDisabled = false,
}: VotingOptionsProps) {
  const votingOptions = useMemo(
    () =>
      orderBy(
        Object.values(players).filter((player) => player.id !== leaderId),
        ['name'],
        ['asc']
      ),
    [players, leaderId]
  );

  return (
    <Space className="space-container d-voting-options" align="center">
      {votingOptions?.map((playerOption) => {
        const votedForPlayer = Object.values(players).filter((player) => player?.vote === playerOption.id);
        return (
          <div className="d-voting-options__container" key={`voting-button-${playerOption.name}`}>
            <Button
              onClick={() => onVote({ vote: playerOption.id })}
              ghost
              size="large"
              disabled={isAllDisabled || user?.vote || isLoading || user?.name === playerOption.name}
            >
              <AvatarName player={playerOption} uppercase />
            </Button>
            <div className="d-voting-options__vote-container">
              <Translate pt="Votos" en="Votes" />: {votedForPlayer.length}
              <ul className="d-voting-options__votes">
                {votedForPlayer.map((vPlayer) => (
                  <Avatar
                    key={`voted-for-player-${vPlayer.id}`}
                    id={vPlayer.avatarId}
                    size="small"
                    alt={vPlayer.name}
                  />
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </Space>
  );
}
